import React from 'react';
import { Job } from '../types';
import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface JobSidebarProps {
  trendingJobs: Job[];
}

export function JobSidebar({ trendingJobs }: JobSidebarProps) {
  return (
    <div className="space-y-8 sticky top-24">
      {/* Sidebar Widget: Trending */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
            <Flame size={20} />
          </div>
          <h3 className="text-xl font-bold text-blue-950">Trending Now</h3>
        </div>
        
        <div className="space-y-5">
          {trendingJobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="group block">
              <div className="flex flex-col gap-1 border-l-2 border-transparent hover:border-blue-500 pl-3 transition-colors">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                  {job.category}
                </span>
                <h4 className="font-bold text-sm text-blue-950 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {job.title}
                </h4>
                <span className="text-xs text-blue-900/60">{job.date}</span>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-6 w-full justify-center bg-blue-50/50 py-2 rounded-xl">
          View All Trending <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Sidebar Widget: Quick Links */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-xl shadow-blue-900/20 text-white"
      >
        <h3 className="text-xl font-bold mb-6">Quick Resources</h3>
        <ul className="space-y-3">
          <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="flex items-center justify-between hover:bg-white/10 p-2 rounded-xl transition-colors"><span>Latest Results</span> <ArrowRight size={16} className="text-blue-300" /></a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="flex items-center justify-between hover:bg-white/10 p-2 rounded-xl transition-colors"><span>Admit Cards</span> <ArrowRight size={16} className="text-blue-300" /></a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="flex items-center justify-between hover:bg-white/10 p-2 rounded-xl transition-colors"><span>Answer Keys</span> <ArrowRight size={16} className="text-blue-300" /></a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Page coming soon!'); }} className="flex items-center justify-between hover:bg-white/10 p-2 rounded-xl transition-colors"><span>Exam Syllabus</span> <ArrowRight size={16} className="text-blue-300" /></a></li>
        </ul>
      </motion.div>
    </div>
  );
}
