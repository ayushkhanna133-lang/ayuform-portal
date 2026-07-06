import React, { useState, useEffect } from 'react';
import { adminStats as fallbackStats, recentActivities as fallbackRecentActivities } from '../../adminData';
import { 
  Briefcase, Award, FileText, Users, TrendingUp, Plus, 
  Send, MoreVertical, ArrowUpRight, BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../../supabase';

import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', posts: 40 },
  { name: 'Feb', posts: 30 },
  { name: 'Mar', posts: 20 },
  { name: 'Apr', posts: 27 },
  { name: 'May', posts: 18 },
  { name: 'Jun', posts: 23 },
  { name: 'Jul', posts: 34 },
];

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>(fallbackRecentActivities);
  const [stats, setStats] = useState({
    totalJobs: fallbackStats.totalJobs,
    totalResults: fallbackStats.totalResults,
    totalAdmitCards: fallbackStats.totalAdmitCards,
    totalUsers: fallbackStats.totalUsers
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured) {
          console.warn('Supabase not configured');
          setLoading(false);
          return;
        }
        
        const [
          { count: formsCount },
          { count: categoriesCount },
          { count: announcementsCount },
          { data: latestFormsData }
        ] = await Promise.all([
          supabase.from('forms').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('announcements').select('*', { count: 'exact', head: true }),
          supabase.from('forms').select('*').order('updated_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalForms: formsCount || 0,
          totalCategories: categoriesCount || 0,
          totalAnnouncements: announcementsCount || 0,
        });
        
        if (latestFormsData) {
            setRecentActivities(latestFormsData.map((f: any) => ({
                id: f.id,
                user: 'Admin',
                action: 'updated',
                target: f.name || 'Form',
                time: new Date(f.updated_at || Date.now()).toLocaleDateString()
            })));
        }

      } catch (error) {
        console.warn("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Forms', value: stats.totalForms, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12% this week' },
    { title: 'Total Categories', value: stats.totalCategories, icon: Award, color: 'text-green-600', bg: 'bg-green-100', trend: '+5% this week' },
    { title: 'Total Announcements', value: stats.totalAnnouncements, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+18% this week' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+24% this month' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Dashboard Overview</h1>
          <p className="text-sm text-blue-900/60 mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Report generating...')} className="bg-white border border-blue-100 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
            Generate Report
          </button>
          <Link to="/admin/jobs/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2">
            <Plus size={16} /> New Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <button onClick={() => alert('Options menu coming soon!')} className="text-blue-900/40 hover:text-blue-950 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900/60 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mb-2">{stat.value.toLocaleString()}</h3>
              <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                <TrendingUp size={12} /> {stat.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} /> Content Analytics
          </h2>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="posts" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-blue-950">Recent Activities</h2>
            <button onClick={() => alert('Activities log coming soon!')} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">View All</button>
          </div>
          <div className="space-y-5">
            {recentActivities.map((activity, i) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="relative mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                  {i !== recentActivities.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[2px] h-full bg-blue-100"></div>
                  )}
                </div>
                <div className="flex-grow pb-1">
                  <p className="text-sm text-blue-950">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-bold text-blue-700">{activity.target}</span>
                  </p>
                  <p className="text-xs text-blue-900/50 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h2 className="text-lg font-bold text-blue-950 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/jobs/new" className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-100 border border-blue-100/50 rounded-2xl transition-colors group">
              <span className="flex items-center gap-3 text-sm font-bold text-blue-950">
                <div className="w-8 h-8 rounded-xl bg-blue-200 text-blue-700 flex items-center justify-center"><Briefcase size={16}/></div>
                Add New Job
              </span>
              <ArrowUpRight size={18} className="text-blue-900/40 group-hover:text-blue-600 transition-colors" />
            </Link>
            <button onClick={() => alert('Results module coming soon!')} className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-100 border border-blue-100/50 rounded-2xl transition-colors group">
              <span className="flex items-center gap-3 text-sm font-bold text-blue-950">
                <div className="w-8 h-8 rounded-xl bg-green-200 text-green-700 flex items-center justify-center"><Award size={16}/></div>
                Publish Result
              </span>
              <ArrowUpRight size={18} className="text-blue-900/40 group-hover:text-blue-600 transition-colors" />
            </button>
            <button onClick={() => alert('Admit Card module coming soon!')} className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-100 border border-blue-100/50 rounded-2xl transition-colors group">
              <span className="flex items-center gap-3 text-sm font-bold text-blue-950">
                <div className="w-8 h-8 rounded-xl bg-orange-200 text-orange-700 flex items-center justify-center"><FileText size={16}/></div>
                Add Admit Card
              </span>
              <ArrowUpRight size={18} className="text-blue-900/40 group-hover:text-blue-600 transition-colors" />
            </button>
            <Link to="/admin/notifications" className="w-full flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors shadow-md shadow-blue-600/20 mt-4 group">
              <span className="flex items-center gap-3 text-sm font-bold">
                <Send size={16} className="text-blue-200" />
                Send Notification
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
