import os
import re

filepath = 'src/components/admin/AdminSidebar.tsx'
with open(filepath, 'r') as f:
    content = f.read()

nav_items_replacement = """const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Forms', path: '/admin/forms', icon: Briefcase },
    { name: 'Categories', path: '/admin/categories', icon: Award },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Comments', path: '/admin/comments', icon: MessageCircle },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];"""

content = re.sub(r"const navItems = \[\s*\{.*?\}\s*\];", nav_items_replacement, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

