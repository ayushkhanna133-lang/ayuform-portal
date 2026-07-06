import os

filepath = 'server.ts'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("res.status(500).json({ error: 'Server error' });", "res.status(500).json({ error: String(error) });")

with open(filepath, 'w') as f:
    f.write(content)
