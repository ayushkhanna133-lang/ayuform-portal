import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.startsWith('http');
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Public REST API Endpoints with basic caching (In-memory cache)
  const cache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
    if (cache.has(key)) {
      const { data, timestamp } = cache.get(key);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  };

  app.get('/api/forms', async (req, res) => {
    try {
      const { search, category, state, tags, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const cacheKey = `forms-${search}-${category}-${state}-${tags}-${page}-${limit}`;
      
      const data = await getCachedData(cacheKey, async () => {
        if (!isSupabaseConfigured) return { data: [], count: 0, page: pageNum, totalPages: 0 };
        let query = supabase.from('forms').select('*, categories(name)', { count: 'exact' }).eq('status', 'published');
        if (search) query = query.ilike('name', `%${search}%`);
        if (category) query = query.eq('category_id', category);
        if (state) query = query.eq('state', state);
        if (tags) query = query.contains('tags', [tags]);
        query = query.range(offset, offset + limitNum - 1).order('created_at', { ascending: false });
        const { data, error, count } = await query;
        if (error) throw error;
        
        return { data, count, page: pageNum, totalPages: count ? Math.ceil(count / limitNum) : 0 };
      });
      
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  app.get('/api/categories', async (req, res) => {
    try {
      const data = await getCachedData('categories', async () => {
        if (!isSupabaseConfigured) return [];
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        return data;
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  app.get('/api/form/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const cacheKey = `form-${id}`;
      const data = await getCachedData(cacheKey, async () => {
        if (!isSupabaseConfigured) return null;
        const { data, error } = await supabase.from('forms').select('*, categories(name)').eq('id', id).single();
        if (error) throw error;
        return data;
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  app.get('/api/announcements', async (req, res) => {
    try {
      const data = await getCachedData('announcements', async () => {
        if (!isSupabaseConfigured) return [];
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(10);
        if (error) throw error;
        return data;
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
