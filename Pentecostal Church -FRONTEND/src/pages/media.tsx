import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Media.module.css';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FaYoutube, FaFacebook, FaTiktok, FaTwitter, FaImage, FaNewspaper, FaBook, FaSearch, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { getApiUrl, getImageUrl, getBaseUrl, isDevMode } from '../config/environment';
import heroImg from '../assets/praise-and-worship.jpg';

interface MediaItem {
  _id?: string;
  id?: string;
  event: string;
  date: string;
  link: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Media: React.FC = () => {
  const [showMediaEvents, setShowMediaEvents] = useState(false);
  const [error, setError] = useState('');
  const [generalLoading, setGeneralLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Default events as fallback
  const defaultEvents: MediaItem[] = [
    { event: "Subcomm photos", date: "2025-01-20", link: "https://photos.app.goo.gl/PrxWoMuyRNEet22b7" },
    { event: "Sunday service", date: "2025-02-13", link: "https://photos.app.goo.gl/Vt6HDo1xEtgA3Nmn9" },
    { event: "Worship Weekend", date: "2025-02-10", link: "https://photos.app.goo.gl/wbNV3coJREGEUSZX7" },
    { event: "Bible Study weekend", date: "2025-01-26", link: "https://photos.app.goo.gl/otVcso25sG6fkxjR8" },
    { event: "Evangelism photos", date: "2025-02-02", link: "https://photos.app.goo.gl/JvqV19BaGGZwrVFS7" },
    { event: "Weekend Photos", date: "2025-02-09", link: "https://photos.app.goo.gl/HkBvW67gyDSvLqgS7" },
    { event: "RPC Nyamira MEGA HIKE", date: "2025-02-15", link: "https://photos.app.goo.gl/RaNP4ikjEjXLHBmbA" },
    { event: "Creative Night photos", date: "2025-02-11", link: "https://photos.app.goo.gl/qYjukQAuWAdzBpaA7" },
    { event: "Valentine's concert ", date: "2025-02-17", link: "https://photos.app.goo.gl/BvYon9KCNPL1uMu87" },
    { event: "Weekend Photos", date: "2025-02-17", link: "https://photos.app.goo.gl/gMuMfKPvCx3rTRRn8" },
    { event: "Worship Weekend", date: "14th - 16th march", link: "https://photos.app.goo.gl/t2uVjvUSepDBcx3LA" },
    { event: "Prayer Week", date: "7th - 9th March", link: "https://photos.app.goo.gl/24sm1zdBxdUege3Y6" },
    { event: "Elders Day", date: "22nd March", link: "https://photos.app.goo.gl/L9Hkr8BxnVP1MSsD6" },
    { event: "Hymn Sunday", date: "23nd March", link: "https://photos.app.goo.gl/RWWRM2zp9LkmVgtU6" },
    { event: "Sunday service", date: "24nd March", link: "https://photos.app.goo.gl/UnA7f6Aqp3kHtsxaA" },
    { event: "Missions Trip", date: "2025-03-30", link: "https://photos.app.goo.gl/example123" },
  ];

  useEffect(() => {
    // Environment debugging  
    console.log('🔧 Media Environment Debug:');
    console.log('  - isDev:', isDevMode());
    console.log('  - baseUrl:', getBaseUrl());
    console.log('  - hostname:', window.location.hostname);
    console.log('  - sample imageUrl:', getImageUrl('/uploads/media/test.png'));
    
    fetchUserData();
    loadMediaItems();
    
    // Refresh media items when the page gains focus (when user returns from admin)
    const handleFocus = () => {
      loadMediaItems();
    };
    
    // Listen for localStorage changes (when admin updates items in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rpc-media-items' && e.newValue) {
        try {
          const updatedItems = JSON.parse(e.newValue);
          console.log('📱 Media: Storage changed, updating with', updatedItems.length, 'items');
          setEvents(updatedItems);
        } catch (error) {
          console.error('📱 Media: Error parsing storage data:', error);
        }
      }
    };
    
    // Listen for custom media items update event (same-tab synchronization)
    const handleMediaItemsUpdated = (e: CustomEvent) => {
      const updatedItems = e.detail;
      console.log('📱 Media: Media items updated event received with', updatedItems?.length, 'items');
      if (Array.isArray(updatedItems)) {
        setEvents(updatedItems);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mediaItemsUpdated', handleMediaItemsUpdated as EventListener);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mediaItemsUpdated', handleMediaItemsUpdated as EventListener);
    };
  }, []);

  const loadMediaItems = async () => {
    try {
      // Add timestamp to completely bypass all caching
      const timestamp = new Date().getTime();
      const apiUrl = `${getApiUrl('api/media-items')}?t=${timestamp}`;
      console.log('📱 Media: Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('📱 Media: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        const apiItems = data.data || [];
        console.log('📱 Media: Received', apiItems.length, 'items from API');
        
        // Merge API items with default events (API items take priority)
        const mergedItems = [...apiItems];
        
        // Keep any offline-added items that haven't been synced to the backend yet
        const savedItemsJson = localStorage.getItem('rpc-media-items');
        if (savedItemsJson) {
            try {
                const savedItems = JSON.parse(savedItemsJson);
                savedItems.forEach((savedItem: MediaItem) => {
                    const isLocalOnly = (savedItem._id?.startsWith('local-') || savedItem.id?.startsWith('local-'));
                    if (isLocalOnly) {
                        mergedItems.push(savedItem);
                    }
                });
            } catch (e) {
                console.error('Failed to parse saved items for local sync');
            }
        }
        
        // Add default events that aren't already in the database
        defaultEvents.forEach(defaultItem => {
          const exists = mergedItems.some((item: MediaItem) => 
            item.event === defaultItem.event && 
            item.link === defaultItem.link
          );
          if (!exists) {
            mergedItems.push(defaultItem);
          }
        });
        
        console.log('📱 Media: Total items after merge:', mergedItems.length);
        setEvents(mergedItems);
        localStorage.setItem('rpc-media-items', JSON.stringify(mergedItems));
      } else {
        console.log('📱 Media: API failed, using cached or default items');
        // Try localStorage first
        const savedItems = localStorage.getItem('rpc-media-items');
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          console.log('📱 Media: Using cached items:', parsedItems.length);
          setEvents(parsedItems);
        } else {
          console.log('📱 Media: Using default events:', defaultEvents.length);
          setEvents(defaultEvents);
          localStorage.setItem('rpc-media-items', JSON.stringify(defaultEvents));
        }
      }
    } catch (error) {
      console.error('📱 Media: Error loading from API:', error);
      // Try localStorage first
      const savedItems = localStorage.getItem('rpc-media-items');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        console.log('📱 Media: Using cached items:', parsedItems.length);
        setEvents(parsedItems);
      } else {
        console.log('📱 Media: Using default events:', defaultEvents.length);
        setEvents(defaultEvents);
        localStorage.setItem('rpc-media-items', JSON.stringify(defaultEvents));
      }
    }
  };
  

  const fetchUserData = async () => {
    // Offline check disabled - always try to fetch
    // if (!navigator.onLine) {
    //   setError('Check your internet and try again...');
    //   return;
    // }

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    
    try {
      setGeneralLoading(true);
      document.body.style.overflow = 'hidden';            

      const apiUrl = getApiUrl('users');
      console.log('📱 Media: Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });

      if (!response.ok) {
        // Check if patron is logged in
        if (localStorage.getItem('patronSession') === 'true' || localStorage.getItem('assistantPatronSession') === 'true') {
          setIsAuthenticated(true);
          return;
        }
        // If not authenticated, ensure it's false
        setIsAuthenticated(false);
        setError('You need to login or sign up to access this page');
        return;
      }

      setIsAuthenticated(true);
      setShowMediaEvents(true);

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Check if patron is logged in
      if (localStorage.getItem('patronSession') === 'true' || localStorage.getItem('assistantPatronSession') === 'true') {
        setIsAuthenticated(true);
        setShowMediaEvents(true);
        return;
      }
      setIsAuthenticated(false);
      setError('You need to login or sign up to access this page');
    } finally {    
      document.body.style.overflow = '';  
      setGeneralLoading(false);      
    }
  };
  // Helper to parse messy date strings
  const parseManualDate = (dateStr: string) => {
    if (!dateStr) return 0;
    
    // Check for standard YYYY-MM-DD
    const standardDate = new Date(dateStr);
    if (!isNaN(standardDate.getTime())) return standardDate.getTime();
    
    const lower = dateStr.toLowerCase();
    const months: { [key: string]: number } = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, 
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    
    let year = 2025; // Default for these items
    let month = -1;
    let day = 1;
    
    // Extract month
    for (const [mName, mIndex] of Object.entries(months)) {
      if (lower.includes(mName)) {
        month = mIndex;
        break;
      }
    }
    
    // Extract first number found as day
    const dayMatch = dateStr.match(/\d+/);
    if (dayMatch) day = parseInt(dayMatch[0]);
    
    if (month !== -1) {
      return new Date(year, month, day).getTime();
    }
    
    return 0;
  };

  // Sort and filter events
  const sortedEvents = [...events]
    .filter(item => 
      item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Create unified timestamps for both items
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseManualDate(a.date);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseManualDate(b.date);
      
      if (timeA !== timeB) return timeB - timeA;
      
      // Fallback prioritize items with newer IDs (recently added locally) if timestamps match exactly
      const aId = parseInt(a.id || a._id || '0');
      const bId = parseInt(b.id || b._id || '0');
      
      if (!isNaN(aId) && !isNaN(bId)) return bId - aId;
      
      return 0;
    });
  
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectCountdown === null) return;
    
    if (redirectCountdown === 0) {
      navigate('/signIn');
      return;
    }
    
    const timer = setTimeout(() => {
      setRedirectCountdown(redirectCountdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  // Helper to handle view photos click
  const handleViewClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      setRedirectCountdown(4);
    }
  };

  return (
    <>
      <ToastContainer />
      
      {redirectCountdown !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: '#fff', padding: '0', borderRadius: '16px', textAlign: 'center', maxWidth: '420px', width: '90%', boxShadow: '0 20px 40px rgba(115, 0, 81, 0.15)', overflow: 'hidden', border: '1px solid rgba(115, 0, 81, 0.1)' }}>
            <div style={{ backgroundColor: '#730051', padding: '24px 20px', color: 'white' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '0.5px' }}>Log In Required</h3>
            </div>
            <div style={{ padding: '30px 24px' }}>
              <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '16px', lineHeight: 1.6 }}>
                Note well that for data security, only logged-in members are allowed to access this.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '25px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
                <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#E53935' }}></span>
                <p style={{ color: '#E53935', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                  Taking you to sign in in <span style={{ fontSize: '18px', fontWeight: 800, paddingLeft: '2px', paddingRight: '2px' }}>{redirectCountdown}</span> seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {generalLoading && (
        <div className={styles['loading-screen']}>
          <p className={styles['loading-text']}>Please wait...🤗</p>
          <img src={loadingAnime} alt="animation gif" />
        </div>
      )}

      <main className={styles.main}>

        {/* Slim social strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', padding: '8px 16px',
          background: '#fff', borderBottom: '1px solid #eee',
          fontSize: '11px', color: '#888',
        }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.5px', color: '#aaa', fontSize: '10px', textTransform: 'uppercase' }}>Follow us</span>
          <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
          <a href="https://www.youtube.com/@savedbychriststainedbylove" target="_blank" rel="noopener noreferrer" title="YouTube"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FF0000', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
            <FaYoutube size={16} /> <span>YouTube</span>
          </a>
          <span style={{ color: '#ddd' }}>·</span>
          <a href="https://www.facebook.com/share/18rhcZ1XpA/" target="_blank" rel="noopener noreferrer" title="Facebook"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1877F2', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
            <FaFacebook size={16} /> <span>Facebook</span>
          </a>
          <span style={{ color: '#ddd' }}>·</span>
          <a href="https://www.tiktok.com/@rikurumapentecostal" target="_blank" rel="noopener noreferrer" title="TikTok"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#010101', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
            <FaTiktok size={15} /> <span>TikTok</span>
          </a>
          <span style={{ color: '#ddd' }}>·</span>
          <a href="https://x.com/@Rpc_mc" target="_blank" rel="noopener noreferrer" title="Twitter/X"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1DA1F2', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
            <FaTwitter size={15} /> <span>Twitter</span>
          </a>
        </div>


        {/* Photo Gallery — inline section after social handles */}
        <section className={styles.contentSection} style={{ paddingTop: '40px', paddingBottom: '60px' }}>
          <div className={styles.container}>
            {/* Centred gallery header */}
            <div style={{
              textAlign: 'center',
              padding: '20px 0 18px',
              borderBottom: '1.5px solid #e5e5e5',
              marginBottom: '24px',
            }}>
              <h2 style={{
                margin: '6px 0 4px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#1a1a2e',
                letterSpacing: '-0.3px',
                lineHeight: 1.3,
              }}>
                Welcome to Rikuruma Pentecostal Church
                <br />
                <span style={{ color: '#730051', fontSize: '19px', fontWeight: 700 }}>Family Gallery</span>
              </h2>
              <p style={{ margin: '4px 0 16px', fontSize: '12px', color: '#aaa' }}>
                {sortedEvents.length} albums
              </p>

              {/* Centred search bar */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1.5px solid #ddd', borderRadius: '8px',
                padding: '8px 14px', background: '#fafafa',
                width: '100%', maxWidth: '380px',
              }}>
                <FaSearch style={{ color: '#aaa', fontSize: '12px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    background: 'none', fontSize: '13px', color: '#333',
                  }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Gallery grid */}
            <div className={styles.galleryGrid}>
              {sortedEvents.map((event, index) => (
                <div key={event._id || event.id || index} className={styles.galleryItem}>
                  <div className={styles.galleryImagePlaceholder}>
                    {event.imageUrl ? (
                      <img
                        src={getImageUrl(event.imageUrl)}
                        alt={event.event}
                        onError={(e) => {
                          e.currentTarget.src = heroImg;
                        }}
                      />
                    ) : (
                      <img src={heroImg} alt="Default Church Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className={styles.galleryItemContent}>
                    <h4>{event.event}</h4>
                    <p className={styles.galleryDate}>{event.date}</p>
                    <a href={event.link} onClick={(e) => handleViewClick(e, event.link)} className={styles.galleryViewBtn}>
                      View Photos
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

    </>
  );
};

export default Media;
