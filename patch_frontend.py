import os
import re

# 1. Update AdminSidebar
sidebar_file = 'src/components/admin/AdminSidebar.tsx'
with open(sidebar_file, 'r') as f:
    sidebar = f.read()

nav_pattern = re.compile(r"const navItems = \[.*?\];", re.DOTALL)
new_nav = """const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Forms', path: '/admin/forms', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: BookOpen },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
  ];"""
sidebar = nav_pattern.sub(new_nav, sidebar)
with open(sidebar_file, 'w') as f:
    f.write(sidebar)

# 2. Update HomePage to fetch from 'forms' instead of 'jobs'
home_file = 'src/pages/HomePage.tsx'
with open(home_file, 'r') as f:
    home = f.read()

home = home.replace("from('jobs')", "from('forms')")
home = home.replace(".limit(6);", ".eq('status', 'published').limit(6);")
# Map form data correctly
home = home.replace("""const jobsData: Job[] = (data || []).map((row) => ({
          id: row.id,
          title: row.title || '',
          category: row.category || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: row.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.short_desc || '',
          department: row.department
        }));""", """const jobsData: any[] = (data || []).map((row) => ({
          id: row.id,
          title: row.name || '',
          category: row.category_id || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.description || '',
          department: row.state || ''
        }));""")
with open(home_file, 'w') as f:
    f.write(home)

# 3. Update LatestJobsPage to fetch from 'forms'
jobs_file = 'src/pages/LatestJobsPage.tsx'
with open(jobs_file, 'r') as f:
    jobs = f.read()
jobs = jobs.replace("from('jobs')", "from('forms')")
jobs = jobs.replace(".order('created_at', { ascending: false });", ".eq('status', 'published').order('created_at', { ascending: false });")
jobs = jobs.replace("""const jobsData: Job[] = (data || []).map((row) => ({
          id: row.id,
          title: row.title || '',
          category: row.category || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: row.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.short_desc || '',
          department: row.department
        }));""", """const jobsData: any[] = (data || []).map((row) => ({
          id: row.id,
          title: row.name || '',
          category: row.category_id || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.description || '',
          department: row.state || ''
        }));""")
with open(jobs_file, 'w') as f:
    f.write(jobs)
    
# 4. Update JobDetailPage to fetch from 'forms'
job_detail_file = 'src/pages/JobDetailPage.tsx'
with open(job_detail_file, 'r') as f:
    job_detail = f.read()
job_detail = job_detail.replace("from('jobs')", "from('forms')")
job_detail = job_detail.replace(".order('created_at', { ascending: false }).limit(3);", ".eq('status', 'published').order('created_at', { ascending: false }).limit(3);")
job_detail = job_detail.replace("""const jobData = {
            id: data.id,
            title: data.title || '',
            category: data.category || '',
            date: new Date(data.created_at || Date.now()).toLocaleDateString(),
            thumbnail: data.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
            excerpt: data.short_desc || '',
            department: data.department || '',
            startDate: data.start_date ? new Date(data.start_date).toLocaleDateString() : '',
            lastDate: data.last_date ? new Date(data.last_date).toLocaleDateString() : '',
            qualification: data.qualification || '',
            location: data.location || '',
            status: data.status || 'Active'
          };""", """const jobData = {
            id: data.id,
            title: data.name || '',
            category: data.category_id || '',
            date: new Date(data.created_at || Date.now()).toLocaleDateString(),
            thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
            excerpt: data.description || '',
            department: data.state || '',
            startDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : '',
            lastDate: data.last_date ? new Date(data.last_date).toLocaleDateString() : '',
            qualification: data.eligibility || '',
            location: data.state || '',
            status: data.status || 'Active'
          };""")
job_detail = job_detail.replace("""const relatedData: Job[] = (relatedRes.data || []).map((row) => ({
          id: row.id,
          title: row.title || '',
          category: row.category || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: row.thumbnail_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.short_desc || '',
          department: row.department
        }));""", """const relatedData: any[] = (relatedRes.data || []).map((row) => ({
          id: row.id,
          title: row.name || '',
          category: row.category_id || '',
          date: new Date(row.created_at || Date.now()).toLocaleDateString(),
          thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
          excerpt: row.description || '',
          department: row.state || ''
        }));""")
with open(job_detail_file, 'w') as f:
    f.write(job_detail)

# 5. Remove server.ts logic to use purely Supabase
package_file = 'package.json'
with open(package_file, 'r') as f:
    pkg = f.read()

pkg = pkg.replace('"dev": "tsx server.ts",', '"dev": "vite",')
pkg = pkg.replace('"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",', '"build": "vite build",')
pkg = pkg.replace('"start": "node dist/server.cjs",', '')
with open(package_file, 'w') as f:
    f.write(pkg)

