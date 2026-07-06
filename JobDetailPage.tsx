import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  Building2, Calendar, MapPin, GraduationCap, ArrowUpRight, 
  Share2, Bookmark, CheckCircle2, IndianRupee, FileText, ChevronRight, MessageSquare 
} from 'lucide-react';
import { motion } from 'motion/react';
import { JobSidebar } from '../components/JobSidebar';
import { JobSection } from '../components/JobSection';
import { supabase, isSupabaseConfigured } from '../supabase';
import { JobData } from '../types/job';
import { Job } from '../types';

export function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendingJobs, setTrendingJobs] = useState<Job[]>([]);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); setLoading(false); return; }
      try {
        if (id) {
          const { data, error } = await supabase.from('forms').select('*').eq('id', id).single();
          if (data) {
            setJob(data as JobData);
          }
        }
        
        // Fetch trending and related jobs
        const { data, error } = await supabase.from('forms').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3);
        const jobsList: Job[] = (data || []).map((row) => ({
            id: row.id,
            title: row.title || '',
            category: row.category || '',
            date: new Date(row.created_at || Date.now()).toLocaleDateString(),
            thumbnail: row.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
            excerpt: row.short_desc || '',
            department: row.department
        }));
        
        setTrendingJobs(jobsList);
        setRelatedJobs(jobsList);
        setLoading(false);
      } catch (error) {
        console.warn("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-blue-900 font-semibold">Loading details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="text-blue-900 font-semibold text-xl">Job not found</div>
        <Link to="/jobs" className="text-blue-600 hover:underline">Return to jobs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-blue-100/50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-blue-900/60 font-medium overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Latest Jobs</Link>
          <ChevronRight size={14} />
          <span className="text-blue-900 truncate max-w-xs">{job.title}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 w-full py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Job Details Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Banner & Header section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden"
            >
              {/* Background gradient blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {job.category}
                    </span>
                    {job.status && (
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
                        <CheckCircle2 size={14} /> {job.status === 'published' ? 'Active' : job.status}
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 leading-tight">
                    {job.title}
                  </h1>
                  
                  {job.department && (
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
                      <Building2 size={20} />
                      <span>{job.department}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => alert('Link copied to clipboard!')}
                    className="p-3 bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full shadow-sm transition-all"
                    title="Share"
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => alert('Job saved to bookmarks!')}
                    className="p-3 bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full shadow-sm transition-all"
                    title="Save"
                  >
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-blue-100/50 mt-6">
                <div className="space-y-1">
                  <div className="text-blue-900/50 text-xs font-semibold uppercase flex items-center gap-1"><Calendar size={14}/> Posted Date</div>
                  <div className="text-blue-950 font-medium">{job.createdAt ? new Date(job.createdAt as unknown as number).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-blue-900/50 text-xs font-semibold uppercase flex items-center gap-1"><MapPin size={14}/> Location</div>
                  <div className="text-blue-950 font-medium">India</div>
                </div>
                <div className="space-y-1">
                  <div className="text-blue-900/50 text-xs font-semibold uppercase flex items-center gap-1"><GraduationCap size={14}/> Qualification</div>
                  <div className="text-blue-950 font-medium line-clamp-1">{job.eligibility || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-blue-900/50 text-xs font-semibold uppercase flex items-center gap-1"><IndianRupee size={14}/> Salary/Pay</div>
                  <div className="text-blue-950 font-medium">{job.salary || 'As per rules'}</div>
                </div>
              </div>

            </motion.div>

            {/* Overview Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <h2 className="text-2xl font-bold text-blue-950 mb-4 flex items-center gap-2">
                <FileText className="text-blue-500" /> Job Overview
              </h2>
              <p className="text-blue-900/80 leading-relaxed whitespace-pre-line">
                {job.fullDesc || job.shortDesc}
              </p>
            </motion.div>

            {/* Important Dates & Application Fee Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
              >
                <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                  <Calendar className="text-blue-500" /> Important Dates
                </h2>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center pb-4 border-b border-blue-50/50">
                    <span className="text-blue-900/80">Application Start</span>
                    <span className="font-semibold text-blue-950">{job.applicationStart || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-blue-50/50">
                    <span className="text-blue-900/80">Last Date to Apply</span>
                    <span className="font-semibold text-red-500">{job.lastDateApply || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-blue-900/80">Exam Date</span>
                    <span className="font-semibold text-blue-950">{job.examDate || 'To be notified'}</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
              >
                <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                  <IndianRupee className="text-blue-500" /> Application Fee
                </h2>
                <div className="text-blue-900/80 whitespace-pre-line">
                  {job.applicationFee || 'Refer to official notification'}
                </div>
              </motion.div>
            </div>

            {/* Vacancy Details */}
            {job.vacancies && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
              >
                <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                  <Building2 className="text-blue-500" /> Vacancy Details
                </h2>
                <div className="text-blue-900/80 whitespace-pre-line">
                  {job.vacancies}
                </div>
              </motion.div>
            )}

            {/* Age Limit */}
            {job.ageLimit && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
              >
                <h2 className="text-xl font-bold text-blue-950 mb-4">Age Limit</h2>
                <div className="text-blue-900/80 whitespace-pre-line">
                  {job.ageLimit}
                </div>
              </motion.div>
            )}

            {/* Selection Process, Salary, Documents, How to Apply */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-blue-950 mb-3">Eligibility & Qualification</h2>
                <p className="text-blue-900/80 whitespace-pre-line">
                  {job.eligibility || 'Check official notification for full eligibility criteria.'}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-blue-950 mb-3">Salary / Pay Scale</h2>
                <p className="text-blue-900/80 whitespace-pre-line">
                  {job.salary || 'As per government rules.'}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-blue-950 mb-3">Important Documents Required</h2>
                <ul className="list-disc pl-5 space-y-2 text-blue-900/80">
                  <li>Recent Passport Size Photograph</li>
                  <li>Signature</li>
                  <li>10th / 12th / Graduation Marksheets</li>
                  <li>Category Certificate (if applicable)</li>
                  <li>Valid Photo ID Proof (Aadhar, Voter ID, PAN)</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-blue-950 mb-3">How to Apply</h2>
                <ol className="list-decimal pl-5 space-y-2 text-blue-900/80">
                  <li>Visit the official website via the link provided in the 'Important Links' section.</li>
                  <li>Register by filling in basic details like Name, Email, and Mobile Number.</li>
                  <li>Log in with your credentials and complete the application form.</li>
                  <li>Upload the required documents in the prescribed format.</li>
                  <li>Pay the application fee and submit the final form.</li>
                  <li>Take a printout of the submitted application form for future reference.</li>
                </ol>
              </div>
            </motion.div>

            {/* Important Links & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-900/10 text-white relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-2xl font-bold mb-6">Important Links</h2>
              
              <div className="flex flex-col gap-4">
                <a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-4 bg-white text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-colors group">
                  <span>Apply Online</span>
                  <ArrowUpRight size={20} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={job.notificationPdf || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-2xl font-medium hover:bg-white/20 transition-colors group">
                    <span>Official Notification</span>
                    <ArrowUpRight size={18} className="text-blue-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <a href={job.officialWebsite || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-2xl font-medium hover:bg-white/20 transition-colors group">
                    <span>Official Website</span>
                    <ArrowUpRight size={18} className="text-blue-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Comment Section UI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                <MessageSquare className="text-blue-500" /> Discussion & Comments
              </h2>
              
              <div className="space-y-4 mb-8">
                <textarea 
                  placeholder="Ask a question or share your thoughts about this job..."
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[120px] resize-y"
                ></textarea>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-600/20">
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Dummy Comments */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                    RA
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-blue-950">Rahul Agarwal</h4>
                      <span className="text-xs text-blue-900/50">2 hours ago</span>
                    </div>
                    <p className="text-blue-900/80 text-sm">Can final year students apply for this post?</p>
                    <button className="text-blue-600 text-xs font-semibold mt-2 hover:underline">Reply</button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold shrink-0">
                    SK
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-blue-950">Sandeep Kumar</h4>
                      <span className="text-xs text-blue-900/50">5 hours ago</span>
                    </div>
                    <p className="text-blue-900/80 text-sm">The server is very slow while submitting the application fee. Should I wait?</p>
                    <button className="text-blue-600 text-xs font-semibold mt-2 hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <JobSidebar trendingJobs={trendingJobs} />
          </div>

        </div>
      </main>
      
      {/* Related Jobs */}
      <div className="bg-blue-50/50 border-t border-blue-100/50 pt-16 pb-20">
        <JobSection 
          title="Related Jobs" 
          jobs={relatedJobs} 
          viewAllLink="/jobs"
        />
      </div>

      <Footer />
    </div>
  );
}
