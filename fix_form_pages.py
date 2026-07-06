import os
import re

filepath = 'src/pages/admin/AdminFormsPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("import { FormData } from '../../types/form';", "import { Form } from '../../types';")
content = content.replace("const [forms, setForms] = useState<FormData[]>([]);", "const [forms, setForms] = useState<Form[]>([]);")
content = content.replace("form.title", "form.name")
content = content.replace("form.department", "form.state || ''")

with open(filepath, 'w') as f:
    f.write(content)


filepath = 'src/pages/admin/AdminFormEditorPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("Job", "Form")
content = content.replace("job", "form")
content = content.replace("JOB", "FORM")
content = content.replace("import { FormData } from '../../types/form';", "import { Form } from '../../types';")
# A bunch of other replacements...
# Actually, I might want to just recreate AdminFormEditorPage.tsx using a cat command because the form fields are completely different.

