import React, { useState, useEffect } from 'react';

import { supabase, isSupabaseConfigured } from '../../supabase';
import { Bell, Send, Trash2, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  createdAt: any;
  status: 'sent';
}

export function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'urgent'>('info');
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (data) {
        setNotifications(data.map(n => ({ ...n, createdAt: n.created_at })) as NotificationData[]);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    setIsSending(true);
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
      const { data, error } = await supabase.from('notifications').insert([{
        title,
        message,
        type,
        status: 'sent'
      }]).select('*');
      
      if (error) throw error;
      
      if (data) {
        setNotifications([{ ...data[0], createdAt: data[0].created_at }, ...notifications] as any);
      }
      
      setTitle('');
      setMessage('');
      setType('info');
    } catch (error) {
      console.warn("Error sending notification:", error);
      alert("Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this notification record? (It cannot be un-sent from users who already received it)')) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch (error) {
        console.warn("Error deleting notification:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Push Notifications</h1>
        <p className="text-sm text-blue-900/60 mt-1">Send alerts and updates to all registered users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSend} className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
            <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 mb-4">
              <Bell size={20} className="text-blue-500" /> Compose Alert
            </h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. SSC CGL 2026 Results Out!"
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Message</label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Details of the notification..."
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Alert Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="info">Information (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Orange)</option>
                <option value="urgent">Urgent (Red)</option>
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Send size={18} />
              {isSending ? 'Sending Broadcast...' : 'Broadcast to All Users'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> Broadcast History
          </h2>
          
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-sm text-blue-900/60 py-8">Loading history...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-sm text-blue-900/60 py-8">No notifications sent yet.</p>
            ) : (
              notifications.map(notif => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-blue-50 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0
                      ${notif.type === 'urgent' ? 'bg-red-500' : 
                        notif.type === 'success' ? 'bg-green-500' : 
                        notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} 
                    />
                    <div>
                      <h4 className="font-bold text-blue-950">{notif.title}</h4>
                      <p className="text-sm text-blue-900/70 mt-1">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-medium text-blue-900/50">
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Sent</span>
                        <span>{notif.createdAt ? new Date(notif.createdAt.toMillis ? notif.createdAt.toMillis() : notif.createdAt).toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
