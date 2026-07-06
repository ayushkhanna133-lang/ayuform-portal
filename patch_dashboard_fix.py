import os
import re

filepath = 'src/pages/admin/AdminDashboardPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("const [stats, setStats]", "const [loading, setLoading] = useState(false);\n  const [recentActivities, setRecentActivities] = useState<any[]>([]);\n  const [stats, setStats]")

with open(filepath, 'w') as f:
    f.write(content)
