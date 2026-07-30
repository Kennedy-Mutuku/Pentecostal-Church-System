import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/feedback.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShieldCheck, User } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
    feedback: 'General Feedback',
    suggestion: 'Suggestion',
    complaint: 'Complaint',
    praise: 'Praise & Appreciation',
    prayer: 'Prayer Request',
    technical: 'Technical Issue',
    other: 'Other'
};

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState({
        message: '',
        category: 'feedback',
        isAnonymous: false
    });

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const apiUrl = getApiUrl('users');
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const firstName = data.username?.split(' ')[0] || data.username;
                setUserData({
                    ...data,
                    username: firstName
                });
            } else {
                console.log('fetchUserData: not logged in or session expired', response.status);
            }
        } catch (error) {
            console.error('fetchUserData: error fetching user data', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleCheckboxChange = () => {
        setFormData({ ...formData, isAnonymous: !formData.isAnonymous });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!formData.message) {
            toast.warning('Please fill in all required fields.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Check if user wants identified message but is not logged in
        if (!formData.isAnonymous && !userData) {
            navigate('/signIn');
            return;
        }

        setLoading(true);
        try {
            const messageData = {
                subject: CATEGORY_LABELS[formData.category] || 'General Feedback',
                message: formData.message.trim(),
                category: formData.category,
                isAnonymous: formData.isAnonymous,
                senderInfo: !formData.isAnonymous && userData ? {
                    username: userData.username,
                    email: userData.email,
                    ministry: userData.ministry,
                    yos: userData.yos
                } : null,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(getApiUrl('messages'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                setIsSubmitted(true);

                setFormData({
                    message: '',
                    category: 'feedback',
                    isAnonymous: false
                });

                setTimeout(() => {
                    navigate('/');
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Failed to submit feedback. Please try again later.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className={styles.pageHeader}>
                <h1 className={styles.mainTitle}>Feedback</h1>
                <p className={styles.subtitle}>We'd love to hear from you! Share your thoughts, suggestions, or prayer requests with us.</p>
            </div>

            <div className={styles.container}>
                {isSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '40px', marginBottom: '24px' }}>
                            ✓
                        </div>
                        <h2 style={{ color: '#111827', marginBottom: '16px', fontSize: '26px', fontWeight: 'bold' }}>Message Sent Successfully!</h2>
                        <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                            Thank you for reaching out to Rikuruma Pentecostal Church. Your voice matters, and we have safely received your submission!
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#16a34a', animation: 'pulse 1.5s infinite' }}></span>
                            <p style={{ color: '#16a34a', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Redirecting to homepage...</p>
                        </div>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.privacyToggle}>
                            <div className={styles.privacyToggleInfo}>
                                <span className={styles.privacyIcon}>
                                    {formData.isAnonymous ? <ShieldCheck size={20} /> : <User size={20} />}
                                </span>
                                <div>
                                    <p className={styles.privacyLabel}>
                                        {formData.isAnonymous ? 'Anonymous' : 'Identified'}
                                    </p>
                                    <p className={styles.privacyDescription}>
                                        {formData.isAnonymous
                                            ? 'Your identity will remain confidential'
                                            : 'Shared for follow-up purposes'}
                                    </p>
                                </div>
                            </div>
                            <label className={styles.switch} htmlFor="isAnonymous">
                                <input
                                    type="checkbox"
                                    id="isAnonymous"
                                    checked={formData.isAnonymous}
                                    onChange={handleCheckboxChange}
                                />
                                <span className={styles.slider} />
                            </label>
                        </div>

                        <div>
                            <label htmlFor="category">Category</label>
                            <select id="category" value={formData.category} onChange={handleChange} className={styles.inputs} required>
                                <option value="feedback">General Feedback</option>
                                <option value="suggestion">Suggestion</option>
                                <option value="complaint">Complaint</option>
                                <option value="praise">Praise & Appreciation</option>
                                <option value="prayer">Prayer Request</option>
                                <option value="technical">Technical Issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                className={styles.inputs} 
                                placeholder="Share your thoughts, feedback, suggestions, or prayer requests..."
                                required 
                                rows={6}
                            />
                        </div>

                        <section className={styles.submission}>
                            <button
                                className={styles.submitButton}
                                type={!formData.isAnonymous && !userData ? 'button' : 'submit'}
                                onClick={!formData.isAnonymous && !userData ? () => navigate('/signIn') : undefined}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : (!formData.isAnonymous && !userData ? 'Login to Submit' : 'Submit')}
                            </button>
                        </section>
                    </form>
                )}
            </div>
        </>
    );
};

export default FeedbackForm;
