import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase';
import { Announcement } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!isSupabaseConfigured) return;
    if (!title || !content) return;
    await supabase.from('announcements').insert([{ title, content }]);
    setTitle('');
    setContent('');
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete announcement?')) {
      await supabase.from('announcements').delete().eq('id', id);
      fetchAnnouncements();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Announcement Management</h1>
        </div>
        <div className="flex flex-col gap-2 max-w-md">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded" />
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="border p-2 rounded" rows={3}></textarea>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded self-start">Publish</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left">
          <thead><tr><th>Title</th><th>Content</th><th>Actions</th></tr></thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id}>
                <td className="font-semibold">{a.title}</td>
                <td className="text-sm text-gray-600">{a.content.substring(0, 50)}...</td>
                <td><button onClick={() => a.id && handleDelete(a.id)} className="text-red-500"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
