import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/RPC logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { Eye, EyeOff, ChevronDown, Shield } from 'lucide-react'
import { getApiUrl, isDevMode } from '../config/environment';
import UserProfile from './userProfile';
import ErrorBoundary from './ErrorBoundary';


const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [generalLoading, setgeneralLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string; course?: string; reg?: string } | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showWhatsAppHelp, setShowWhatsAppHelp] = useState(false);

    const [forgotFullName, setForgotFullName] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPhone, setForgotPhone] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotFieldErrors, setForgotFieldErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

    // Registration state
    const [showRegistration, setShowRegistration] = useState(false);
    const [regData, setRegData] = useState({
        fullName: '',
        phone: '',
        email: '',
        idNumber: '',
        gender: '',
        ageGroup: '',

        yearJoined: '',
        residence: '',
    });
    const [regError, setRegError] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);


    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '');
            setRegData(prev => ({ ...prev, [name]: digitsOnly }));
            return;
        }
        setRegData(prev => ({ ...prev, [name]: value }));
    };



    const handleRegistrationSubmit = (adminPhone: string) => {
        if (!regData.fullName || !regData.phone || !regData.email || !regData.idNumber || !regData.gender || !regData.ageGroup || !regData.yearJoined || !regData.residence) {
            setRegError('Please fill in all fields before submitting.');
            return;
        }
        if (!/^0\d{9}$/.test(regData.phone)) {
            setRegError('Phone number must be 10 digits starting with 0.');
            return;
        }
        if (!acceptedTerms) {
            setRegError('Please accept the terms and conditions to proceed.');
            return;
        }
        setRegError('');

        const message = `Hello RPC Nyamira Admin,\n\nI would like to be registered as a new member on the RPC Nyamira Portal. Below are my details for verification:\n\n*Full Name:* ${regData.fullName}\n*Phone:* ${regData.phone}\n*Email:* ${regData.email}\n*ID Number:* ${regData.idNumber}\n*Gender:* ${regData.gender}\n*Age Group:* ${regData.ageGroup}\n*Year Joined RPC:* ${regData.yearJoined}\n*Residence:* ${regData.residence}\n\nKindly verify and register me. I understand that my login credentials (username & password) will be sent back to me upon successful verification.\n\nThank you and God bless.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/254${adminPhone.substring(1)}?text=${encodedMessage}`, '_blank');
    };



    const handleSendResetLink = (adminPhone: string) => {
        const errors: { fullName?: string; email?: string; phone?: string } = {};

        const nameTrimmed = forgotFullName.trim();
        if (!nameTrimmed) {
            errors.fullName = 'Full name is required.';
        } else if (nameTrimmed.length < 3) {
            errors.fullName = 'Name must be at least 3 characters.';
        } else if (!/^[a-zA-Z\s'-]+$/.test(nameTrimmed)) {
            errors.fullName = 'Name should contain letters only.';
        }

        const emailTrimmed = forgotEmail.trim();
        if (!emailTrimmed) {
            errors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrimmed)) {
            errors.email = 'Enter a valid email address.';
        }

        const phoneTrimmed = forgotPhone.trim();
        if (!phoneTrimmed) {
            errors.phone = 'Phone number is required.';
        } else if (!/^0[7][0-9]{8}$/.test(phoneTrimmed)) {
            errors.phone = 'Enter a valid Kenyan number (e.g., 0712345678).';
        }

        setForgotFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            setForgotError('Please correct the errors below before sending.');
            return;
        }
        setForgotError('');

        const message = `Hello RPC Nyamira SYSTEM ADMIN,\n\nI have lost access to my RPC Nyamira Portal account and kindly request a password reset at your earliest convenience.\n\n*Full Name:* ${nameTrimmed}\n*Email:* ${emailTrimmed}\n*Phone:* ${phoneTrimmed}\n\nThank you and God bless.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/254${adminPhone.substring(1)}?text=${encodedMessage}`, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const [showPassword, setShowPassword] = useState(false);

    // Check if user is already authenticated
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    const checkUserAuthentication = async (retryCount = 0) => {
        console.log('🔍 SignIn: Checking user authentication...');
        try {
            const apiUrl = getApiUrl('users');
            console.log('🔍 SignIn: Fetching user data from:', apiUrl);

            // Add cache-busting and better headers for cross-device compatibility
            const response = await fetch(`${apiUrl}?t=${Date.now()}`, {
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            console.log('🔍 SignIn: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SignIn: User authenticated, data:', data);
                setUserData(data);
                // Check if profile photo exists
                if (!data.profilePhoto && !data.email.includes('admin')) {
                    navigate('/welcome');
                } else {
                    // Automatically redirect to profile page if user is already logged in
                    navigate('/profile');
                }
            } else {
                console.log('SignIn: User not authenticated, response not ok');
            }
        } catch (error) {
            console.log('SignIn: Authentication check failed:', error);

            // Retry logic for production connection issues
            if (retryCount < 2) {
                console.log(`🔄 Retrying authentication check (attempt ${retryCount + 1}/3)...`);
                setTimeout(() => checkUserAuthentication(retryCount + 1), 2000);
                return;
            }

        } finally {
            console.log('🔍 SignIn: Authentication check completed, setting checkingAuth to false');
            setCheckingAuth(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        // Define mappings for email domains to endpoints and routes

        if (formData.email === '' || formData.password === '') {
            setError('All fields required 🙂')
            return
        }

        // Auto-complete common admin emails if missing domain
        let processedEmail = formData.email.toLowerCase().trim();

        // More flexible auto-completion for admin emails
        const adminPatterns = [
            { pattern: /^admin@rpcmcsuperadmi/i, complete: 'admin@rpcmcsuperadmin.co.ke' },  // Handle typos
            { pattern: /^admin@rpcmcsuperadmin$/i, complete: 'admin@rpcmcsuperadmin.co.ke' },  // Exact match without .co.ke
            { pattern: /^admin@rpcmcbsadmin/i, complete: 'admin@rpcmcbsadmin.co.ke' },
            { pattern: /^admin@rpcmcadmissionadmin/i, complete: 'admin@rpcmcadmissionadmin.co.ke' }
        ];

        // Check if the email matches any pattern and doesn't already end with .co.ke
        if (!processedEmail.endsWith('.co.ke')) {
            for (const { pattern, complete } of adminPatterns) {
                if (pattern.test(processedEmail)) {
                    console.log('📧 SignIn: Auto-completing email from:', processedEmail, 'to:', complete);
                    processedEmail = complete;
                    break;
                }
            }
        }

        const domainMappings = [
            { domain: '@rpcmcnewsadmin.co.ke', endpoint: getApiUrl('newsAdmin'), route: '/adminnews' },

            { domain: '@rpcmcmissionadmin.co.ke', endpoint: getApiUrl('missionAdmin'), route: '/adminmission' },

            { domain: '@rpcmcbsadmin.co.ke', endpoint: getApiUrl('bsAdmin'), route: '/adminBs' },

            { domain: '@rpcmcsuperadmin.co.ke', endpoint: getApiUrl('superAdmin'), route: '/admin' },
            { domain: '@rikurumachurch.com', endpoint: getApiUrl('superAdmin'), route: '/admin' },

            { domain: '@rpcmcadmissionadmin.co.ke', endpoint: getApiUrl('admissionAdmin'), route: '/admission' },
        ];

        // Overseer login — check by exact email match
        if (processedEmail === 'overseer@rpc-nyamira.co.ke' || processedEmail === 'overseer@ksucu-mc.co.ke') {
            // Local dev mode bypass
            if (isDevMode() && formData.password === 'Admin01q7') {
                sessionStorage.setItem('adminAuth', 'authenticated');
                window.location.href = '/worship-docket-admin';
                return;
            }

            try {
                const overseerResponse = await axios.post(getApiUrl('overseerLogin'), { email: processedEmail, password: formData.password }, { withCredentials: true, timeout: 30000 });
                if (overseerResponse.data) {
                    sessionStorage.setItem('adminAuth', 'authenticated');
                    window.location.href = '/worship-docket-admin';
                    return;
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Invalid email or password');
                setgeneralLoading(false);
                return;
            }
        }

        // Offline check disabled - always try to login
        // if (!navigator.onLine) {
        //     setError('Check your internet and try again...');
        //     return;
        // }

        window.scrollTo({
            top: 0,
            behavior: 'auto', // 'auto' for instant scroll
        });

        setgeneralLoading(true);

        try {
            // Find the matching configuration based on the email domain
            const mapping = domainMappings.find(mapping =>
                processedEmail?.endsWith(mapping.domain)
            );

            // Determine endpoint and route
            let endpoint: string;
            let route: string;

            if (processedEmail === 'patron@rpc-nyamira.co.ke' || processedEmail === 'patron@ksucu-mc.co.ke') {
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
                endpoint = '/api/finance/auth/login'; // Authenticates directly against the finance backend
                route = '/treasurer';
            } else if (mapping) {
                // Admin domain found
                endpoint = mapping.endpoint;
                route = mapping.route;
            } else if (processedEmail.includes('officer')) {
                // Polling officer pattern detected
                endpoint = getApiUrl('pollingOfficerLogin');
                route = '/polling-officer-dashboard';
            } else {
                // Default to regular user login
                endpoint = getApiUrl('usersLogin');
                route = '/profile';
            }

            console.log('🔐 SignIn: Email entered:', formData.email);
            console.log('🔐 SignIn: Processed email:', processedEmail);
            console.log('🔐 SignIn: Password length:', formData.password?.length);
            console.log('🔐 SignIn: Mapping found:', mapping ? 'Yes (Admin)' : processedEmail.includes('officer') ? 'Yes (Officer Pattern)' : 'No (User)');
            console.log('🔐 SignIn: Attempting login to:', endpoint);
            console.log('🔐 SignIn: Will redirect to:', route);

            // Use the processed email for the request
            const loginData = {
                email: processedEmail,
                password: formData.password
            };

            console.log('📤 SignIn: Sending login data:', { email: loginData.email, password: '***hidden***' });

            const response = await axios.post(endpoint, loginData, {
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
             }

            // Log into the finance backend in the background to get a JWT token if patron/assistant patron
            if (
                processedEmail === 'patron@rpc-nyamira.co.ke' ||
                processedEmail === 'assistantpatron@rpc-nyamira.co.ke' ||
                processedEmail === 'patron@ksucu-mc.co.ke' ||
                processedEmail === 'assistantpatron@ksucu-mc.co.ke'
            ) {
                try {
                    // Use the finance backend's dedicated read-only patron account
                    const financeRes = await axios.post('/api/finance/auth/login', {
                        email: 'patron@rpc.ac.ke',
                        password: 'Patron@2026'
                    }, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (financeRes.data && financeRes.data.token) {
                        localStorage.setItem('finance_token', financeRes.data.token);
                        console.log('✅ SignIn: Finance patron token saved.');
                    }
                } catch (err) {
                    console.error('❌ SignIn: Failed to authenticate with finance backend:', err);
                }
            }

            console.log('🔐 SignIn: Navigating to:', route);

            // Track admin/patron session for navbar display
            if (processedEmail === 'patron@rpc-nyamira.co.ke' || processedEmail === 'patron@ksucu-mc.co.ke') {
                localStorage.setItem('adminSession', 'true');
                localStorage.setItem('patronSession', 'true');
                localStorage.removeItem('assistantPatronSession');
            } else if (processedEmail === 'assistantpatron@rpc-nyamira.co.ke' || processedEmail === 'assistantpatron@ksucu-mc.co.ke') {
                localStorage.setItem('adminSession', 'true');
                localStorage.setItem('assistantPatronSession', 'true');
                localStorage.removeItem('patronSession');
            } else if (mapping || processedEmail.startsWith('treasurer@') || processedEmail === 'chairperson@rpc.ac.ke') {
                localStorage.setItem('adminSession', 'true');
                localStorage.removeItem('patronSession');
                localStorage.removeItem('assistantPatronSession');
            } else {
                localStorage.removeItem('adminSession');
                localStorage.removeItem('patronSession');
                localStorage.removeItem('assistantPatronSession');
            }

            // Check for profile photo if regular user login
            let finalRoute = route;
            if (route === '/profile' && response.data.user && !response.data.user.profilePhoto) {
                finalRoute = '/welcome';
            }



            navigate(finalRoute);

            return; // Exit early to prevent any other state updates


        } catch (error: any) {
            console.error('SignIn: Login error:', error);
            console.error('SignIn: Error response:', error.response);
            console.error('SignIn: Error code:', error.code);
            console.error('SignIn: Device info:', {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                onLine: navigator.onLine
            });

            // Reset help options
            setShowWhatsAppHelp(false);

            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                setError('Incorrect email or password, please enter correct details.');
            } else if (error.response) {
                setError(error.response.data?.message || 'Login failed. Please try again.');
            } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                setError('Connection timeout. Please check your internet connection and try again.');
            } else if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                // Handle other device-specific errors - ensure we only pass strings
                const errorMessage = typeof error === 'object' && error.message
                    ? error.message
                    : typeof error === 'string'
                        ? error
                        : 'Unknown connection error';
                setError(`Connection error. Please try again or contact support. (${errorMessage})`);
            }
        } finally {
            setgeneralLoading(false);
        }
    };


    // Show user profile if authenticated
    if (userData) {
        return <UserProfile userData={userData} isLoading={generalLoading} />;
    }

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <img src={loadingAnime} alt="Loading..." className={styles['loading-gif']} />
                    <p>Checking authentication...</p>
                    {/* Fallback text for devices that might not load images */}
                    <noscript>
                        <p>Loading... Please ensure JavaScript is enabled.</p>
                    </noscript>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className={styles.body}>
                {generalLoading && (
                    <div className={styles['loading-screen']}>
                        <p className={styles['loading-text']}>Please wait...</p>
                        <img src={loadingAnime} alt="animation gif" />
                    </div>
                )}
                <div className={styles['container']}>
                    <Link to={"/"} style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                        <img src={cuLogo} alt="RPC logo" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                    </Link>

                    {error && <div className={styles.error}>{error}</div>}

                    {showWhatsAppHelp && (
                        <div style={{
                            background: '#f8f4f7',
                            border: '1px solid #E53935',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '15px'
                        }}>
                            <p style={{ margin: '0 0 15px 0', color: '#E53935', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                                Forgot your password?
                            </p>
                            <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '13px', textAlign: 'center' }}>
                                Please provide your details below and choose an admin to message on WhatsApp for a password reset.
                            </p>
                            {forgotError && (
                                <p style={{
                                    color: '#b91c1c', fontSize: '12px', textAlign: 'center',
                                    marginBottom: '10px', background: '#fef2f2',
                                    border: '1px solid #fecaca', borderRadius: '6px', padding: '7px 10px'
                                }}>
                                    ⚠️ {forgotError}
                                </p>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
                                {/* Full Name */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={forgotFullName}
                                        onChange={(e) => {
                                            setForgotFullName(e.target.value);
                                            if (forgotFieldErrors.fullName) setForgotFieldErrors(prev => ({ ...prev, fullName: undefined }));
                                        }}
                                        className={styles['input']}
                                        style={{
                                            padding: '10px 12px', borderRadius: '7px',
                                            border: forgotFieldErrors.fullName ? '1.5px solid #dc2626' : '1.5px solid #ddd',
                                            fontSize: '13px', outline: 'none', background: '#fafafa'
                                        }}
                                    />
                                    {forgotFieldErrors.fullName && (
                                        <span style={{ color: '#dc2626', fontSize: '11px', paddingLeft: '4px' }}>⚡ {forgotFieldErrors.fullName}</span>
                                    )}
                                </div>
                                {/* Email */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={forgotEmail}
                                        onChange={(e) => {
                                            setForgotEmail(e.target.value);
                                            if (forgotFieldErrors.email) setForgotFieldErrors(prev => ({ ...prev, email: undefined }));
                                        }}
                                        className={styles['input']}
                                        style={{
                                            padding: '10px 12px', borderRadius: '7px',
                                            border: forgotFieldErrors.email ? '1.5px solid #dc2626' : '1.5px solid #ddd',
                                            fontSize: '13px', outline: 'none', background: '#fafafa'
                                        }}
                                    />
                                    {forgotFieldErrors.email && (
                                        <span style={{ color: '#dc2626', fontSize: '11px', paddingLeft: '4px' }}>⚡ {forgotFieldErrors.email}</span>
                                    )}
                                </div>
                                {/* Phone */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (e.g., 0712345678) *"
                                        value={forgotPhone}
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/\D/g, '');
                                            setForgotPhone(digits);
                                            if (forgotFieldErrors.phone) setForgotFieldErrors(prev => ({ ...prev, phone: undefined }));
                                        }}
                                        inputMode="numeric"
                                        maxLength={10}
                                        className={styles['input']}
                                        style={{
                                            padding: '10px 12px', borderRadius: '7px',
                                            border: forgotFieldErrors.phone ? '1.5px solid #dc2626' : '1.5px solid #ddd',
                                            fontSize: '13px', outline: 'none', background: '#fafafa'
                                        }}
                                    />
                                    {forgotFieldErrors.phone && (
                                        <span style={{ color: '#dc2626', fontSize: '11px', paddingLeft: '4px' }}>⚡ {forgotFieldErrors.phone}</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleSendResetLink('0740881485'); }}
                                    style={{
                                        width: '100%',
                                        background: '#25D366',
                                        color: 'white',
                                        padding: '12px 10px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Reset via Gent Admin
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleSendResetLink('0705508997'); }}
                                    style={{
                                        width: '100%',
                                        background: '#25D366',
                                        color: 'white',
                                        padding: '12px 10px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Reset via Lady Admin
                                </button>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); setShowWhatsAppHelp(false); setForgotFullName(''); setForgotEmail(''); setForgotPhone(''); setForgotError(''); setForgotFieldErrors({}); }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#E53935',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ← Back to Log In
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Registration Panel */}
                    {showRegistration && (
                        <div>
                            {/* Header - just title, no icon */}
                            <h2 className={styles['text']} style={{ fontSize: '1.3em', margin: '4px 0 4px' }}>New Member Registration</h2>
                            <p style={{ margin: '0 0 10px', color: '#888', fontSize: '11.5px', textAlign: 'center' }}>
                                Fill in your details to request admin registration
                            </p>

                            {regError && (
                                <p style={{
                                    color: '#dc2626', fontSize: '12px', textAlign: 'center', marginBottom: '8px',
                                    background: '#fef2f2', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecaca',
                                }}>{regError}</p>
                            )}

                            {/* Compact Form Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                                <input type="text" name="fullName" placeholder="Full Name *" value={regData.fullName} onChange={handleRegChange} required
                                    style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />

                                {/* Phone & Email */}
                                <div className={styles['reg-row']}>
                                    <input type="tel" name="phone" placeholder="Phone (0712...) *" value={regData.phone} onChange={handleRegChange}
                                        inputMode="numeric" pattern="[0-9]*" maxLength={10} required
                                        style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />
                                    <input type="email" name="email" placeholder="Email address *" value={regData.email} onChange={handleRegChange} required
                                        style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />
                                </div>

                                
                                {/* ID & Gender */}
                                <div className={styles['reg-row']}>
                                    <input type="text" name="idNumber" placeholder="ID Number *" value={regData.idNumber} onChange={handleRegChange} required
                                        style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />
                                    <div style={{ position: 'relative' }}>
                                        <select name="gender" value={regData.gender} onChange={handleRegChange} required
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.gender ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: regData.gender ? '#333' : '#aaa', outline: 'none',
                                                appearance: 'none'
                                            }}>
                                            <option value="">Gender *</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                {/* Age Group */}
                                <div style={{ position: 'relative', marginBottom: '6px' }}>
                                    <select name="ageGroup" value={regData.ageGroup} onChange={handleRegChange} required
                                        style={{
                                            width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                            border: regData.ageGroup ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                            fontSize: '13px', color: regData.ageGroup ? '#333' : '#aaa', outline: 'none',
                                            appearance: 'none'
                                        }}>
                                        <option value="">Age Group *</option>
                                        <option value="Kid (12 and below)">Kid (12 and below)</option>
                                        <option value="Youth (13-35)">Youth (13-35)</option>
                                        <option value="Adult (36-59)">Adult (36-59)</option>
                                        <option value="Elderly (60 and above)">Elderly (60 and above)</option>
                                    </select>
                                    <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>

                                {/* Year Joined & Residence */}
                                <div className={styles['reg-row']}>
                                    {/* Year Joined Dropdown */}
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={regData.yearJoined}
                                            onChange={(e) => setRegData(prev => ({ ...prev, yearJoined: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.yearJoined ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: regData.yearJoined ? '#333' : '#aaa', outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="">Year Joined RPC *</option>
                                            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year.toString()}>{year}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>

                                    {/* Residence Input */}
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Residence *"
                                            value={regData.residence}
                                            onChange={(e) => setRegData(prev => ({ ...prev, residence: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.residence ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: '#333', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Compact Terms and Conditions */}
                            <div style={{
                                background: '#f8f6f7', border: '1px solid #eee', borderRadius: '8px',
                                padding: '10px 12px', marginBottom: '10px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                    <Shield size={14} color="#E53935" />
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a2e' }}>Terms & Conditions</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.5', maxHeight: '90px', overflowY: 'auto' }}>
                                    <p style={{ margin: '0 0 4px' }}><strong>1.</strong> RPC Nyamira maintains a verified membership database. All members are registered exclusively by authorized administrators to ensure data integrity.</p>
                                    <p style={{ margin: '0 0 4px' }}><strong>2.</strong> By submitting, your details will be sent to the selected admin via WhatsApp for verification.</p>
                                    <p style={{ margin: '0 0 4px' }}><strong>3.</strong> Upon verification, your login credentials (username & password) will be sent back to you immediately.</p>
                                    <p style={{ margin: 0 }}><strong>4.</strong> Please ensure all details are accurate to avoid delays.</p>
                                </div>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px',
                                    cursor: 'pointer', fontSize: '11.5px', color: '#333', fontWeight: 500,
                                }}>
                                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        style={{ accentColor: '#E53935', width: '14px', height: '14px', flexShrink: 0 }} />
                                    <span>I agree to the terms and conditions</span>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className={styles['reg-buttons']}>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleRegistrationSubmit('0740881485'); }}
                                    disabled={!acceptedTerms}
                                    style={{
                                        background: acceptedTerms ? '#25D366' : '#ccc', color: 'white', padding: '10px 6px',
                                        borderRadius: '20px', border: 'none', cursor: acceptedTerms ? 'pointer' : 'not-allowed',
                                        fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '5px', transition: 'all 0.3s ease', opacity: acceptedTerms ? 1 : 0.6,
                                    }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Gent Admin
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleRegistrationSubmit('0705508997'); }}
                                    disabled={!acceptedTerms}
                                    style={{
                                        background: acceptedTerms ? '#25D366' : '#ccc', color: 'white', padding: '10px 6px',
                                        borderRadius: '20px', border: 'none', cursor: acceptedTerms ? 'pointer' : 'not-allowed',
                                        fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '5px', transition: 'all 0.3s ease', opacity: acceptedTerms ? 1 : 0.6,
                                    }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Lady Admin
                                </button>
                            </div>

                            {/* Back Button */}
                            <div style={{ textAlign: 'center', marginTop: '6px' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); setShowRegistration(false); setRegError(''); setAcceptedTerms(false); }}
                                    style={{ background: 'transparent', border: 'none', color: '#E53935', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', fontWeight: 'bold' }}>
                                    ← Back to Log In
                                </button>
                            </div>
                        </div>
                    )}

                    {!showWhatsAppHelp && !showRegistration && (
                        <div>
                            <h2 className={styles['text']}>Log in</h2>

                            <form action="" className={styles['form']}>

                                <div className={styles['form-div']}>
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={styles['input']}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className={styles['form-div']}>
                                    <label htmlFor="password">Password</label>
                                    <section className={styles['password-wrapper']}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className={styles['input-pswd']}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                        />
                                        <button type="button" className={styles['eye-button']} onClick={togglePasswordVisibility}>
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </section>
                                </div>

                            </form>

                            <div className={styles['submisions']}>
                                <div className={styles['clearForm']} onClick={() => setFormData({ email: '', password: '' })}>Clear</div>
                                <div className={styles['submitData']} onClick={handleSubmit}>Log In</div>
                            </div>

                            <div className={styles['form-footer']}>
                                <p><button type="button" onClick={() => setShowWhatsAppHelp(true)} style={{ background: 'none', border: 'none', color: '#E53935', cursor: 'pointer', textDecoration: 'underline', fontSize: '1em', fontFamily: 'inherit' }}>Forgot password?</button></p>
                            </div>

                            {/* Register Link */}
                            <div style={{
                                textAlign: 'center',
                                paddingTop: '14px',
                                marginTop: '12px',
                                borderTop: '1px solid #eee',
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRegistration(true);
                                        setShowWhatsAppHelp(false);
                                    }}
                                    style={{
                                        background: 'none',
                                        color: '#E53935',
                                        border: 'none',
                                        borderRadius: 0,
                                        padding: 0,
                                        fontSize: '0.9em',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline',
                                        textDecoration: 'underline',
                                        transition: 'color 0.2s ease',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    Register Here
                                </button></p>
                            </div>

                            <div className={styles['form-footer']} style={{ marginTop: '12px' }}>
                                <p><Link to={"/Home"}>← Back to Home</Link></p>
                            </div>
                        </div>
                    )}

                    {isDevMode() && (
                        <div style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            background: '#ff9800',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 1000
                        }}>
                            DEV MODE
                        </div>
                    )}

                </div>

            </div>
        </ErrorBoundary>
    );
};

export default SignIn;
