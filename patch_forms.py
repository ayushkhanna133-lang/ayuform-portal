import os
import re

filepath = 'src/pages/admin/AdminFormsPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace Job to Form
content = content.replace('Job', 'Form').replace('job', 'form').replace('JOB', 'FORM')
content = content.replace('AdminFormsPage', 'AdminFormsPage') # it should be AdminFormsPage since I already replaced Job with Form
content = content.replace('forms', 'forms') # already replaced

# But wait, replace is case sensitive, Job -> Form
content = content.replace('Job', 'Form')
content = content.replace('job', 'form')
content = content.replace('setForms', 'setForms') # wait, jobs -> forms
content = content.replace('forms', 'forms')

with open(filepath, 'w') as f:
    f.write(content)
