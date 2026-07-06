import os
import re

filepath = 'server.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the throw error parts with empty mock data if not configured
# Or even better, if supabaseUrl is placeholder, we shouldn't even call supabase.

content = content.replace("const supabase = createClient(supabaseUrl, supabaseKey);",
"""const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.startsWith('http');
const supabase = createClient(supabaseUrl, supabaseKey);""")

# For forms
content = re.sub(
    r"let query = supabase\.from\('forms'\)\.select.*?const \{ data, error, count \} = await query;",
    """if (!isSupabaseConfigured) return { data: [], count: 0, page: pageNum, totalPages: 0 };
        let query = supabase.from('forms').select('*, categories(name)', { count: 'exact' }).eq('status', 'published');
        if (search) query = query.ilike('name', `%${search}%`);
        if (category) query = query.eq('category_id', category);
        if (state) query = query.eq('state', state);
        if (tags) query = query.contains('tags', [tags]);
        query = query.range(offset, offset + limitNum - 1).order('created_at', { ascending: false });
        const { data, error, count } = await query;""",
    content, flags=re.DOTALL
)

# For categories
content = re.sub(
    r"const \{ data, error \} = await supabase\.from\('categories'\)\.select\('\*'\)\.order\('name'\);",
    """if (!isSupabaseConfigured) return [];
        const { data, error } = await supabase.from('categories').select('*').order('name');""",
    content
)

# For form/:id
content = re.sub(
    r"const \{ data, error \} = await supabase\.from\('forms'\)\.select\('\*, categories\(name\)'\)\.eq\('id', id\)\.single\(\);",
    """if (!isSupabaseConfigured) return null;
        const { data, error } = await supabase.from('forms').select('*, categories(name)').eq('id', id).single();""",
    content
)

# For announcements
content = re.sub(
    r"const \{ data, error \} = await supabase\.from\('announcements'\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\)\.limit\(10\);",
    """if (!isSupabaseConfigured) return [];
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(10);""",
    content
)

with open(filepath, 'w') as f:
    f.write(content)
