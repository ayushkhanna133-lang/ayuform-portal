import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 px-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100/50 -z-10" />
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 shadow-sm border border-blue-200">
            India's #1 Government Job Portal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-tight mb-6">
            Find Your Dream <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Government Job
            </span> Today
          </h1>
          <p className="text-lg text-blue-900/70 mb-10 max-w-2xl mx-auto">
            Get the latest updates on admit cards, results, exam syllabus, and fresh recruitment notifications in one place.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="flex items-center p-2 bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-blue-900/5 rounded-2xl">
            <div className="pl-4 text-blue-400">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search for jobs, results, admit cards..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-blue-950 placeholder:text-blue-900/40 text-lg"
            />
            <button onClick={() => alert('Search functionality coming soon!')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md shadow-blue-600/20 flex items-center gap-2">
              <span className="hidden sm:inline">Search</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <span className="text-sm font-medium text-blue-900/60 flex items-center">Popular:</span>
          {['UPSC', 'SSC CGL', 'Railway NTPC', 'SBI PO', 'Delhi Police'].map((tag) => (
            <button key={tag} onClick={() => alert(`Searching for ${tag}... (Coming Soon)`)} className="text-sm px-4 py-1.5 rounded-full bg-white/60 border border-blue-100 text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm">
              {tag}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
