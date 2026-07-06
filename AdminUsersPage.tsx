import React, { useState, useEffect } from 'react';

import { supabase, isSupabaseConfigured } from '../../supabase';
import { Shield, User, Edit2, Trash2, Search, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  createdAt: any;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (data) {
        setUsers(data.map(u => ({ ...u, createdAt: u.created_at })) as UserData[]);
      }
      setLoading(false);
    } catch (error) {
      console.warn("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
      await supabase.from('users').update({ role: newRole }).eq('id', userId);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (error) {
      console.warn("Error updating role:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.from('users').delete().eq('id', id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.warn("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">User Management</h1>
          <p className="text-sm text-blue-900/60 mt-1">Manage admins, editors, and registered users.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-blue-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-900/40">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2 pl-9 pr-4 text-sm text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-100/50">
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">Joined Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-blue-900/60">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-blue-900/60">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                          {user.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-blue-950">{user.email || 'Unknown Email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select 
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-md focus:outline-none transition-colors border
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                            user.role === 'editor' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                            'bg-blue-100 text-blue-700 border-blue-200'}
                        `}
                      >
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-blue-900/80">
                      {user.createdAt ? new Date(user.createdAt?.toMillis ? user.createdAt.toMillis() : user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
