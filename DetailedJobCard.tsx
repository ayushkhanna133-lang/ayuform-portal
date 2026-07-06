import React from 'react';
import { Job } from '../types';
import { Building2, Calendar, MapPin, GraduationCap, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface DetailedJobCardProps {
  key?: React.Key;
  job: Job;
  index: number;
}

export function DetailedJobCard({ job, index }: DetailedJobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col md:flex-row gap-6 bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:bg-white/90 transition-all duration-300"
    >
      <div className="md:w-1/3 shrink-0 rounded-2xl overflow-hidden relative">
        <img 
          src={job.thumbnail} 
          alt={job.title} 
          className="w-full h-full object-cover min-h-[200px] transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/50 uppercase tracking-wider">
            {job.category}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-blue-950 mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          
          {job.department && (
            <div className="flex items-center gap-2 text-blue-900/70 font-medium mb-4">
              <Building2 size={16} />
              <span>{job.department}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-blue-900/80 mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            {job.startDate && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <span className="font-semibold text-blue-950">Start:</span> {job.startDate}
              </div>
            )}
            {job.lastDate && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-red-400" />
                <span className="font-semibold text-blue-950">End:</span> {job.lastDate}
              </div>
            )}
            {job.qualification && (
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-500" />
                <span className="truncate">{job.qualification}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span>{job.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-medium text-blue-900/50">Posted on: {job.date}</span>
          <Link to={`/jobs/${job.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 group/btn">
            View Details
            <ArrowUpRight size={16} className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
