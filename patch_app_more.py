import os

filepath = 'src/App.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
"""
content = content.replace("// import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';", imports_to_add)
content = content.replace("// import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';", "")

# Add routes
routes_to_add = """
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
"""
content = content.replace('<Route path="forms" element={<AdminFormsPage />} />', '<Route path="forms" element={<AdminFormsPage />} />' + routes_to_add)

with open(filepath, 'w') as f:
    f.write(content)
