import React, { useState, useEffect } from 'react';

import { supabase, isSupabaseConfigured } from '../../supabase';
import { MessageCircle, Trash2, CheckCircle, XCircle, Search, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';

interface CommentData {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  createdAt: any;
}

export function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
      const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
      if (data) {
        setComments(data.map(c => ({
          ...c,
          createdAt: c.created_at
        })) as any[]);
      }
    } catch (error) {
      console.warn("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'spam') => {
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
      await supabase.from('comments').update({ status }).eq('id', id);
      setComments(comments.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.warn("Error updating comment status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment permanently?')) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.from('comments').delete().eq('id', id);
        setComments(comments.filter(c => c.id !== id));
      } catch (error) {
        console.warn("Error deleting comment:", error);
      }
    }
  };

  const filteredComments = comments.filter(comment => 
    comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Comments Moderation</h1>
          <p className="text-sm text-blue-900/60 mt-1">Review, approve, or mark comments as spam.</p>
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
              placeholder="Search comments or authors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2 pl-9 pr-4 text-sm text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-blue-50/50">
          {loading ? (
            <div className="p-8 text-center text-sm text-blue-900/60">Loading comments...</div>
          ) : filteredComments.length === 0 ? (
            <div className="p-8 text-center text-sm text-blue-900/60">No comments found.</div>
          ) : (
            filteredComments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 transition-colors ${comment.status === 'pending' ? 'bg-orange-50/30' : comment.status === 'spam' ? 'bg-red-50/30' : 'hover:bg-blue-50/30'}`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-blue-950 flex items-center gap-2">
                        {comment.authorName}
                        {comment.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Pending Review</span>}
                        {comment.status === 'spam' && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Spam</span>}
                      </h3>
                    </div>
                    <div className="text-xs text-blue-900/60 mb-2">
                      On post: <span className="font-semibold text-blue-700">{comment.postTitle || 'Unknown Post'}</span> • {comment.createdAt ? new Date(comment.createdAt.toMillis ? comment.createdAt.toMillis() : comment.createdAt).toLocaleString() : 'N/A'}
                    </div>
                    <p className="text-blue-900/80 text-sm whitespace-pre-wrap bg-white/50 p-4 rounded-xl border border-blue-50">
                      {comment.content}
                    </p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-end md:justify-start gap-2 border-t md:border-t-0 md:border-l border-blue-100/50 pt-4 md:pt-0 md:pl-4 min-w-[120px]">
                    {comment.status !== 'approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(comment.id, 'approved')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button 
                        onClick={() => handleStatusUpdate(comment.id, 'spam')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
                      >
                        <AlertOctagon size={14} /> Spam
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors mt-auto"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
