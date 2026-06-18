import sys

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\components\\signin.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update endpoint for Treasurer to hit the finance backend directly
old_mapping = """            } else if (processedEmail.startsWith('treasurer@')) {
                // Treasurer login
                endpoint = getApiUrl('superAdmin'); // Uses superAdmin authentication
                route = '/treasurer';
            } else if (mapping) {"""

new_mapping = """            } else if (processedEmail.startsWith('treasurer@')) {
                // Treasurer login
                endpoint = '/api/finance/auth/login'; // Authenticates directly against the finance backend
                route = '/treasurer';
            } else if (mapping) {"""
content = content.replace(old_mapping, new_mapping)


# 2. Make sure the finance token is stored if it's the primary endpoint
old_post = """            const response = await axios.post(endpoint, loginData, {
                withCredentials: true, // Include cookies in the request
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

             console.log('✅ SignIn: Login successful, response:', response.data);"""

new_post = """            const response = await axios.post(endpoint, loginData, {
                withCredentials: true, // Include cookies in the request
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

             console.log('✅ SignIn: Login successful, response:', response.data);
             
             // If the primary login was against the finance backend, immediately store the JWT token
             if (endpoint === '/api/finance/auth/login' && response.data && response.data.token) {
                 localStorage.setItem('finance_token', response.data.token);
             }"""
content = content.replace(old_post, new_post)

# 3. We no longer need to background-login the treasurer since they are the primary finance login.
old_finance = """            // Log into the finance backend in the background to get a JWT token if patron/assistant patron/treasurer
            if (
                processedEmail === 'patron@rpc-nyamira.co.ke' ||
                processedEmail === 'assistantpatron@rpc-nyamira.co.ke' ||
                processedEmail === 'patron@ksucu-mc.co.ke' ||
                processedEmail === 'assistantpatron@ksucu-mc.co.ke' ||
                processedEmail.startsWith('treasurer@')
            ) {"""

new_finance = """            // Log into the finance backend in the background to get a JWT token if patron/assistant patron
            if (
                processedEmail === 'patron@rpc-nyamira.co.ke' ||
                processedEmail === 'assistantpatron@rpc-nyamira.co.ke' ||
                processedEmail === 'patron@ksucu-mc.co.ke' ||
                processedEmail === 'assistantpatron@ksucu-mc.co.ke'
            ) {"""
content = content.replace(old_finance, new_finance)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS")
