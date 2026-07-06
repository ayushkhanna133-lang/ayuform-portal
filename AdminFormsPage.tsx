import React, { useState, useEffect } from 'react';

import { supabase, isSupabaseConfigured } from '../../supabase';
import { Form } from '../../types';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      const { data, error } = await supabase.from('forms').select('*').order('created_at', { ascending: false });
      if (data) {
        setForms(data as any[]);
      }
      setLoading(false);
    };
    fetchForms();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await supabase.from('forms').delete().eq('id', id);
      } catch (error) {
        console.warn("Error deleting form", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Forms Management</h1>
          <p className="text-sm text-blue-900/60 mt-1">Manage all your form postings from here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/forms/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2">
            <Plus size={16} /> Add New Form
          </Link>
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
              placeholder="Search forms..." 
              className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2 pl-9 pr-4 text-sm text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-100/50">
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">Form Title</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-blue-900/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-blue-900/60">
                    Loading forms...
                  </td>
                </tr>
              ) : forms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-blue-900/60">
                    No forms found.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <motion.tr 
                    key={form.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-blue-950 line-clamp-1">{form.name}</p>
                      <p className="text-xs text-blue-900/60 mt-0.5">{form.state || ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                        {form.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {form.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/forms/edit/${form.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => form.id && handleDelete(form.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
