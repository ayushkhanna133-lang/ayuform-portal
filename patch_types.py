import os

filepath = 'src/types.ts'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace(
"""export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}""",
"""export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  icon?: any;
  count?: number;
}""")

with open(filepath, 'w') as f:
    f.write(content)
