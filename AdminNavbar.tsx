import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

export function AdminNavbar({ toggleSidebar }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/70 backdrop-blur-md border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-blue-900/60 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex relative w-64 lg:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-900/40">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search anywhere..." 
            className="w-full bg-blue-50/50 border border-blue-100/50 rounded-full py-2 pl-9 pr-4 text-sm text-blue-950 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-blue-900/60 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-blue-100/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-blue-950 leading-none">Super Admin</p>
            <p className="text-xs text-blue-900/50 mt-1">admin@ayuform.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 border-2 border-white">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
