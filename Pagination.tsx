import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination() {
  const handleClick = () => alert('Pagination logic coming soon!');
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/60 text-blue-900/40 hover:text-blue-600 hover:bg-white transition-all shadow-sm" disabled>
        <ChevronLeft size={20} />
      </button>
      
      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 border border-blue-600 text-white font-medium shadow-md shadow-blue-600/20 transition-all">
        1
      </button>
      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/60 text-blue-900 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
        2
      </button>
      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/60 text-blue-900 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
        3
      </button>
      
      <span className="text-blue-900/40 px-2">...</span>
      
      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/60 text-blue-900 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
        8
      </button>

      <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-white/60 text-blue-900 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
