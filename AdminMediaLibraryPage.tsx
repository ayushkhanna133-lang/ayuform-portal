import { supabase, isSupabaseConfigured } from '../../supabase';
import React, { useState, useEffect, useRef } from 'react';

import { Image as ImageIcon, Upload, Trash2, Search, File, Loader } from 'lucide-react';
import { motion } from 'motion/react';

interface MediaItem {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  timeCreated: string;
}

export function AdminMediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
      const { data } = await supabase.storage.from('thumbnails').list('');
      
      const items = await Promise.all((data || []).map(async (itemRef) => {
        const { data: urlData } = await supabase.storage.from('thumbnails').getPublicUrl(itemRef.name);
        return {
          name: itemRef.name,
          url: urlData.publicUrl,
          path: itemRef.name,
          size: itemRef.metadata?.size || 0,
          type: itemRef.metadata?.mimetype || 'unknown',
          timeCreated: itemRef.created_at
        };
      }));
      
      // Sort by newest
      items.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
      
      setMedia(items);
    } catch (error) {
      console.warn("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    for (const file of Array.from(e.target.files) as File[]) {
      const id = Date.now().toString();
      setUploadProgress(prev => ({ ...prev, [id]: 10 }));
      
      try {
        const { error } = await supabase.storage.from('thumbnails').upload(`${Date.now()}_${file.name}`, file);
        if (error) throw error;
      } catch (err) {
         console.warn("Upload error:", err);
      } finally {
         setUploadProgress(prev => { const newP = {...prev}; delete newP[id]; return newP; });
      }
    }
    
    fetchMedia();
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (path: string) => {
    if (window.confirm('Are you sure you want to delete this file? Any posts using it will have broken images.')) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.storage.from('thumbnails').remove([path]);
        setMedia(media.filter(m => m.path !== path));
      } catch (error) {
        console.warn("Error deleting file:", error);
      }
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Media Library</h1>
          <p className="text-sm text-blue-900/60 mt-1">Manage all uploaded images and documents.</p>
        </div>
        <div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Upload size={16} /> Upload New
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload}
            multiple
            accept="image/*,.pdf"
            className="hidden"
          />
        </div>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-white/80 p-4 rounded-2xl border border-blue-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-blue-950">Uploading...</h3>
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="w-full bg-blue-50 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-900/60">
            <Loader className="animate-spin mb-4" size={32} />
            <p>Loading media files...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 text-blue-900/60">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No media files found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <motion.div 
                key={item.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-blue-50/50 border border-blue-100/50 rounded-xl overflow-hidden aspect-square flex flex-col"
              >
                {item.type.includes('image') ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-blue-100/50 text-blue-600">
                    <File size={40} className="mb-2" />
                    <span className="text-xs font-medium px-2 text-center truncate w-full">{item.name}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleDelete(item.path)}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-white text-xs">
                    <p className="truncate font-semibold mb-1" title={item.name}>{item.name}</p>
                    <p className="text-white/70">{formatBytes(item.size)}</p>
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
