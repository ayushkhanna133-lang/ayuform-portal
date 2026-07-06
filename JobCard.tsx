import React from 'react';
import { Job } from '../types';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  key?: React.Key;
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-white/60 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-blue-900/5 rounded-3xl overflow-hidden transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={job.thumbnail} 
          alt={job.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/50 uppercase tracking-wider">
            {job.category}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-2 text-sm text-blue-900/60 font-medium mb-3">
          <Calendar size={16} />
          <span>{job.date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-blue-950 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>
        
        <p className="text-blue-900/70 text-sm mb-6 line-clamp-2 flex-grow">
          {job.excerpt}
        </p>
        
        <div className="pt-4 border-t border-blue-100/50 mt-auto">
          <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
            Read Full Details
            <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
