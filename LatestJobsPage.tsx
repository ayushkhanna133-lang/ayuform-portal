import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DetailedJobCard } from '../components/DetailedJobCard';
import { Pagination } from '../components/Pagination';
import { JobSidebar } from '../components/JobSidebar';
import { Search, Filter, SortDesc } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { Job } from '../types';

export function LatestJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [trendingJobs, setTrendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('status', 'published').order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const jobsData: Job[] = (data || []).map((row) => ({
          id: row.id,
          title: row.title || '',
          category: row.category || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: row.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.short_desc || '',
          department: row.department,
          startDate: row.application_start,
          lastDate: row.last_date_apply,
          qualification: row.eligibility,
          location: 'India',
        }));
        
        setAllJobs(jobsData);
        setTrendingJobs(jobsData.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.warn("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Frontend live search filter
  const filteredJobs = useMemo(() => allJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  ), [allJobs, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-0" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Latest Government Jobs</h1>
          <p className="text-blue-200 text-lg max-w-2xl">Find the most recent updates on recruitment, exam notifications, and application deadlines across various departments.</p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-12 relative z-20 pb-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-400">
              <Search size={22} />
            </div>
            <input 
              type="text"
              placeholder="Search by job title, department, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-100/50 rounded-2xl py-4 pl-12 pr-4 text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-lg"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button onClick={() => alert('Category filter coming soon!')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-blue-100 text-blue-900 font-medium px-5 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-sm">
              <Filter size={18} className="text-blue-600" />
              Category
            </button>
            <button onClick={() => alert('Sorting coming soon!')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-blue-100 text-blue-900 font-medium px-5 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-sm">
              <SortDesc size={18} className="text-blue-600" />
              Latest First
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Job List */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-xl font-bold text-blue-950">
                {searchTerm ? `Search Results (${filteredJobs.length})` : 'All Updates'}
              </h2>
            </div>
            
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <DetailedJobCard key={job.id} job={job} index={index} />
                ))
              ) : (
                <div className="text-center py-20 bg-white/50 rounded-3xl border border-white/60">
                  <div className="text-blue-900/40 mb-4 flex justify-center"><Search size={48} /></div>
                  <h3 className="text-xl font-bold text-blue-950 mb-2">No jobs found</h3>
                  <p className="text-blue-900/60">Try adjusting your search keywords.</p>
                </div>
              )}
            </div>
            
            {filteredJobs.length > 0 && <Pagination />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <JobSidebar trendingJobs={trendingJobs} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
