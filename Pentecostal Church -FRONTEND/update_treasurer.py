import sys

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\pages\\TreasurerDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_auth = """    useEffect(() => {
        // Authenticate and fetch initial data
        const checkAuth = async () => {
            try {
                const response = await axios.get(getApiUrl('superAdminVerify'), { withCredentials: true });
                if (!response.data.valid) {
                    navigate('/signIn');
                }
                
                // Fetch balance for overview
                const balRes = await axios.get('/api/finance/transactions/balance', { withCredentials: true });
                setBalance(balRes.data);
                
                setLoading(false);
                setTimeout(() => setShowWelcome(false), 3000);
            } catch (err) {
                navigate('/signIn');
            }
        };
        checkAuth();"""

new_auth = """    useEffect(() => {
        // Authenticate and fetch initial data
        const checkAuth = async () => {
            try {
                // Verify finance token exists
                const token = localStorage.getItem('finance_token');
                if (!token) {
                    navigate('/signIn');
                    return;
                }
                
                // Fetch balance for overview using financeApi which handles the JWT token authorization
                const { financeApi } = await import('../services/financeApi');
                const balRes = await financeApi.get('/transactions/balance');
                setBalance(balRes);
                
                setLoading(false);
                setTimeout(() => setShowWelcome(false), 3000);
            } catch (err) {
                console.error('Treasurer Authentication Failed:', err);
                navigate('/signIn');
            }
        };
        checkAuth();"""
content = content.replace(old_auth, new_auth)

old_logout = """    const handleLogout = async () => {
        try {
            await axios.post(getApiUrl('superAdminLogout'), {}, { withCredentials: true });
            navigate('/signIn');
        } catch (err) {
            console.error('Logout failed');
        }
    };"""

new_logout = """    const handleLogout = async () => {
        try {
            localStorage.removeItem('finance_token');
            navigate('/signIn');
        } catch (err) {
            console.error('Logout failed');
        }
    };"""
content = content.replace(old_logout, new_logout)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS")
