import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { JobSection } from '../components/JobSection';
import { Footer } from '../components/Footer';
import { supabase, isSupabaseConfigured } from '../supabase';
import { Job } from '../types';

export function HomePage() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [trendingJobs, setTrendingJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .order('created_at', { ascending: false })
          .eq('status', 'published').limit(6);
          
        if (error) throw error;

        const jobsData: any[] = (data || []).map((row) => ({
          id: row.id,
          title: row.name || '',
          category: row.category_id || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.description || '',
          department: row.state || ''
        }));
        
        setLatestJobs(jobsData);
        // Using the same for trending as a placeholder since we don't have view counts yet
        setTrendingJobs(jobsData.slice(0, 3));
      } catch (error) {
        console.warn("Error fetching jobs:", error);
      }
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Categories />
        
        <div className="space-y-4 pb-20">
          <JobSection 
            title="Latest Updates" 
            jobs={latestJobs} 
            viewAllLink="/jobs"
          />
          
          <JobSection 
            title="Trending Jobs" 
            jobs={trendingJobs} 
            viewAllLink="/jobs"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
