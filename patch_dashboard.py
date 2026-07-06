import os
import re

filepath = 'src/pages/admin/AdminDashboardPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the fetching logic
content = re.sub(
    r"const fetchStats = async \(\) => \{.*?\};",
    """const fetchStats = async () => {
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
    };""",
    content, flags=re.DOTALL
)

# Update state variables
content = content.replace(
    "const [stats, setStats] = useState({ totalJobs: 0, totalResults: 0, totalAdmitCards: 0, totalUsers: 0 });",
    "const [stats, setStats] = useState({ totalForms: 0, totalCategories: 0, totalAnnouncements: 0, totalUsers: 0 });"
)

# Replace the statCards array definition
content = re.sub(
    r"const statCards = \[.*?\];",
    """const statCards = [
    { title: 'Total Forms', value: stats.totalForms, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12% this week' },
    { title: 'Total Categories', value: stats.totalCategories, icon: Award, color: 'text-green-600', bg: 'bg-green-100', trend: '+5% this week' },
    { title: 'Total Announcements', value: stats.totalAnnouncements, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+18% this week' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+24% this month' },
  ];""",
    content, flags=re.DOTALL
)

# Make sure latest updated forms are mapped properly in the render, wait it maps to recentActivities, which I updated above.
with open(filepath, 'w') as f:
    f.write(content)
