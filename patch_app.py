import os

filepath = 'src/App.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """
import { AdminFormsPage } from './pages/admin/AdminFormsPage';
import { AdminFormEditorPage } from './pages/admin/AdminFormEditorPage';
// import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
// import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
"""
content = content.replace("import { AdminCommentsPage } from './pages/admin/AdminCommentsPage';", "import { AdminCommentsPage } from './pages/admin/AdminCommentsPage';\n" + imports_to_add)

# Add routes
routes_to_add = """
          <Route path="forms" element={<AdminFormsPage />} />
          <Route path="forms/new" element={<AdminFormEditorPage />} />
          <Route path="forms/edit/:id" element={<AdminFormEditorPage />} />
"""
content = content.replace('<Route path="jobs" element={<AdminJobsPage />} />', '<Route path="jobs" element={<AdminJobsPage />} />' + routes_to_add)

with open(filepath, 'w') as f:
    f.write(content)
