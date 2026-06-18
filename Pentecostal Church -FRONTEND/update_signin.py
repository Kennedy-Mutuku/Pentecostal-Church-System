import sys

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\components\\signin.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the endpoint and route mapping
old_mapping = """            if (processedEmail === 'patron@rpc-nyamira.co.ke' || processedEmail === 'patron@ksucu-mc.co.ke') {
                // Patron login
                endpoint = getApiUrl('patronLogin');
                route = '/patron';
            } else if (processedEmail === 'assistantpatron@rpc-nyamira.co.ke' || processedEmail === 'assistantpatron@ksucu-mc.co.ke') {
                // Assistant Patron login
                endpoint = getApiUrl('patronLogin'); // Use patronLogin to ensure correct auth cookie is generated
                route = '/assistant-patron';
            } else if (processedEmail === 'chairperson@rpc.ac.ke') {
                // Chairperson login
                endpoint = getApiUrl('superAdmin');
                route = '/chairperson';
            } else if (mapping) {"""

new_mapping = """            if (processedEmail === 'patron@rpc-nyamira.co.ke' || processedEmail === 'patron@ksucu-mc.co.ke') {
                // Patron login
                endpoint = getApiUrl('patronLogin');
                route = '/patron';
            } else if (processedEmail === 'assistantpatron@rpc-nyamira.co.ke' || processedEmail === 'assistantpatron@ksucu-mc.co.ke') {
                // Assistant Patron login
                endpoint = getApiUrl('patronLogin'); // Use patronLogin to ensure correct auth cookie is generated
                route = '/assistant-patron';
            } else if (processedEmail === 'chairperson@rpc.ac.ke') {
                // Chairperson login
                endpoint = getApiUrl('superAdmin');
                route = '/chairperson';
            } else if (processedEmail.startsWith('treasurer@')) {
                // Treasurer login
                endpoint = getApiUrl('superAdmin'); // Uses superAdmin authentication
                route = '/treasurer';
            } else if (mapping) {"""
content = content.replace(old_mapping, new_mapping)

# 2. Add Treasurer to finance token login block
old_finance = """            // Log into the finance backend in the background to get a JWT token if patron/assistant patron
            if (
                processedEmail === 'patron@rpc-nyamira.co.ke' ||
                processedEmail === 'assistantpatron@rpc-nyamira.co.ke' ||
                processedEmail === 'patron@ksucu-mc.co.ke' ||
                processedEmail === 'assistantpatron@ksucu-mc.co.ke'
            ) {"""

new_finance = """            // Log into the finance backend in the background to get a JWT token if patron/assistant patron/treasurer
            if (
                processedEmail === 'patron@rpc-nyamira.co.ke' ||
                processedEmail === 'assistantpatron@rpc-nyamira.co.ke' ||
                processedEmail === 'patron@ksucu-mc.co.ke' ||
                processedEmail === 'assistantpatron@ksucu-mc.co.ke' ||
                processedEmail.startsWith('treasurer@')
            ) {"""
content = content.replace(old_finance, new_finance)

# 3. Track admin session for navbar
old_session = """            } else if (mapping) {
                localStorage.setItem('adminSession', 'true');
                localStorage.removeItem('patronSession');
                localStorage.removeItem('assistantPatronSession');
            } else {"""

new_session = """            } else if (mapping || processedEmail.startsWith('treasurer@') || processedEmail === 'chairperson@rpc.ac.ke') {
                localStorage.setItem('adminSession', 'true');
                localStorage.removeItem('patronSession');
                localStorage.removeItem('assistantPatronSession');
            } else {"""
content = content.replace(old_session, new_session)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS")
