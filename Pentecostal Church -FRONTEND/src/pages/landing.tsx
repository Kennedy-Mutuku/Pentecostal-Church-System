import React, { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import axios from 'axios';
import styles from '../styles/index.module.css';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faSearch, faUserCheck, faSignature, faCheckCircle, faExclamationTriangle, faXmark, faClock, faCoffee, faTrophy, faCode, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Heart, Camera, BookOpen, Library, DollarSign, GraduationCap, Package, MessageCircleHeart } from "lucide-react";
import LandingPageHeader from '../components/LandingPageHeader';
import ModernNewsDisplay from '../components/ModernNewsDisplay';



const LandingPage = () => {

  const [openPrayerJoint, setOpenPrayerJoint] = useState(false);
  const [openBibleStudy, setOpenBibleStudy] = useState(false);
  const [openDevelopment, setOpenDevelopment] = useState(false);
  const [openGraphicDesign, setOpenGraphicDesign] = useState(false);
  const [openKairosCourse, setOpenCairosCourse] = useState(false);
  const [openFocus, setOpenFocus] = useState(false);
  const [userData, setUserData] = useState<{ username: string; email: string; idNumber: string; gender: string; ageGroup: string; phone: string; residence: string; yearJoined: string } | null>(null);
  const [error, setError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceSuccess, setAttendanceSuccess] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showMinistries, setShowMinistries] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [showEvangelisticTeams, setShowEvangelisticTeams] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    leadershipRole: string;
    isActive: boolean;
    startTime: string;
    sessionId: string;
  } | null>(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showDuplicateOverlay, setShowDuplicateOverlay] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    fullName: '',
    idNumber: '',
    gender: '',
    ageGroup: '',
    phoneNumber: '',
    signature: '',
    userType: 'student'
  });

  // Quick Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // Track if initial search is done
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  // Handle body overflow when any modal opens
  useEffect(() => {
    const isAnyModalOpen = openPrayerJoint || openBibleStudy || openDevelopment || openGraphicDesign || openKairosCourse || openFocus;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openPrayerJoint, openBibleStudy, openDevelopment, openGraphicDesign, openKairosCourse, openFocus]);

  // Check for active attendance session
  const checkActiveSession = async (retryCount = 0) => {
    try {
      console.log('🔄 Checking active session from backend...');
      const timestamp = Date.now();
      const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&r=${Math.random()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📡 Session status from backend:', data);
        
        let activeSessionData = data.session;

        // Fallback: If backend has no active session, check offline local storage
        if (!activeSessionData || !activeSessionData.isActive) {
            const localSessions = JSON.parse(localStorage.getItem('rpc-attendance-sessions') || '[]');
            const localActive = localSessions.find((s: any) => s.isActive);
            if (localActive) {
                activeSessionData = localActive;
                console.log('✅ Found active session in local storage (Offline Mode)', localActive);
            }
        }

        if (activeSessionData && activeSessionData.isActive) {
          setActiveSession({
            leadershipRole: activeSessionData.leadershipRole || 'Leader',
            isActive: true,
            startTime: activeSessionData.startTime,
            sessionId: activeSessionData._id || activeSessionData.sessionId
          });
        } else {
          setActiveSession(null);
        }
      } else {
        throw new Error('Backend failed');
      }
    } catch (error) {
      console.log('🚫 Backend required for cross-device sessions, falling back to local');
      
      const localSessions = JSON.parse(localStorage.getItem('rpc-attendance-sessions') || '[]');
      const localActive = localSessions.find((s: any) => s.isActive);
      if (localActive) {
          setActiveSession({
              leadershipRole: localActive.leadershipRole || 'Leader',
              isActive: true,
              startTime: localActive.startTime,
              sessionId: localActive._id || localActive.sessionId
          });
      } else {
          setActiveSession(null);
      }
    }
  };

  useEffect(() => {
    fetchUserData()
    checkActiveSession()

    // Set up interval to check for session updates every 5 seconds
    const sessionCheckInterval = setInterval(checkActiveSession, 5000);

    // Refetch user data when window gains focus (user returns from login)
    const handleFocus = () => {
      fetchUserData();
      checkActiveSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(sessionCheckInterval);
    };

  }, []);

  // Close form if session becomes inactive
  useEffect(() => {
    if (showAttendanceForm && (!activeSession || !activeSession.isActive)) {
      setShowAttendanceForm(false);
      alert('Attendance session has been closed. The form has been closed.');
    }
  }, [activeSession, showAttendanceForm]);

  const fetchUserData = async () => {
    console.log('🏠 Landing: Fetching user data...');

    // Offline check disabled - always try to fetch
    // if (!navigator.onLine) {
    //     console.log('❌ Landing: User offline');
    //     setError('check your internet and try again...')
    //     return;
    // }

    window.scrollTo({
      top: 0,
      behavior: 'auto' // 'auto' for instant scroll
    });

    try {

      setgeneralLoading(true)

      document.body.style.overflow = 'hidden';

      const apiUrl = getApiUrl('users');
      console.log('🏠 Landing: Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        credentials: 'include'
      });

      console.log('🏠 Landing: Response status:', response.status);
      const data = await response.json();
      console.log('🏠 Landing: Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      if (!data.phone || !data.idNumber || !data.ageGroup) {
        setError('...navigating to update details')
        // Redirect to the update details page
        navigate('/changeDetails');

        return;
      }

      // Set username to only the first name (first word) if there are multiple names
      const firstName = data.username.split(' ')[0];

      const finalUserData = {
        ...data,
        username: firstName
      };
      console.log('✅ Landing: Setting user data:', finalUserData);
      setUserData(finalUserData);

    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
        // Silently handle expired session
        navigate('/');
      } else {
        console.error('❌ Landing: Error fetching user data:', error);
      }

    } finally {
      document.body.style.overflow = '';
      setgeneralLoading(false);
    }
  };


  // Handle attendance form submission
  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setAttendanceError('');
    setAttendanceSuccess('');

    if (!activeSession) {
      setAttendanceError('No active attendance session found');
      return;
    }

    // Validate based on user type
    if (!attendanceData.fullName || !attendanceData.phoneNumber || !attendanceData.signature) {
      setAttendanceError('Please fill in name, phone number, and signature');
      return;
    }

    // Student-specific validation
    if (attendanceData.userType === 'student') {
      if (!attendanceData.idNumber || !attendanceData.gender || !attendanceData.ageGroup) {
        setAttendanceError('Members must fill in ID No, gender, and age group');
        return;
      }
    }

    setgeneralLoading(true);
    try {
      // First get the latest active session to ensure we have the correct session ID
      console.log('🔄 Getting latest active session before submitting attendance...');
      const sessionResponse = await axios.get(
        getApiUrl('attendanceSessionStatus'),
        { withCredentials: true }
      );

      let latestSession = sessionResponse.data.session;
      
      // Fallback: If backend has no active session, check offline local storage
      if (!latestSession || !latestSession.isActive) {
          const localSessions = JSON.parse(localStorage.getItem('rpc-attendance-sessions') || '[]');
          const localActive = localSessions.find((s: any) => s.isActive);
          if (localActive) {
              latestSession = localActive;
          }
      }

      if (!latestSession || !latestSession.isActive) {
        alert('No active attendance session found. Please wait for admin to open a session.');
        setgeneralLoading(false);
        return;
      }

      console.log('✅ Using session ID:', latestSession._id);

      // Validate session ID exists
      if (!latestSession._id && !latestSession.sessionId) {
        alert('Invalid session ID. Please try again.');
        setgeneralLoading(false);
        return;
      }

      const sessionIdToUse = latestSession._id || latestSession.sessionId;

      // Generate unique visitor ID if user is a visitor
      const generateVisitorId = () => {
        const timestamp = Date.now().toString(36); // Convert timestamp to base36
        const random = Math.random().toString(36).substr(2, 5); // 5 random chars
        return `VISITOR-${timestamp}-${random}`.toUpperCase();
      };

      // Prepare member ID number (trim and uppercase)
      const processedIdNo = attendanceData.userType === 'student'
        ? attendanceData.idNumber.trim().toUpperCase()
        : generateVisitorId();

      // Prepare attendance data for backend API
      const attendanceData_backend = {
        name: attendanceData.fullName.trim(),
        idNumber: processedIdNo,
        year: attendanceData.userType === 'student' ? parseInt(attendanceData.ageGroup) : 0,
        gender: attendanceData.userType === 'student' ? attendanceData.gender.trim() : 'N/A',
        phoneNumber: attendanceData.phoneNumber.trim(),
        signature: attendanceData.signature.trim(),
        userType: attendanceData.userType,
        yearJoined: 'General', 
        sessionId: sessionIdToUse
      };

      // Submit to backend API
      const response = await axios.post(
        getApiUrl('attendanceSignAnonymous'),
        attendanceData_backend,
        { withCredentials: true }
      );

      console.log('✅ Attendance submitted successfully:', response.data);

      const now = new Date();
      const timeString = now.toLocaleString();
      setAttendanceSuccess(`Attendance submitted successfully for ${attendanceData.fullName}! Submitted at: ${timeString}. You can now register another person with a different ID number.`);
      
      setTimeout(() => setAttendanceSuccess(''), 5000);

      // Reset form
      setAttendanceData({
        fullName: '',
        idNumber: '',
        gender: '',
        ageGroup: '',
        phoneNumber: '',
        signature: '',
        userType: 'student'
      });

      // Clear canvas signature
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

    } catch (error: any) {
      console.error('❌ Error submitting attendance to backend, trying local fallback...', error);
      
      // OFFLINE FALLBACK
      try {
          const sessionId = activeSession.sessionId || activeSession._id;
          const recordsStr = localStorage.getItem('rpc-attendance-records') || '{}';
          const records = JSON.parse(recordsStr);
          
          if (!records[sessionId]) records[sessionId] = [];
          
          const processedIdNo = attendanceData.userType === 'student'
            ? attendanceData.idNumber.trim().toUpperCase()
            : `VISITOR-${Date.now().toString(36).toUpperCase()}`;

          // Check for duplicate in local
          const isDuplicate = records[sessionId].some((r: any) => r.regNo === processedIdNo || r.idNumber === processedIdNo);
          if (isDuplicate) {
              setAttendanceError('ID Number Already Used! This ID number has already been used for attendance in this session. (Local Mode)');
              setAttendanceData(prev => ({ ...prev, idNumber: '' }));
              setTimeout(() => setAttendanceError(''), 8000);
              setgeneralLoading(false);
              return;
          }

          records[sessionId].push({
              _id: `local-record-${Date.now()}`,
              userName: attendanceData.fullName.trim(),
              regNo: processedIdNo,
              idNumber: processedIdNo,
              userType: attendanceData.userType,
              signedAt: new Date().toISOString(),
              signature: attendanceData.signature.trim(),
              phoneNumber: attendanceData.phoneNumber.trim(),
              year: attendanceData.userType === 'student' ? parseInt(attendanceData.ageGroup) : 0,
          });
          
          localStorage.setItem('rpc-attendance-records', JSON.stringify(records));
          
          const now = new Date();
          const timeString = now.toLocaleString();
          setAttendanceSuccess(`[Offline Mode] Attendance submitted successfully for ${attendanceData.fullName}! Submitted at: ${timeString}.`);
          setTimeout(() => setAttendanceSuccess(''), 5000);

          setAttendanceData({
            fullName: '',
            idNumber: '',
            gender: '',
            ageGroup: '',
            phoneNumber: '',
            signature: '',
            userType: 'student'
          });

          const canvas = document.querySelector('canvas') as HTMLCanvasElement;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
      } catch (fallbackError) {
          setAttendanceError('Failed to save attendance locally. Please try again.');
          setTimeout(() => setAttendanceError(''), 6000);
      }
    } finally {
      setgeneralLoading(false);
    }
  };




  function handleCloseCommission(): void {
    setShowCommissionDialog(false)
  }



  function handleOpenPrayerJoint(): void {
    setOpenPrayerJoint(true)
  }
  function handleClosePrayerJoint(): void {
    setOpenPrayerJoint(false)
  }

  function handleOpenBibleStudy(): void {
    setOpenBibleStudy(true)
  }
  function handleCloseBibleStudy(): void {
    setOpenBibleStudy(false)
  }

  function handleOpenDevelopment(): void {
    setOpenDevelopment(true)
  }
  function handleCloseDevelopment(): void {
    setOpenDevelopment(false)
  }

  function handleOpenGraphics(): void {
    setOpenGraphicDesign(true)
  }
  function handleCloseGraphics(): void {
    setOpenGraphicDesign(false)
  }

  function handleOpenFocus(): void {
    setOpenFocus(true)
  }
  function handleCloseFocus(): void {
    setOpenFocus(false)
  }

  function handleOpenCairos(): void {
    setOpenCairosCourse(true)
  }
  function handleCloseCairos(): void {
    setOpenCairosCourse(false)
  }

  // Method to handle the toggling behavior
  const handleToggle = (setShow: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
    setShow(!currentState);
  };


  const handleQuickLinkClick = (action?: () => void, event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (action) {
      action();
    }
  };


  function navigateMedia() {
    if (userData) {
      navigate('/media')
    } else {

      // navigate('/media')

      setError('Please log in to access Media');

      setTimeout(() => {
        setError('')
        navigate('/signIn');
      }, 2000);
    }
  }


  // The commission dialog content will be handled in the main return below
  const renderCommissionDialog = () => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalCard}>
          <div className={styles.modalHeader}>
            Weekly Friday Prayers & Sunday Services
          </div>
          <div className={styles.modalBody}>
            <p>
              For those in session, <b>welcome to our <span className={styles.boldBlue}>Friday prayers</span> every week</b>
              <span className={styles.venueNote}>(venue communicated weekly)</span> and <b className={styles.boldBlue}>Sunday services</b>.
            </p>
            <ul>
              <li><b>Friday Prayers:</b> 6:30 PM – 7:00 PM</li>
              <li><b>Sunday Services:</b> 8:00AM – 10:00 AM </li>
              <li><b>Venues:</b> Communicated in advance</li>
            </ul>
            <p className={styles.stayBlessed}>
              <i>Stay blessed, and see you there!</i>
            </p>
          </div>

          {/* MODERN NEWS SECTION */}
          <div className={styles.modernNewsSection}>
            <ModernNewsDisplay />
          </div>
          <button className={styles.closeBtn} onClick={handleCloseCommission}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    );
  };

  // Suppress TypeScript warnings - these states are available for future UI implementation
  if (error) { /* error state handled via setError calls */ }
  if (generalLoading) { /* loading state handled via setgeneralLoading calls */ }

  return (
    <React.Fragment>
      <LandingPageHeader />
      {showCommissionDialog && renderCommissionDialog()}

      <div className={styles.landingPage}>
        <div className={styles.main}>

          <div className={styles['call-to-action-text']}>
            <p className={styles['cta-text']}>JOIN A NON-DENOMINATIONAL CHRISTIAN STUDENT ASSOCIATION</p>
          </div>

          <div className={styles['main-flex']}>

            <div className={styles['main-section--flex']}>
              {/* Boards Section */}
              <div className={styles.boards}>
                <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowBoards, showBoards)}>
                  <h3 className={`${styles['boards-title']} ${styles['category-title']}`}>
                    RPC Nyamira BOARDS
                  </h3>
                  <svg
                    className={`${styles['dropdown-icon']} ${showBoards ? styles.rotate : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </div>

                <div className={`${styles['dropdown-content']} ${showBoards ? styles.show : ''}`}>
                  <ol className={`${styles['boards-list']} ${styles['category-list']}`}>
                    <li className={styles['boards-item']}>
                      <Link to="/boards" className={styles['boards-item--link']}>ICT board</Link>
                    </li>
                    <li className={styles['boards-item']}>
                      <Link to="/boards" className={styles['boards-item--link']}>Editorial board</Link>
                    </li>
                    <li className={styles['boards-item']}>
                      <Link to="/boards" className={styles['boards-item--link']}>Media Production</Link>
                    </li>
                    <li className={styles['boards-item']}>
                      <Link to="/boards" className={styles['boards-item--link']}>Communication board</Link>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Evangelistic Teams Section */}
              <div className={styles.ET}>
                <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowEvangelisticTeams, showEvangelisticTeams)}>
                  <h3 className={`${styles['ET-title']} ${styles['category-title']}`}>
                    EVANGELISTIC TEAMS
                  </h3>
                  <svg
                    className={`${styles['dropdown-icon']} ${showEvangelisticTeams ? styles.rotate : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </div>

                <div className={`${styles['dropdown-content']} ${showEvangelisticTeams ? styles.show : ''}`}>
                  <ol className={`${styles['ET-list']} ${styles['category-list']}`}>
                    <li className={styles['ET-item']}>
                      <Link to="/ets/cet" className={styles['ET-item--link']}>CET</Link>
                    </li>
                    <li className={styles['ET-item']}>
                      <Link to="/ets/net" className={styles['ET-item--link']}>NET</Link>
                    </li>
                    <li className={styles['ET-item']}>
                      <Link to="/ets/eset" className={styles['ET-item--link']}>ESET</Link>
                    </li>
                    <li className={styles['ET-item']}>
                      <Link to="/ets/rivet" className={styles['ET-item--link']}>RIVET</Link>
                    </li>
                    <li className={styles['ET-item']}>
                      <Link to="/ets/weso" className={styles['ET-item--link']}>WESO</Link>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className={styles['main-section--flex']}>
              {/* Ministries Section */}
              <div className={styles.ministries}>
                <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowMinistries, showMinistries)}>
                  <h3 className={`${styles['ministries-title']} ${styles['category-title']}`}>
                    RPC Nyamira MINISTRIES
                  </h3>
                  <svg
                    className={`${styles['dropdown-icon']} ${showMinistries ? styles.rotate : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </div>

                <div className={`${styles['dropdown-content']} ${showMinistries ? styles.show : ''}`}>
                  <ol className={`${styles['ministries-list']} ${styles['category-list']}`}>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/ushering" className={styles['ministries-item--link']}>Ushering and Hospitality</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/creativity" className={styles['ministries-item--link']}>Creativity</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/compassion" className={styles['ministries-item--link']}>Compassion and Counseling</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/intercessory" className={styles['ministries-item--link']}>Intercessory</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/highSchool" className={styles['ministries-item--link']}>High School</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/wananzambe" className={styles['ministries-item--link']}>Wananzambe (Instrumentalists)</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/churchSchool" className={styles['ministries-item--link']}>Church School</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/praiseAndWorship" className={styles['ministries-item--link']}>Praise and Worship</Link>
                    </li>
                    <li className={styles['ministries-item']}>
                      <Link to="/ministries/choir" className={styles['ministries-item--link']}>Choir</Link>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Classes and Fellowships Section */}
              <div className={styles.committees}>
                <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowClasses, showClasses)}>
                  <h3 className={`${styles['comm-title']} ${styles['category-title']}`}>
                    CLASSES AND FELLOWSHIPS
                  </h3>
                  <svg
                    className={`${styles['dropdown-icon']} ${showClasses ? styles.rotate : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </div>

                <div className={`${styles['dropdown-content']} ${showClasses ? styles.show : ''}`}>
                  <ol className={`${styles['comm-list']} ${styles['category-list']}`}>
                    <li className={styles['comm-item']}>
                      <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Best-p classes</Link>
                    </li>
                    <li className={styles['comm-item']}>
                      <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Class fellowships</Link>
                    </li>
                    <li className={styles['comm-item']}>
                      <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Sisters fellowship</Link>
                    </li>
                    <li className={styles['comm-item']}>
                      <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Brothers fellowship</Link>
                    </li>
                    <li className={styles['comm-item']}>
                      <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Discipleship classes</Link>
                    </li>
                  </ol>
                </div>
              </div>




            </div>

          </div>

        </div>

        {/* Centralized Attendance Section */}
        <div className={styles.attendanceSection}>
          <h2 className={styles.attendanceSectionTitle}>Sign Attendance</h2>

          {/* Unified Session Status Display */}
          {activeSession && activeSession.isActive ? (
            <div className={`${styles.sessionStatus} ${styles.open}`}>
              <span className={styles.sessionStatusIcon}></span>
              <div className={styles.sessionStatusContent}>
                <div className={styles.sessionStatusText}>
                  Session Active
                  {activeSession.sessionId?.toString().startsWith('local-') && (
                    <span style={{ marginLeft: '10px', fontSize: '10px', background: '#ff4d4d', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>OFFLINE MODE</span>
                  )}
                </div>
                <div className={styles.sessionLeadershipRole}>
                  {activeSession.leadershipRole} has opened attendance
                </div>
                <div className={styles.sessionStartTime}>
                  Started: {new Date(activeSession.startTime).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.sessionStatus} ${styles.closed}`} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div className={styles.sessionStatusContent}>
                <div className={styles.sessionStatusText}>
                  No Session Open
                </div>
                <div className={styles.sessionStatusDescription}>
                  Currently, no attendance session is open for signing.
                  Please check back later when a leadership member opens a session.
                </div>
              </div>
            </div>
          )}

          {/* Test Button - Simpler approach */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#00c6ff',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.95rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 198, 255, 0.3)',
                border: 'none',
                position: 'relative',
                zIndex: 99999,
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#0099cc';
                target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#00c6ff';
                target.style.transform = 'translateY(0)';
              }}
              onClick={() => {
                // Check if there's an active session before opening form
                if (activeSession && activeSession.isActive) {
                  setShowAttendanceForm(true);
                  setAttendanceData({
                    fullName: '',
                    idNumber: '',
                    gender: '',
                    ageGroup: '',
                    phoneNumber: '',
                    signature: '',
                    userType: 'student'
                  });
                  setSelectedUser(null);
                  setSearchQuery('');
                } else {
                  alert('No active attendance session found. Please wait for a leader to open an attendance session.');
                }
              }}
            >
              SIGN ATTENDANCE
            </div>
          </div>

          {/* Attendance Form */}
          {showAttendanceForm && activeSession && activeSession.isActive ? (
            <div style={{
              background: 'white',
              padding: '24px',
              margin: '20px auto',
              borderRadius: '24px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              maxWidth: '450px',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative',
              animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#730051', margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                  {hasSearched ? (selectedUser ? 'Confirm Identity' : 'Complete Details') : 'Sign Attendance'}
                </h3>
                <button
                  onClick={() => {
                    setShowAttendanceForm(false);
                    setHasSearched(false);
                    setSearchQuery('');
                    setSelectedUser(null);
                    setAttendanceSuccess('');
                    setAttendanceError('');
                  }}
                  style={{ background: '#f5f5f5', border: 'none', color: '#666', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#eee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Messages */}
              {attendanceSuccess && (
                <div style={{ padding: '12px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '12px', color: '#1b5e20', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} /> <span>{attendanceSuccess}</span>
                </div>
              )}
              {attendanceError && (
                <div style={{ padding: '12px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '12px', color: '#c62828', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} /> <span>{attendanceError}</span>
                </div>
              )}

              {/* STEP 1: Enter ID Number */}
              {!hasSearched && (
                <div style={{ padding: '5px 0' }}>
                  <label style={{ fontWeight: '600', color: '#444', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                    Registration Number
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="e.g. IN16/0000/22"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          // TRIGGER SEARCH
                          if (searchQuery.length < 3) return;
                          setIsSearching(true);
                          axios.get(`${getApiUrl('usersSearch')}?query=${encodeURIComponent(searchQuery)}`, { withCredentials: true })
                            .then(res => {
                              const results = res.data;
                              if (results && results.length > 0) {
                                const match = results.find((u: any) => u.idNumber.toUpperCase() === searchQuery.toUpperCase()) || results[0];
                                setSelectedUser(match);
                                setAttendanceData({
                                  fullName: match.username,
                                  idNumber: match.idNumber,
                                  gender: match.gender,
                                  ageGroup: match.ageGroup,
                                  phoneNumber: match.phone,
                                  signature: '',
                                  userType: 'student'
                                });
                              } else {
                                setSelectedUser(null);
                                setAttendanceData(prev => ({
                                  ...prev,
                                  idNumber: searchQuery,
                                  userType: 'student',
                                  fullName: '', gender: '', phoneNumber: '', signature: ''
                                }));
                              }
                              setHasSearched(true);
                            })
                            .catch(err => {
                              console.error(err);
                              setSelectedUser(null);
                              setAttendanceData(prev => ({ ...prev, idNumber: searchQuery }));
                              setHasSearched(true);
                            })
                            .finally(() => setIsSearching(false));
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        letterSpacing: '0.5px',
                        transition: 'border-color 0.2s',
                        color: '#333'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00c6ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (searchQuery.length < 3) return;
                        setIsSearching(true);
                        axios.get(`${getApiUrl('usersSearch')}?query=${encodeURIComponent(searchQuery)}`, { withCredentials: true })
                          .then(res => {
                            const results = res.data;
                            if (results && results.length > 0) {
                              const match = results.find((u: any) => u.idNumber.toUpperCase() === searchQuery.toUpperCase()) || results[0];
                              setSelectedUser(match);
                              setAttendanceData({
                                fullName: match.username,
                                idNumber: match.idNumber,
                                gender: match.gender,
                                ageGroup: match.ageGroup,
                                phoneNumber: match.phone,
                                signature: '',
                                userType: 'student'
                              });
                            } else {
                              setSelectedUser(null);
                              setAttendanceData(prev => ({
                                ...prev,
                                idNumber: searchQuery,
                                userType: 'student',
                                fullName: '', gender: '', phoneNumber: '', signature: ''
                              }));
                            }
                            setHasSearched(true);
                          })
                          .catch(err => {
                            console.error(err);
                            setSelectedUser(null);
                            setAttendanceData(prev => ({ ...prev, idNumber: searchQuery }));
                            setHasSearched(true);
                          })
                          .finally(() => setIsSearching(false));
                      }}
                      disabled={isSearching || searchQuery.length < 3}
                      style={{
                        padding: '0 20px',
                        background: '#00c6ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {isSearching ? <div className={styles.searchSpinnerInline}></div> : <FontAwesomeIcon icon={faSearch} />}
                    </button>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      onClick={() => {
                        setHasSearched(true);
                        setSelectedUser(null);
                        setAttendanceData(prev => ({ ...prev, userType: 'visitor', idNumber: '' }));
                      }}
                      style={{ color: '#00c6ff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '5px' }}
                    >
                      Can't find ID No? Click here
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: Sign or Fill Details */}
              {hasSearched && (
                <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                  <button
                    onClick={() => {
                      setHasSearched(false);
                      setSearchQuery('');
                      setSelectedUser(null);
                    }}
                    style={{
                      background: 'none', border: 'none', color: '#666',
                      fontSize: '13px', marginBottom: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} /> <span>Search again</span>
                  </button>

                  <form onSubmit={handleAttendanceSubmit}>
                    {/* User Found Card */}
                    {selectedUser && (
                      <div style={{
                        background: '#f8fbff',
                        border: '1px solid #b3e5fc',
                        borderRadius: '16px',
                        padding: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '50%', background: '#00c6ff',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                        }}>
                          <FontAwesomeIcon icon={faUserCheck} />
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 2px 0', color: '#333', fontSize: '1.1rem' }}>{selectedUser.username}</h4>
                          <div style={{ fontSize: '13px', color: '#666' }}>{selectedUser.idNumber}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{selectedUser.gender}</div>
                        </div>
                      </div>
                    )}

                    {/* Manual Entry */}
                    {!selectedUser && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: '#fff9db', color: '#856404', borderRadius: '8px', fontSize: '13px', borderLeft: '4px solid #ffeb3b' }}>
                          Please fill in your details manually below.
                        </div>

                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>Full Name</label>
                          <input
                            type="text"
                            value={attendanceData.fullName}
                            onChange={(e) => setAttendanceData(prev => ({ ...prev, fullName: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                          />
                        </div>

                        {attendanceData.userType === 'student' && (
                          <>
                            <div className="form-group">
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>ID Number</label>
                              <input
                                type="text"
                                value={attendanceData.idNumber}
                                onChange={(e) => setAttendanceData(prev => ({ ...prev, idNumber: e.target.value }))}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>Gender</label>
                              <input
                                type="text"
                                value={attendanceData.gender}
                                onChange={(e) => setAttendanceData(prev => ({ ...prev, gender: e.target.value }))}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>Age Group</label>
                              <select
                                value={attendanceData.ageGroup}
                                onChange={(e) => setAttendanceData(prev => ({ ...prev, ageGroup: e.target.value }))}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                              >
                                <option value="">Select Year</option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                                <option value="5">Year 5</option>
                                <option value="6">Year 6</option>
                              </select>
                            </div>
                          </>
                        )}

                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>Phone Number</label>
                          <input
                            type="tel"
                            value={attendanceData.phoneNumber}
                            onChange={(e) => setAttendanceData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Signature */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontWeight: '600', color: '#333', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
                        <FontAwesomeIcon icon={faSignature} /> Your Signature
                      </label>
                      <div style={{ position: 'relative', border: '2px dashed #ccc', borderRadius: '12px', background: '#f9f9f9', overflow: 'hidden', height: '120px' }}>
                        <canvas
                          ref={(canvas) => {
                            if (canvas && !canvas.hasAttribute('data-initialized')) {
                              canvas.setAttribute('data-initialized', 'true');
                              const ctx = canvas.getContext('2d');
                              let isDrawing = false;
                              let lastX = 0; let lastY = 0;
                              const getCoords = (e: any) => {
                                const rect = canvas.getBoundingClientRect();
                                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                                return { x: clientX - rect.left, y: clientY - rect.top };
                              };
                              const start = (e: any) => { isDrawing = true; const { x, y } = getCoords(e); lastX = x; lastY = y; };
                              const move = (e: any) => {
                                if (!isDrawing || !ctx) return;
                                e.preventDefault();
                                const { x, y } = getCoords(e);
                                ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
                                ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
                                lastX = x; lastY = y;
                                setAttendanceData(prev => ({ ...prev, signature: canvas.toDataURL() }));
                              };
                              const end = () => isDrawing = false;
                              canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
                              canvas.addEventListener('touchstart', start, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', end);
                            }
                          }}
                          width={400} height={120}
                          style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const btn = e.currentTarget;
                            const wrapper = btn.closest('div');
                            const canvas = wrapper?.querySelector('canvas');
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              ctx?.clearRect(0, 0, canvas.width, canvas.height);
                              setAttendanceData(prev => ({ ...prev, signature: '' }));
                            }
                          }}
                          style={{
                            position: 'absolute', bottom: '10px', right: '10px',
                            background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', color: '#d32f2f',
                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontWeight: '600',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={generalLoading || !attendanceData.signature}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: generalLoading ? '#e0e0e0' : 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                        color: generalLoading ? '#888' : 'white',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: generalLoading ? 'not-allowed' : 'pointer',
                        boxShadow: generalLoading ? 'none' : '0 4px 15px rgba(0, 198, 255, 0.4)',
                        transition: 'transform 0.2s',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {generalLoading ? 'Submitting...' : (selectedUser ? 'Confirm & Sign' : 'Submit Attendance')}
                    </button>

                  </form>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className={styles.weeklyActivities}>

          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Our Weekly Activities</h3>
            <div className={styles.activityCardContainer}>
              {[
                { day: "Monday", event: "Discipleship" },
                { day: "Tuesday", event: "Ministry Meetings" },
                { day: "Wednesday", event: "Best P" },
                { day: "Thursday", event: "ET Fellowship" },
                { day: "Friday", event: "Friday Fellowship" }
              ].map((activity, index) => (
                <div key={index} className={styles.cardClasses}>
                  <h4 className={styles.cardTitle} >{activity.day}: {activity.event}</h4>
                  <p>Time: 6:50 PM to 8:50 PM</p>
                  <p>Venue: Communicated daily</p>
                </div>
              ))}

              <div className={styles.cardClasses}>
                <h4 className={styles.cardTitle} >Saturday: Class Fellowship</h4>
                <p>Time: 9:00 AM to 12:00 PM</p>
                <p>Venue: Communicated earlier</p>
              </div>

              <div className={styles.cardClasses}>
                <h4 className={styles.cardTitle} >Sunday : Services</h4>
                <p>First Servics: 7:30 AM to 10:00 AM</p>
                <p>Second Service: 10:15 AM to 12:45 PM</p>
                <p>Venue: Communicated before service</p>
              </div>
            </div>
          </div>

        </div>

        {/* others */}

        <div className={styles.containerOthers}>

          <div className={styles.appreciatingTitleText}>
            <h2 className={styles.appreciatingTitleh2Text}>Appreciating the opportunity to fellowship with RPC, other interesting forums are:</h2>
          </div>

          <div className={styles.containerOthersRow}>

            <div className={styles.othersColumns} onClick={handleOpenPrayerJoint}>
              {/* <span class="fa fa-clock-o size"></span> */}
              <FontAwesomeIcon icon={faClock} className={styles.othersIcon} />
              <span>Joint Prayer Time</span>

              {openPrayerJoint && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleClosePrayerJoint()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleClosePrayerJoint} />
                </div>
                <p className={styles.othersDisplayDivTitle}>Joint Prayers</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>RPC Nyamira joint prayers are conducted everyday from 8-50 pm to 9-30 pm and in the morning from 5-00am to 6-00 am venues are communicated before time, on wednesdays students meet at gethsamane from 1 to 2 pm and 5 to 6 pm for prayers and fasting</p>
                </div>
              </div>}

            </div>
            <div className={styles.othersColumns} onClick={handleOpenBibleStudy}>
              {/* <span class="fa fa-coffee size"></span> */}
              <FontAwesomeIcon icon={faCoffee} className={styles.othersIcon} />
              <span>Bible Study Nights</span>

              {openBibleStudy && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseBibleStudy()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseBibleStudy} />
                </div>
                <p className={styles.othersDisplayDivTitle}>Bible Study</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                </div>
              </div>}

            </div>
            <div className={styles.othersColumns} onClick={handleOpenDevelopment}>
              {/* <span class="fa fa-trophy size"></span> */}
              <FontAwesomeIcon icon={faTrophy} className={styles.othersIcon} />
              <span>Development Projects</span>


              {openDevelopment && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseDevelopment()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseDevelopment} />
                </div>
                <p className={styles.othersDisplayDivTitle}>Development</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                </div>
              </div>}

            </div>
            <div className={styles.othersColumns} onClick={handleOpenGraphics}>
              {/* <span class="fa fa-code size"></span> */}
              <FontAwesomeIcon icon={faCode} className={styles.othersIcon} />
              <span>Graphic Design Classes</span>

              {openGraphicDesign && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseGraphics()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseGraphics} />
                </div>
                <p className={styles.othersDisplayDivTitle}>Graphics Classes</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                </div>
              </div>}

            </div>
            <div className={styles.othersColumns} onClick={handleOpenCairos}>
              {/* <span class="fa fa-globe size"></span> */}
              <FontAwesomeIcon icon={faGlobe} className={styles.othersIcon} />
              <span>Kairos Course Training</span>

              {openKairosCourse && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseCairos()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseCairos} />
                </div>
                <p className={styles.othersDisplayDivTitle}>Kairos Classes</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                </div>
              </div>}
            </div>
            <div className={styles.othersColumns} onClick={handleOpenFocus}>
              {/* <span class="fa fa-rocket size"></span> */}
              <FontAwesomeIcon icon={faRocket} className={styles.othersIcon} />
              <span>FOCUS conferences</span>

              {openFocus && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseFocus()}>
                <div className={styles.closeOtherDisplayDiv}>
                  <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseFocus} />
                </div>
                <p className={styles.othersDisplayDivTitle}>FOCUS Conferences</p>
                <div className={styles.othersTextDiv}>
                  <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                </div>
              </div>}


            </div>
          </div>


          <div className={styles.containerAbout}>

            <div className={styles.container}>
              <div className={styles.about}>
                <p id="about" className={styles.aboutTitle}>About us</p>
                <div className={styles.aboutFlex}>
                  <div className={`${styles.aboutCol} ${styles.aboutCol1}`}>
                    <div className={styles.aboutCol1Mission}>
                      <h4><b>MISSION</b></h4>
                      <p>
                        To impact Christian core values and skills to believers through equipping, empowering and offering a conducive environment for effective living in the church and society.
                      </p>
                    </div>
                    <div className={styles.aboutCol1Vision}>
                      <h4><b>VISION</b></h4>
                      <p>
                        A relevant and effective Christian to the church and society.
                      </p>
                    </div>

                  </div>
                  <div className={`${styles.aboutCol} ${styles.aboutCol2}`}>
                    <h4><b>OBJECTIVES</b></h4>

                    <p className={styles.objectivesTitle}>Discipleship</p>
                    <ul className={styles.subList}>
                      <li>To deepen and strengthen spiritual lives of its members through the study of The Bible, prayers, Christian fellowships, and obedience to God. <span ><Link className={styles.registerSpan} to={"/Bs"}>Register for bible study today</Link> </span></li>
                      <li>To encourage responsible membership through the exercise of various spiritual gifts.</li>
                    </ul>

                    <p className={styles.objectivesTitle}>Evangelism</p>
                    <p className={styles.subList} >To encourage members to witness to the Lord Jesus, in and outside the church as the incarnate Son of God and seek to lead others to a personal faith in Him.</p>

                    <p className={styles.objectivesTitle}>Mission and Compassion</p>
                    <p className={styles.subList} >To prepare Christian believers to take good news to all nations of the world and to play an active role in communities where they live.</p>


                    <p className={styles.objectivesTitle}>Leadership Development</p>
                    <p className={styles.subList} >To identify and develop Christian leaders through training and experience. <span ><Link className={styles.registerSpan} to={"/worship-docket-admin"}>administer</Link> </span></p>


                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Professional Quick Links Sidebar */}
          <div className={styles['quick-links-sidebar']}>
            <div
              className={styles['quick-link-item']}
              data-text="Media"
              onClick={(e) => handleQuickLinkClick(navigateMedia, e)}
            >
              <Camera className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Win a Soul"
              onClick={(e) => handleQuickLinkClick(() => navigate('/save'), e)}
            >
              <Heart className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Constitution"
              onClick={(e) => handleQuickLinkClick(() => {
                const link = document.createElement('a');
                link.href = '/pdfs/constitution.pdf';
                link.download = 'constitution.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }, e)}
            >
              <BookOpen className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Library"
              onClick={(e) => handleQuickLinkClick(() => navigate('/library'), e)}
            >
              <Library className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Requisitions"
              onClick={(e) => handleQuickLinkClick(() => navigate('/requisitions'), e)}
            >
              <Package className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Financials"
              onClick={(e) => handleQuickLinkClick(() => navigate('/financial'), e)}
            >
              <DollarSign className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Bible Study"
              onClick={(e) => handleQuickLinkClick(() => navigate('/Bs'), e)}
            >
              <GraduationCap className={styles.icon} />
            </div>

            <div
              className={styles['quick-link-item']}
              data-text="Compassion & Counseling"
              onClick={(e) => handleQuickLinkClick(() => navigate('/compassion-counseling'), e)}
            >
              <MessageCircleHeart className={styles.icon} />
            </div>

          </div>

          <div className={`${styles['footer']} ${styles['home-footer']}`} id='contacts'>
            <p className={styles['footer--text']}>
              Rikuruma Pentecostal Church Nyamira 2026
              <span
                onClick={() => setShowAdminAccess(true)}
                style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '10px', color: '#888', textDecoration: 'underline' }}
              >
                Admin
              </span>
            </p>

            <div className={styles['hr']}></div>

            <div className={styles['social--links']}>
              <div className={styles['youtube']}>
                <a href="https://www.youtube.com/@savedbychriststainedbylove" target="blank" className={styles['social-link']}><FaYoutube /></a>
              </div>

              <div className={styles['facebook']}>
                <a href="https://www.facebook.com/share/18rhcZ1XpA/" target="blank" className={styles['social-link']}><FaFacebook /></a>
              </div>

              <div className={styles['tiktok']}>
                <a href="https://www.tiktok.com/@rikurumapentecostal" target="blank" className={styles['social-link']}><FaTiktok /></a>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Duplicate Registration Overlay */}
      {
        showDuplicateOverlay && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              maxWidth: '400px',
              margin: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>✓</div>

              <h2 style={{
                color: '#730051',
                marginBottom: '15px',
                fontSize: '24px'
              }}>Already Signed!</h2>

              <p style={{
                color: '#666',
                marginBottom: '30px',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Registration number <strong>{attendanceData.idNumber}</strong> has already signed attendance for this session. Thank you!
              </p>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    setShowDuplicateOverlay(false);
                    setShowAttendanceForm(false);
                  }}
                  style={{
                    padding: '12px 25px',
                    background: '#730051',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>

                <button
                  onClick={() => {
                    setShowDuplicateOverlay(false);
                    setAttendanceData({
                      fullName: '',
                      idNumber: '',
                      gender: '',
                      ageGroup: '',
                      phoneNumber: '',
                      signature: '',
                      userType: 'student'
                    });
                  }}
                  style={{
                    padding: '12px 25px',
                    background: '#00c6ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Admin Access Modal */}
      {showAdminAccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100000
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '20px',
            width: '90%', maxWidth: '350px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#730051', margin: '0 0 20px 0' }}>Overseer Access</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminPassword === 'Overseer') {
                setShowAdminAccess(false);
                setAdminPassword('');
                navigate('/signIn');
              } else {
                alert('Incorrect Password');
              }
            }}>
              <input
                type="password"
                placeholder="Enter Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '1px solid #ddd', marginBottom: '20px',
                  fontSize: '16px', outline: 'none'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setShowAdminAccess(false); setAdminPassword(''); }}
                  style={{
                    flex: 1, padding: '12px', background: '#f5f5f5', color: '#666',
                    border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', background: '#730051', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Display */}
    </React.Fragment >
  );
};

export default LandingPage;
