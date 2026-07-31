import { useState, useEffect, useCallback } from 'react';
import { getBaseUrl } from '../../config/environment';
import '../../styles/NewsEvents.css';

interface ChurchEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

const categoryColors: Record<string, string> = {
  Service:    '#6d28d9',
  Revival:    '#dc2626',
  Concert:    '#0891b2',
  Conference: '#d97706',
  Outreach:   '#059669',
  Other:      '#6b7280',
};

function getCountdown(dateStr: string): Countdown {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, passed: false };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function CountdownDisplay({ dateStr }: { dateStr: string }) {
  const [cd, setCd] = useState<Countdown>(() => getCountdown(dateStr));

  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(dateStr)), 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  if (cd.passed) return (
    <div className="ne-passed-badge">Event has passed</div>
  );

  return (
    <div className="ne-countdown">
      {[
        { v: cd.days,    l: 'days'  },
        { v: cd.hours,   l: 'hrs'   },
        { v: cd.minutes, l: 'min'   },
        { v: cd.seconds, l: 'sec'   },
      ].map(({ v, l }) => (
        <div className="ne-cd-box" key={l}>
          <span className="ne-cd-num">{pad(v)}</span>
          <span className="ne-cd-label">{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function NewsEvents() {
  const [events, setEvents]     = useState<ChurchEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<ChurchEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/events`, { credentials: 'include' });
      if (res.ok) setEvents(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  if (loading) return null;
  if (events.length === 0) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="ne-section">
      {/* Section header */}
      <div className="ne-header">
        <div className="ne-header-inner">
          <span className="ne-eyebrow">What's Coming</span>
          <h2 className="ne-title">News &amp; Upcoming Events</h2>
          <p className="ne-sub">Stay connected with what God is doing at Rikuruma Pentecostal Church</p>
        </div>
        <div className="ne-header-deco" aria-hidden="true">
          <div className="ne-deco-ring ne-deco-ring--1" />
          <div className="ne-deco-ring ne-deco-ring--2" />
          <div className="ne-deco-ring ne-deco-ring--3" />
        </div>
      </div>

      {/* Cards track */}
      <div className="ne-track-wrapper">
        <div className="ne-track">
          {events.map((ev) => {
            const color = categoryColors[ev.category] || categoryColors.Other;
            const passed = new Date(ev.date).getTime() < Date.now();
            return (
              <article
                key={ev._id}
                className={`ne-card${passed ? ' ne-card--passed' : ''}`}
                style={{ '--accent': color } as React.CSSProperties}
                onClick={() => setSelected(ev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(ev)}
              >
                {/* Glowing top bar */}
                <div className="ne-card-bar" />

                <div className="ne-card-body">
                  {/* Category + date row */}
                  <div className="ne-card-meta">
                    <span className="ne-cat-badge" style={{ background: color }}>
                      {ev.category}
                    </span>
                    <span className="ne-card-date">
                      {new Date(ev.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="ne-card-title">{ev.title}</h3>

                  {/* Countdown */}
                  <CountdownDisplay dateStr={ev.date} />

                  {/* Location */}
                  <div className="ne-card-location">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{ev.location}</span>
                  </div>

                  <button className="ne-view-btn" tabIndex={-1}>
                    View Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="ne-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ne-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ne-modal-close" onClick={() => setSelected(null)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="ne-modal-accent" style={{ background: categoryColors[selected.category] || '#6b7280' }} />

            <div className="ne-modal-body">
              <span
                className="ne-cat-badge ne-cat-badge--lg"
                style={{ background: categoryColors[selected.category] || '#6b7280' }}
              >
                {selected.category}
              </span>

              <h2 className="ne-modal-title">{selected.title}</h2>

              <div className="ne-modal-countdown">
                <CountdownDisplay dateStr={selected.date} />
              </div>

              <p className="ne-modal-desc">{selected.description}</p>

              <div className="ne-modal-details">
                <div className="ne-modal-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <span className="ne-detail-label">Date</span>
                    <span className="ne-detail-val">{formatDate(selected.date)}</span>
                  </div>
                </div>
                <div className="ne-modal-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <span className="ne-detail-label">Time</span>
                    <span className="ne-detail-val">{formatTime(selected.date)}</span>
                  </div>
                </div>
                <div className="ne-modal-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <span className="ne-detail-label">Location</span>
                    <span className="ne-detail-val">{selected.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
