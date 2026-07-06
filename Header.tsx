import { Search, Menu, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">AyuForm<span className="text-blue-900">Portal</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-900/80">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Latest Jobs</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Results page coming soon!'); }} className="hover:text-blue-600 transition-colors">Results</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Admit Card page coming soon!'); }} className="hover:text-blue-600 transition-colors">Admit Card</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert('Search feature coming soon!')}
            className="p-2 text-blue-900/70 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => alert('Mobile menu coming soon!')}
            className="md:hidden p-2 text-blue-900/70 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
