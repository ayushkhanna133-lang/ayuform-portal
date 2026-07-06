import os

files_to_patch = [
    'src/pages/HomePage.tsx',
    'src/pages/LatestJobsPage.tsx',
    'src/pages/JobDetailPage.tsx',
    'src/pages/admin/AdminDashboardPage.tsx',
    'src/pages/admin/AdminJobsPage.tsx',
    'src/pages/admin/AdminJobEditorPage.tsx',
    'src/pages/admin/AdminUsersPage.tsx',
    'src/pages/admin/AdminMediaLibraryPage.tsx',
    'src/pages/admin/AdminMessagesPage.tsx',
    'src/pages/admin/AdminNotificationsPage.tsx',
    'src/pages/admin/AdminCommentsPage.tsx'
]

for filepath in files_to_patch:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. ensure import isSupabaseConfigured
    if 'isSupabaseConfigured' not in content:
        content = content.replace("import { supabase }", "import { supabase, isSupabaseConfigured }")
    
    # 2. replace the manual checks
    import re
    # We want to insert `if (!isSupabaseConfigured) return;` at the start of any fetch function before `supabase.from`
    # or just replace the `if (import.meta... ` stuff.
    
    content = re.sub(
        r"if\s*\(\s*import\.meta\.env\.VITE_SUPABASE_URL[^\)]+\)\s*\{\s*console\.warn[^}]+\}\s*return;\s*\}",
        r"if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }",
        content, flags=re.MULTILINE
    )
    content = re.sub(
        r"if\s*\(\s*import\.meta\.env\.VITE_SUPABASE_URL[^\)]+\)\s*\{\s*console\.warn[^}]+return;\s*\}",
        r"if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }",
        content, flags=re.MULTILINE
    )
    
    # Check if we should insert the check inside the function
    # Let's just find `const { data` or `await supabase` and prepend if not there.
    
    with open(filepath, 'w') as f:
        f.write(content)

