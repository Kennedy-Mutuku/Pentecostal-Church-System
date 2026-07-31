import React, { useState, useEffect, useCallback } from 'react';
import { getBaseUrl, getImageUrl } from '../config/environment';

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

/* ── Countdown helper (live text) ───────────────────────── */
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
  if (days > 0)  return `${days}d ${hrs}h`;
  if (hrs > 0)   return `${hrs}h ${mins}m`;
  if (mins > 0)  return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function getSundayStatus(ev: ChurchEvent) {
  const now = Date.now();
  const start = new Date(ev.date).getTime();
  const end   = ev.endDate ? new Date(ev.endDate).getTime() : null;
  if (end && now >= end)   return 'ended' as const;
  if (now >= start)        return 'live'  as const;
  return 'upcoming' as const;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}
function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ── Sunday Service Banner ──────────────────────────────── */
function SundayBanner({ ev }: { ev: ChurchEvent }) {
  const status = getSundayStatus(ev);
  const cd = useCountdown(ev.date);

  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #d1fae5',
      background: '#fff',
      marginBottom: 36,
    }}>
      {ev.poster && (
        <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
          <img src={getImageUrl(ev.poster)} alt="Sunday Service" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))' }} />
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)', padding: '20px 24px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 5 }}>
              Every Sunday
            </p>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
              {ev.title}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              {formatTime(ev.date)}{ev.endDate ? ` – ${formatTime(ev.endDate)}` : ''} &nbsp;·&nbsp; {ev.location}
            </p>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {status === 'live' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: '#16a34a', borderRadius: 20, padding: '5px 13px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Happening Now
              </span>
            )}
            {status === 'ended' && (
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                Service ended {ev.endDate ? formatTime(ev.endDate) : ''}<br />Next Sunday coming up
              </p>
            )}
            {status === 'upcoming' && cd && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 10, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Starting in</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'monospace', letterSpacing: 1 }}>{cd}</p>
              </div>
            )}
          </div>
        </div>

        {ev.description && (
          <p style={{ margin: '14px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
            {ev.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Regular Event Card ─────────────────────────────────── */
function EventCard({ ev, status }: { ev: ChurchEvent; status: 'live' | 'upcoming' | 'past' }) {
  const cd = useCountdown(ev.date);

  const accentColor = status === 'past' ? '#d1d5db'
    : status === 'live' ? '#16a34a'
    : '#482078';

  const d = new Date(ev.date);
  const dayNum  = d.toLocaleDateString('en-KE', { day: 'numeric' });
  const dayName = d.toLocaleDateString('en-KE', { weekday: 'short' }).toUpperCase();
  const mon     = d.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase();

  return (
    <div style={{
      display: 'flex',
      background: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      opacity: status === 'past' ? 0.65 : 1,
    }}>
      {/* Date column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: status === 'live' ? '#f0fdf4' : status === 'past' ? '#f9fafb' : '#faf5ff',
        borderRight: `3px solid ${accentColor}`,
        padding: '14px 16px',
        minWidth: 64,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: '0.12em' }}>{mon}</span>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#111827', lineHeight: 1.1, marginTop: 1 }}>{dayNum}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.12em', marginTop: 2 }}>{dayName}</span>
      </div>

      {/* Poster (if any) */}
      {ev.poster && (
        <div style={{ width: 90, flexShrink: 0, overflow: 'hidden' }}>
          <img src={getImageUrl(ev.poster)} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, padding: '14px 18px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              {ev.category} &nbsp;·&nbsp; {formatTime(ev.date)}{ev.endDate ? ` – ${formatTime(ev.endDate)}` : ''}
            </p>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827', lineHeight: 1.25 }}>
              {ev.title}
            </h3>
          </div>

          {/* Status badge */}
          {status === 'live' && (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Live
            </span>
          )}
          {status === 'upcoming' && cd && (
            <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#482078', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap' }}>
              in {cd}
            </span>
          )}
        </div>

        <p style={{ margin: '6px 0 10px', fontSize: 12.5, color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {ev.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#9ca3af' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {ev.location}
          {status === 'past' && ev.endDate && (
            <span style={{ marginLeft: 6, color: '#d1d5db' }}>· Ended {formatShortDate(ev.endDate)}</span>
          )}
        </div>
      </div>
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

  const sunday  = events.find(e => e.isPermanent);
  const rest    = events.filter(e => !e.isPermanent);
  const now     = Date.now();
  const live    = rest.filter(e => new Date(e.date).getTime() <= now && (!e.endDate || new Date(e.endDate).getTime() > now));
  const upcoming = rest.filter(e => new Date(e.date).getTime() > now);
  const past    = rest.filter(e => new Date(e.date).getTime() <= now && e.endDate && new Date(e.endDate).getTime() <= now);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0520 0%, #1e0a3c 50%, #2d0a0a 100%)',
        padding: '56px 24px 48px',
        textAlign: 'center',
      }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b', padding: '3px 14px', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, background: 'rgba(245,158,11,0.07)', marginBottom: 14 }}>
          Stay Connected
        </span>
        <h1 style={{ fontSize: 'clamp(1.7rem,5vw,2.8rem)', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: -0.5, lineHeight: 1.1 }}>
          News &amp; Events
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
          Everything happening at Rikuruma Pentecostal Church — services, revivals, concerts and more.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '36px 20px 72px' }}>

        {loading && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: 48, fontSize: 14 }}>Loading…</p>
        )}

        {!loading && (
          <>
            {/* Sunday Service — always first */}
            {sunday && <SundayBanner ev={sunday} />}

            {/* Happening Now */}
            {live.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
                  <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#16a34a' }}>Happening Now</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {live.map(ev => <EventCard key={ev._id} ev={ev} status="live" />)}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#482078', whiteSpace: 'nowrap' }}>Upcoming</h2>
                  <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {upcoming.map(ev => <EventCard key={ev._id} ev={ev} status="upcoming" />)}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', whiteSpace: 'nowrap' }}>Past Events</h2>
                  <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {past.map(ev => <EventCard key={ev._id} ev={ev} status="past" />)}
                </div>
              </section>
            )}

            {!sunday && rest.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>No events at the moment</p>
                <p style={{ fontSize: 13, margin: 0 }}>Check back soon — something is always coming up at RPC Nyamira!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
