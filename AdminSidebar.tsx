import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Award, FileText, Key, 
  GraduationCap, BookOpen, Bell, Users, Settings, LogOut, X, Image as ImageIcon, MessageSquare, MessageCircle
} from 'lucide-react';
import { supabase } from '../../supabase';


interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.warn('Error logging out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Forms', path: '/admin/forms', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: BookOpen },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Logout', path: '/admin/login', icon: LogOut },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-blue-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-blue-100/50">
        <Link to="/admin" className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md shadow-blue-600/30">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">AyuForm<span className="text-blue-900">Admin</span></span>
        </Link>
        <button className="lg:hidden text-blue-900/50 hover:text-blue-950 transition-colors" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        <p className="px-3 text-xs font-bold text-blue-900/40 uppercase tracking-wider mb-2">Main Menu</p>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5' 
                  : 'text-blue-900/70 hover:bg-slate-50 hover:text-blue-950'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-blue-900/50'} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-blue-100/50 space-y-1">
        {bottomNavItems.map((item) => {
          if (item.name === 'Logout') {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-blue-900/70 hover:bg-slate-50 hover:text-blue-950"
              >
                <item.icon size={18} className="text-red-500/70" />
                <span className="text-red-600">{item.name}</span>
              </button>
            );
          }
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5' 
                    : 'text-blue-900/70 hover:bg-slate-50 hover:text-blue-950'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-blue-900/50'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
