import React, { useState, useEffect } from 'react';

import { supabase, isSupabaseConfigured } from '../../supabase';
import { MessageSquare, Trash2, Mail, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: any;
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (data) {
        setMessages(data.map(m => ({ ...m, createdAt: m.created_at })) as ContactMessage[]);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
      await supabase.from('messages').update({ status: 'read' }).eq('id', id);
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.warn("Error updating message:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.from('messages').delete().eq('id', id);
      } catch (error) {
        console.warn("Error deleting message:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Messages & Feedback</h1>
          <p className="text-sm text-blue-900/60 mt-1">Manage contact form submissions and user feedback.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-blue-900/60">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-sm text-blue-900/60">No messages found.</div>
        ) : (
          <div className="divide-y divide-blue-50/50">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 transition-colors ${msg.status === 'new' ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg ${msg.status === 'new' ? 'font-bold text-blue-950' : 'font-semibold text-blue-900'}`}>
                        {msg.subject || 'No Subject'}
                      </h3>
                      {msg.status === 'new' && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-blue-900/60 mb-4">
                      <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                      <span className="flex items-center gap-1"><User size={14} /> {msg.name}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {msg.createdAt ? new Date(msg.createdAt.toMillis ? msg.createdAt.toMillis() : msg.createdAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    <p className="text-blue-900/80 text-sm whitespace-pre-wrap bg-white/50 p-4 rounded-xl border border-blue-50">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-end md:justify-start gap-2 border-t md:border-t-0 md:border-l border-blue-100/50 pt-4 md:pt-0 md:pl-4">
                    {msg.status === 'new' && (
                      <button 
                        onClick={() => markAsRead(msg.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors"
                      >
                        <CheckCircle size={14} /> Mark Read
                      </button>
                    )}
                    <a 
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
                    >
                      <Mail size={14} /> Reply
                    </a>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const User = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
