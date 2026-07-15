import { useState, useEffect } from 'react';
import { Radio, Clock } from 'lucide-react';
import { getApiUrl } from '../../config/environment';
import QuickAttendanceSign from '../attendance/QuickAttendanceSign';

interface Session {
  _id: string;
  title: string;
  ministry: string;
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  durationMinutes: number;
}

const LiveAttendanceBanner = () => {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchSessions = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(
        `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`,
        {
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' },
        }
      );
      if (response.ok) {
        const data = await response.json();
        let sessions: Session[] = data.sessions || [];
        
        // Offline/Dev Mode fallback
        const localSessions = JSON.parse(localStorage.getItem('rpc-attendance-sessions') || '[]');
        const activeLocals = localSessions.filter((s: any) => s.isActive);
        if (activeLocals.length > 0) {
            const newLocals = activeLocals.filter((ls: Session) => !sessions.find(s => s._id === ls._id));
            sessions = [...newLocals, ...sessions];
        }

        setActiveSessions(sessions);
        // Animate in when sessions first appear
        if (sessions.length > 0 && !isVisible) {
          setTimeout(() => setIsVisible(true), 100);
        } else if (sessions.length === 0) {
          setIsVisible(false);
        }
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      console.error('LiveAttendanceBanner: Error fetching sessions, falling back to local storage', err);
      // Offline fallback on error
      const localSessions = JSON.parse(localStorage.getItem('rpc-attendance-sessions') || '[]');
      const activeLocals = localSessions.filter((s: any) => s.isActive);
      setActiveSessions(activeLocals);
      
      if (activeLocals.length > 0 && !isVisible) {
        setTimeout(() => setIsVisible(true), 100);
      } else if (activeLocals.length === 0) {
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nothing to show
  if (activeSessions.length === 0) return null;

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      <section
        id="live-attendance"
        className="scroll-mt-20"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #7f1d1d 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '12px 16px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <h2
                style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {/* LIVE badge dot */}
                <span
                  style={{
                    position: 'relative',
                    display: 'flex',
                    width: '6px',
                    height: '6px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: '#fff',
                      animation: 'livePing 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      opacity: 0.8,
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                    }}
                  />
                </span>
                Open Attendances
                
                {activeSessions.some(s => s._id?.toString().startsWith('local-')) && (
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#fca5a5', marginLeft: '6px', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: '4px' }}>
                    OFFLINE
                  </span>
                )}
              </h2>
            </div>

            {/* Session list (Thin & Horizontal) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {activeSessions.map((session, index) => (
                <div
                  key={session._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    gap: '10px'
                  }}
                >
                  {/* Left: Number + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>{index + 1}.</span>
                    <h3
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={session.title}
                    >
                      {session.title}
                    </h3>
                  </div>

                  {/* Right: Time + Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={10} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>
                        {formatTime(session.startTime)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSigningSession(session)}
                      style={{
                        padding: '6px 14px',
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                      Sign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QuickAttendanceSign modal */}
      {signingSession && (
        <QuickAttendanceSign
          session={signingSession}
          onClose={() => setSigningSession(null)}
        />
      )}

      <style>{`
        @keyframes livePing {
          0% { transform: scale(1); opacity: 0.75; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes offlinePulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default LiveAttendanceBanner;
