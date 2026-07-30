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
}

interface Countdown { days: number; hours: number; minutes: number; seconds: number; passed: boolean; }

const categoryColor: Record<string, string> = {
  Service: '#7c3aed', Revival: '#dc2626', Concert: '#0891b2',
  Conference: '#d97706', Outreach: '#059669', Other: '#6b7280',
};

function getCountdown(dateStr: string): Countdown {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    passed: false,
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function LiveCountdown({ dateStr }: { dateStr: string }) {
  const [cd, setCd] = useState(() => getCountdown(dateStr));
  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(dateStr)), 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  if (cd.passed) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(107,114,128,0.15)', borderRadius: 20, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
      Event Passed
    </span>
  );

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {[{ v: cd.days, l: 'Days' }, { v: cd.hours, l: 'Hrs' }, { v: cd.minutes, l: 'Min' }, { v: cd.seconds, l: 'Sec' }].map(({ v, l }) => (
        <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '6px 10px', minWidth: 48 }}>
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#111827', lineHeight: 1 }}>{pad(v)}</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginTop: 2 }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

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

  const now = Date.now();
  const live     = events.filter(e => new Date(e.date).getTime() <= now && (!e.endDate || new Date(e.endDate).getTime() > now));
  const upcoming = events.filter(e => new Date(e.date).getTime() > now);
  const past     = events.filter(e => new Date(e.date).getTime() <= now && e.endDate && new Date(e.endDate).getTime() <= now);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0520 0%, #1e0a3c 50%, #2d0a0a 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow rings */}
        {[300, 500, 700].map(s => (
          <div key={s} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: s, height: s, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#f59e0b', padding: '4px 16px', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, background: 'rgba(245,158,11,0.08)', marginBottom: 16 }}>
            Stay Connected
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.1 }}>
            News &amp; Events
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Everything happening at Rikuruma Pentecostal Church — services, revivals, concerts and more.
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 64px' }}>

        {loading && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Loading events…</p>
        )}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #d1d5db', borderRadius: 16, color: '#9ca3af' }}>
            <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>No events at the moment</p>
            <p style={{ fontSize: 13, margin: 0 }}>Check back soon — something is always coming up at RPC Nyamira!</p>
          </div>
        )}

        {/* Happening Now */}
        {live.length > 0 && (
          <>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#16a34a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Happening Now
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
              {live.map(ev => <EventCard key={ev._id} ev={ev} formatDate={formatDate} formatTime={formatTime} status="live" />)}
            </div>
          </>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#7c3aed', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 2, background: '#7c3aed', display: 'inline-block', borderRadius: 2 }} />
              Upcoming Events
              <span style={{ width: 24, height: 2, background: '#7c3aed', display: 'inline-block', borderRadius: 2 }} />
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
              {upcoming.map(ev => <EventCard key={ev._id} ev={ev} formatDate={formatDate} formatTime={formatTime} />)}
            </div>
          </>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#9ca3af', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 2, background: '#d1d5db', display: 'inline-block', borderRadius: 2 }} />
              Past Events
              <span style={{ width: 24, height: 2, background: '#d1d5db', display: 'inline-block', borderRadius: 2 }} />
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.7 }}>
              {past.map(ev => <EventCard key={ev._id} ev={ev} formatDate={formatDate} formatTime={formatTime} status="past" />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Event Card ────────────────────────────────────────────────── */
function EventCard({ ev, formatDate, formatTime, status = 'upcoming' }: {
  ev: ChurchEvent;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
  status?: 'live' | 'upcoming' | 'past';
}) {
  const color = status === 'past' ? '#9ca3af' : (categoryColor[ev.category] || '#6b7280');

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Poster image or accent bar */}
      {ev.poster ? (
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={getImageUrl(ev.poster)}
            alt={ev.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {status === 'live' && (
            <span style={{ position: 'absolute', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#fff', background: '#16a34a', borderRadius: 20, padding: '4px 10px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
              Live Now
            </span>
          )}
        </div>
      ) : (
        <div style={{ height: 4, background: status === 'live' ? '#22c55e' : color }} />
      )}

      <div style={{ padding: '22px 24px 24px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: status === 'live' ? '#16a34a' : color, padding: '3px 11px', borderRadius: 20, letterSpacing: 0.5 }}>
            {ev.category}
          </span>
          {status === 'live' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '2px 9px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Happening Now
            </span>
          )}
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            {formatDate(ev.date)} · {formatTime(ev.date)}
          </span>
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 10px', lineHeight: 1.25 }}>
          {ev.title}
        </h3>

        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.75, margin: '0 0 18px' }}>
          {ev.description}
        </p>

        {/* Status row */}
        <div style={{ marginBottom: 18 }}>
          {status === 'upcoming' && <LiveCountdown dateStr={ev.date} />}
          {status === 'live' && (
            <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
              Started {formatTime(ev.date)}{ev.endDate ? ` · Ends ${formatTime(ev.endDate)}` : ''}
            </span>
          )}
          {status === 'past' && ev.endDate && (
            <span style={{ fontSize: 13, color: '#9ca3af' }}>
              Ended {formatDate(ev.endDate)} at {formatTime(ev.endDate)}
            </span>
          )}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {ev.location}
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
