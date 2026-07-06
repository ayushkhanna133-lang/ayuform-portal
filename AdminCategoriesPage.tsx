import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase';
import { Category } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!isSupabaseConfigured) return;
    if (!name) return;
    await supabase.from('categories').insert([{ name, description }]);
    setName('');
    setDescription('');
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete category?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Category Management</h1>
        </div>
        <div className="flex gap-2">
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded" />
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left">
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td><button onClick={() => c.id && handleDelete(c.id)} className="text-red-500"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
