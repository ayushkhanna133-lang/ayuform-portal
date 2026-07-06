import os
import re

files_to_patch = [
    'src/pages/admin/AdminDashboardPage.tsx',
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
    
    if 'isSupabaseConfigured' not in content:
        content = content.replace("import { supabase }", "import { supabase, isSupabaseConfigured }")
        
    def replacer(match):
        return "if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }\n      " + match.group(0)

    # try {
    #   const { data
    # or
    # try {
    #   await supabase
    content = re.sub(
        r"try\s*\{\s*(const \{ data|await supabase|const \w+\s*=\s*await supabase)",
        r"if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }\n      \g<0>",
        content
    )
    
    # or inside fetchFunctions not starting with try {
    # e.g., const { data } = await supabase...
    # we need to be careful not to duplicate.
    
    with open(filepath, 'w') as f:
        f.write(content)

