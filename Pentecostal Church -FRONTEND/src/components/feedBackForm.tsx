import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    Phone, Mail, MapPin, Facebook, Instagram, 
    Twitter, Youtube, Send, MessageSquare 
} from 'lucide-react';

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
        name: '',
        email: '',
        message: '',
        category: 'feedback',
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
                setFormData(prev => ({
                    ...prev,
                    name: prev.name || firstName,
                    email: prev.email || data.email || ''
                }));
            }
        } catch (error) {
            console.error('fetchUserData: error fetching user data', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.warning('Please fill in all required fields.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const messageData = {
                subject: CATEGORY_LABELS[formData.category] || 'General Feedback',
                message: formData.message.trim(),
                category: formData.category,
                isAnonymous: false,
                senderInfo: {
                    username: formData.name.trim(),
                    email: formData.email.trim(),
                    ministry: userData ? userData.ministry : null,
                    yos: userData ? userData.yos : null
                },
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
                setFormData({ name: '', email: '', message: '', category: 'feedback' });
                setTimeout(() => navigate('/'), 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Failed to submit your message. Please try again later.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-gradient-to-b from-[#eae0f5] to-[#f8f6f0] pt-8 md:pt-12 lg:pt-16 pb-8 lg:pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#e5d5f5]/50">
            <ToastContainer />
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6 lg:mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#341558] mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you! Share your thoughts, suggestions, or prayer requests, or reach out to us directly through our contact channels.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col-reverse lg:flex-row">
                    
                    {/* Contact Details Side */}
                    <div className="bg-[#341558] text-white p-6 md:p-12 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6 text-white">Get in Touch</h2>
                            <p className="text-[#d1b3ff] mb-10 text-sm md:text-base leading-relaxed">
                                Whether you have a question about our services, ministries, or anything else, our team is ready to answer all your questions.
                            </p>

                            <div className="space-y-6 lg:space-y-8">
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="bg-white/10 p-3.5 rounded-2xl shrink-0 group-hover:bg-[#a57ce6] transition-colors duration-300">
                                        <MapPin className="text-[#d1b3ff] group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="font-semibold text-lg text-white">Address</h4>
                                        <p className="text-[#d1b3ff] text-sm mt-1 leading-relaxed">P.O BOX 408-40200<br/>Kisii, Kenya</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="bg-white/10 p-3.5 rounded-2xl shrink-0 group-hover:bg-[#a57ce6] transition-colors duration-300">
                                        <Phone className="text-[#d1b3ff] group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="font-semibold text-lg text-white">Phone</h4>
                                        <p className="text-[#d1b3ff] text-sm mt-1 leading-relaxed">+254 762 053 876</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer">
                                    <div className="bg-white/10 p-3.5 rounded-2xl shrink-0 group-hover:bg-[#a57ce6] transition-colors duration-300">
                                        <Mail className="text-[#d1b3ff] group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="font-semibold text-lg text-white">Email</h4>
                                        <p className="text-[#d1b3ff] text-sm mt-1 leading-relaxed break-all">communityofbelieversinjesus@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 lg:mt-14 relative z-10">
                            <h4 className="font-semibold text-lg mb-5 text-white">Connect With Us</h4>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/share/18rhcZ1XpA/" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3.5 rounded-full hover:bg-[#a57ce6] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-white">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://www.instagram.com/rpc_nyamira" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3.5 rounded-full hover:bg-[#a57ce6] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-white">
                                    <Instagram size={20} />
                                </a>
                                <a href="https://x.com/rpcnyamira" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3.5 rounded-full hover:bg-[#a57ce6] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-white">
                                    <Twitter size={20} />
                                </a>
                                <a href="https://www.youtube.com/@savedbychriststainedbylove" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3.5 rounded-full hover:bg-[#a57ce6] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-white">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>
                        
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-72 h-72 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-[#a57ce6] opacity-[0.15] rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    {/* Form Side */}
                    <div className="p-6 md:p-12 lg:w-3/5 bg-white">
                        {isSubmitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-sm border border-green-100">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                                <p className="text-gray-600 text-lg max-w-md mx-auto mb-10">
                                    Thank you for reaching out to Rikuruma Pentecostal Church. Your voice matters, and we have safely received your submission!
                                </p>
                                <div className="flex items-center gap-3 text-green-600 font-semibold bg-green-50/50 px-6 py-3 rounded-full border border-green-100">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Redirecting to homepage...
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="h-full flex flex-col">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Send a Message</h3>

                                <div className="space-y-4 flex-grow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1.5">Your Name</label>
                                            <input 
                                                type="text"
                                                id="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 py-3 px-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#341558]/20 focus:border-[#341558] transition-all font-medium hover:bg-gray-50" 
                                                placeholder="Kennedy Mutuku"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                            <input 
                                                type="email"
                                                id="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 py-3 px-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#341558]/20 focus:border-[#341558] transition-all font-medium hover:bg-gray-50" 
                                                placeholder="ken@gmail.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                                        <div className="relative">
                                            <select 
                                                id="category" 
                                                value={formData.category} 
                                                onChange={handleChange} 
                                                className="w-full appearance-none bg-gray-50/50 border border-gray-200 text-gray-800 py-3 px-5 pr-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#341558]/20 focus:border-[#341558] transition-all cursor-pointer font-medium hover:bg-gray-50" 
                                                required
                                            >
                                                <option value="feedback">General Feedback</option>
                                                <option value="suggestion">Suggestion</option>
                                                <option value="complaint">Complaint</option>
                                                <option value="praise">Praise & Appreciation</option>
                                                <option value="prayer">Prayer Request</option>
                                                <option value="technical">Technical Issue</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1.5">Your Message</label>
                                        <textarea 
                                            id="message" 
                                            value={formData.message} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 py-3 px-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#341558]/20 focus:border-[#341558] transition-all resize-y min-h-[100px] lg:min-h-[120px] font-medium placeholder:text-gray-400 hover:bg-gray-50" 
                                            placeholder="Type your message here..."
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-5">
                                    <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed text-center sm:text-left font-medium">
                                        Your information is secure and will only be used to respond to your inquiry.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#341558] hover:bg-[#482078] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(52,21,88,0.25)] active:scale-95 active:shadow-sm disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
