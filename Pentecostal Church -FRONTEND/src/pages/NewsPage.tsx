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

  return (
    <>
      {lightbox && ev.poster && (
        <Lightbox src={getImageUrl(ev.poster)} alt="Sunday Service Poster" caption="Sunday Service Poster" onClose={() => setLightbox(false)} />
      )}
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 48, boxShadow: '0 8px 40px rgba(0,0,0,0.13)' }}>
        {ev.poster ? (
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,46,22,0.15) 0%, rgba(5,46,22,0.82) 60%, rgba(3,30,15,0.97) 100%)' }} />
            <span style={{
              position: 'absolute', top: 12, right: 12,
              fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
              background: 'rgba(0,0,0,0.35)', borderRadius: 4, padding: '3px 8px',
              backdropFilter: 'blur(4px)',
            }}>
              Click to view
            </span>
          </div>
        ) : (
          <div style={{ height: 160, background: 'linear-gradient(135deg, #052e16 0%, #064e3b 60%, #065f46 100%)' }} />
        )}

        <div style={{
          position: ev.poster ? 'absolute' : 'relative',
          bottom: 0, left: 0, right: 0,
          padding: '24px 28px 22px',
          background: ev.poster ? 'transparent' : 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 7 }}>
                Every Sunday · RPC Nyamira
              </span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5 }}>
                {ev.title}
              </h2>
              <p style={{ margin: '5px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.52)' }}>
                {formatTime(ev.date)}{ev.endDate ? ` – ${formatTime(ev.endDate)}` : ''} &nbsp;·&nbsp; {ev.location}
              </p>
            </div>

            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              {status === 'live' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: '#16a34a', borderRadius: 20, padding: '6px 14px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                  Happening Now
                </span>
              )}
              {status === 'past' && (
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  Ended · Next Sunday coming up
                </p>
              )}
              {status === 'upcoming' && cd && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 9, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Starting in</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'monospace', letterSpacing: 1 }}>{cd}</p>
                </div>
              )}
            </div>
          </div>

          {ev.description && (
            <p style={{ margin: '14px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.52)', lineHeight: 1.65, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, maxWidth: 640 }}>
              {ev.description}
            </p>
          )}
        </div>
      </div>
    </>
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
              : `${formatShortDate(ev.date)} · ${formatTime(ev.date)}${ev.endDate ? ` – ${formatTime(ev.endDate)}` : ''}`
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
          Services, revivals, concerts and more — RPC Nyamira
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
