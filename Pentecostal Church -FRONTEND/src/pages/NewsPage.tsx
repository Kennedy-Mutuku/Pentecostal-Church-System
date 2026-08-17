import React, { useState, useEffect, useCallback } from 'react';
import { getBaseUrl, getImageUrl } from '../config/environment';
import Lightbox from '../components/Lightbox';

interface ChurchEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  category: string;
  poster?: string;
  isActive: boolean;
  isPermanent?: boolean;
}

/* ── Countdown — always ticks to seconds ───────────────── */
function useCountdown(dateStr: string) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hrs  = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const hh = String(hrs).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  if (days > 0) return `${days}d ${hh}h ${mm}m ${ss}s`;
  if (hrs > 0)  return `${hh}h ${mm}m ${ss}s`;
  return `${mm}m ${ss}s`;
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}
function formatFullDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function getMonDay(d: string) {
  const dt = new Date(d);
  return {
    day: dt.toLocaleDateString('en-KE', { day: 'numeric' }),
    mon: dt.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase(),
    dow: dt.toLocaleDateString('en-KE', { weekday: 'short' }).toUpperCase(),
  };
}
function getEventStatus(ev: ChurchEvent): 'live' | 'upcoming' | 'past' {
  const now = Date.now();
  const start = new Date(ev.date).getTime();
  const end   = ev.endDate ? new Date(ev.endDate).getTime() : null;
  if (end && now >= end) return 'past';
  if (now >= start)      return 'live';
  return 'upcoming';
}


/* ── Sunday Service Hero ────────────────────────────────── */
function SundayHero({ ev }: { ev: ChurchEvent }) {
  const [lightbox, setLightbox] = useState(false);
  const status = getEventStatus(ev);
  const cd = useCountdown(ev.date);

  const timeStr = ev.endDate
    ? `${formatTime(ev.date)} to ${formatTime(ev.endDate)}`
    : formatTime(ev.date);

  const StatusBadge = () => {
    if (status === 'live') return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontSize: 11, fontWeight: 700, color: '#fff',
        background: '#16a34a', borderRadius: 20, padding: '6px 16px',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
        Happening Now
      </span>
    );
    if (status === 'upcoming' && cd) return (
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 600, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Starting in</p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 0.5, fontVariantNumeric: 'tabular-nums' }}>{cd}</p>
      </div>
    );
    if (status === 'past') return (
      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
        Ended · Back next Sunday
      </p>
    );
    return null;
  };

  /* ── With poster ── */
  if (ev.poster) {
    return (
      <>
        {lightbox && (
          <Lightbox src={getImageUrl(ev.poster)} alt="Sunday Service Poster" caption="Sunday Service Poster" onClose={() => setLightbox(false)} />
        )}
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 48, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <div
            style={{ position: 'relative', height: 340, cursor: 'zoom-in' }}
            onClick={() => setLightbox(true)}
            title="Click to view poster"
          >
            <img
              src={getImageUrl(ev.poster)}
              alt="Sunday Service"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,46,22,0.10) 0%, rgba(5,46,22,0.78) 55%, rgba(3,30,15,0.97) 100%)' }} />
            <span style={{
              position: 'absolute', top: 14, right: 14,
              fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
              background: 'rgba(0,0,0,0.30)', borderRadius: 4, padding: '4px 9px',
              backdropFilter: 'blur(6px)', letterSpacing: '0.06em',
            }}>View poster</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
                  Every Sunday · RPC Nyamira
                </span>
                <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: -0.4 }}>{ev.title}</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.48)' }}>{timeStr} &nbsp;·&nbsp; {ev.location}</p>
              </div>
              <div style={{ flexShrink: 0 }}><StatusBadge /></div>
            </div>
            {ev.description && (
              <p style={{ margin: '14px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, maxWidth: 620, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                {ev.description}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── No poster — designed feature card ── */
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', marginBottom: 48,
      background: 'linear-gradient(135deg, #031c0d 0%, #052e16 45%, #073d20 100%)',
      boxShadow: '0 4px 24px rgba(5,46,22,0.28)',
      position: 'relative',
    }}>
      {/* Decorative rings */}
      <div style={{ position: 'absolute', right: -70, top: -70, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(110,231,183,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: -20, top: -20, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(110,231,183,0.06)', pointerEvents: 'none' }} />
      {/* Subtle cross watermark */}
      <svg style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', opacity: 0.04, pointerEvents: 'none' }} width="140" height="140" viewBox="0 0 100 100" fill="white">
        <rect x="42" y="10" width="16" height="80" rx="4"/>
        <rect x="15" y="35" width="70" height="16" rx="4"/>
      </svg>

      <div style={{ position: 'relative', padding: '32px 36px 30px' }}>
        {/* Top row: label + status badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(110,231,183,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Every Sunday · RPC Nyamira
            </span>
          </div>
          <StatusBadge />
        </div>

        {/* Main content row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: -0.8 }}>
              {ev.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{timeStr}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.20)' }}>·</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{ev.location}</span>
            </div>
            {ev.description && (
              <p style={{ margin: 0, fontSize: 13.5, color: 'rgba(255,255,255,0.50)', lineHeight: 1.7, maxWidth: 520 }}>
                {ev.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Event Card ─────────────────────────────────────────── */
function EventCard({ ev, status }: { ev: ChurchEvent; status: 'live' | 'upcoming' | 'past' }) {
  const [lightbox, setLightbox] = useState(false);
  const cd = useCountdown(ev.date);
  const { day, mon, dow } = getMonDay(ev.date);
  const accent = status === 'past' ? '#9ca3af' : status === 'live' ? '#16a34a' : '#3b1a62';

  return (
    <>
      {lightbox && ev.poster && (
        <Lightbox src={getImageUrl(ev.poster)} alt={ev.title} caption={ev.title} onClose={() => setLightbox(false)} />
      )}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        opacity: status === 'past' ? 0.78 : 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Poster */}
        {ev.poster ? (
          <div
            style={{ position: 'relative', height: 190, flexShrink: 0, overflow: 'hidden', background: '#f3f4f6', cursor: 'zoom-in' }}
            onClick={() => setLightbox(true)}
            title="Click to view poster"
          >
            <img
              src={getImageUrl(ev.poster)}
              alt={ev.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', background: accent, borderRadius: 4, padding: '3px 8px' }}>
              {ev.category}
            </span>
            {status === 'live' && (
              <span style={{ position: 'absolute', top: 10, right: 10, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#fff', background: '#16a34a', borderRadius: 20, padding: '3px 9px' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                Live
              </span>
            )}
          </div>
        ) : (
          /* No poster — date column */
          <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: status === 'live' ? '#f0fdf4' : status === 'past' ? '#f9fafb' : '#faf5ff',
              borderRight: `3px solid ${accent}`,
              padding: '16px 18px', flexShrink: 0, minWidth: 68,
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.12em' }}>{mon}</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#111827', lineHeight: 1 }}>{day}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', marginTop: 2 }}>{dow}</span>
            </div>
            <div style={{ padding: '14px', flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ev.category}</span>
              {status === 'live' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '2px 7px' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Live
                </span>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Date line */}
          <p style={{ margin: '0 0 5px', fontSize: 10, color: status === 'past' ? '#9ca3af' : accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {status === 'past'
              ? `Held ${formatShortDate(ev.date)}${ev.endDate ? ` · Ended ${formatShortDate(ev.endDate)}` : ''}`
              : `${formatShortDate(ev.date)} · ${formatTime(ev.date)}${ev.endDate ? ` to ${formatTime(ev.endDate)}` : ''}`
            }
          </p>

          <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: status === 'past' ? '#374151' : '#111827', lineHeight: 1.3 }}>
            {ev.title}
          </h3>

          <p style={{
            margin: '0 0 auto', paddingBottom: 12,
            fontSize: 12.5, color: '#6b7280', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {ev.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af', minWidth: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.location}</span>
            </div>

            {status === 'upcoming' && cd && (
              <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#3b1a62', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {cd}
              </span>
            )}
            {status === 'live' && (
              <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#16a34a' }}>Ongoing</span>
            )}
            {status === 'past' && (
              <span style={{ flexShrink: 0, fontSize: 10, color: '#d1d5db', fontWeight: 500 }}>Past event</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Section heading ────────────────────────────────────── */
function SectionHead({ label, color, dot }: { label: string; color: string; dot?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      {dot
        ? <span style={{ width: 8, height: 8, background: color, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
        : <span style={{ width: 3, height: 18, background: color, borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
      }
      <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color }}>{label}</h2>
      <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
const NewsPage: React.FC = () => {
  const [events, setEvents]   = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/events`, { credentials: 'include' });
      if (res.ok) setEvents(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'News & Events | RPC Nyamira';
    fetchEvents();
  }, [fetchEvents]);

  const sunday = events.find(e => e.isPermanent);
  const rest   = events.filter(e => !e.isPermanent);
  const now    = Date.now();

  // Upcoming: nearest date first
  const upcoming = rest
    .filter(e => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Live
  const live = rest.filter(e =>
    new Date(e.date).getTime() <= now &&
    (!e.endDate || new Date(e.endDate).getTime() > now)
  );

  // Past: most recent first
  const past = rest
    .filter(e => e.endDate && new Date(e.endDate).getTime() <= now)
    .sort((a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime());

  return (
    <div style={{ background: '#f8f7f4', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0520 0%, #1e0a3c 60%, #2d0a0a 100%)',
        padding: '22px 28px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 3px', letterSpacing: -0.2 }}>
          News &amp; Events
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
          Services, revivals, concerts and more at RPC Nyamira
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '40px 24px 64px' }}>

        {/* Skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: '#e9e9e7', borderRadius: 12, height: 300 }} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Sunday Service */}
            {sunday && <SundayHero ev={sunday} />}

            {/* Happening Now */}
            {live.length > 0 && (
              <section style={{ marginBottom: 44 }}>
                <SectionHead label="Happening Now" color="#16a34a" dot />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {live.map(ev => <EventCard key={ev._id} ev={ev} status="live" />)}
                </div>
              </section>
            )}

            {/* Upcoming — nearest first */}
            {upcoming.length > 0 && (
              <section style={{ marginBottom: 44 }}>
                <SectionHead label="Upcoming Events" color="#3b1a62" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {upcoming.map(ev => <EventCard key={ev._id} ev={ev} status="upcoming" />)}
                </div>
              </section>
            )}

            {/* Past — most recent first */}
            {past.length > 0 && (
              <section style={{ marginBottom: 44 }}>
                <SectionHead label="Past Events" color="#9ca3af" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {past.map(ev => <EventCard key={ev._id} ev={ev} status="past" />)}
                </div>
              </section>
            )}

            {/* Empty */}
            {!sunday && rest.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>No events at the moment</p>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Check back soon — something is always coming up at RPC Nyamira.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
