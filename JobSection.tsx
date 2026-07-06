import { Job } from '../types';
import { JobCard } from './JobCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobSectionProps {
  title: string;
  jobs: Job[];
  viewAllLink?: string;
}

export function JobSection({ title, jobs, viewAllLink = '#' }: JobSectionProps) {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight mb-2">{title}</h2>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
        </div>
        <Link 
          to={viewAllLink} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>
    </section>
  );
}
