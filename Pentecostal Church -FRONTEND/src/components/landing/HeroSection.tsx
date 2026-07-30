import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBaseUrl } from '../../config/environment';

// Import all 7 hero images from assets
import hero1 from '../../assets/hero-1.jpg';
import hero2 from '../../assets/hero-2.jpg';
import hero3 from '../../assets/hero-3.jpg';
import hero4 from '../../assets/hero-4.jpg';
import hero5 from '../../assets/hero-5.jpg';
import hero6 from '../../assets/hero-6.jpg';
import hero7 from '../../assets/hero-7.jpg';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  objectPosition?: string;
}

interface ChurchEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  category: string;
}

type EventStatus =
  | { type: 'countdown'; days: number; hours: number; minutes: number; seconds: number }
  | { type: 'live' }
  | { type: 'ended'; endedAt: string };

function getEventStatus(ev: ChurchEvent): EventStatus {
  const now = Date.now();
  const start = new Date(ev.date).getTime();
  const end = ev.endDate ? new Date(ev.endDate).getTime() : null;
  if (end && now >= end) return { type: 'ended', endedAt: ev.endDate! };
  if (now >= start) return { type: 'live' };
  const diff = start - now;
  return {
    type: 'countdown',
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

type SundayStatus =
  | { type: 'countdown'; days: number; hours: number; minutes: number; seconds: number; nextLabel: string }
  | { type: 'live' }
  | { type: 'ended' };

function getSundayServiceStatus(): SundayStatus {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday

  // This week's Sunday at midnight
  const thisSunday = new Date(now);
  thisSunday.setDate(now.getDate() - day);
  thisSunday.setHours(0, 0, 0, 0);

  const serviceStart = new Date(thisSunday); serviceStart.setHours(9, 0, 0, 0);
  const serviceEnd   = new Date(thisSunday); serviceEnd.setHours(13, 0, 0, 0);

  const n = now.getTime();

  // Live: Sunday 9:00 AM – 1:00 PM
  if (day === 0 && n >= serviceStart.getTime() && n < serviceEnd.getTime()) {
    return { type: 'live' };
  }

  // Ended: Sunday after 1:00 PM until midnight (i.e. until Monday)
  if (day === 0 && n >= serviceEnd.getTime()) {
    return { type: 'ended' };
  }

  // Countdown: Sunday before 9 AM → count to today; any other day → count to next Sunday
  const target = day === 0
    ? serviceStart
    : (() => {
        const d = new Date(thisSunday);
        d.setDate(d.getDate() + 7);
        d.setHours(9, 0, 0, 0);
        return d;
      })();

  const nextLabel = day === 0 ? 'Today' : 'Next Sunday';
  const diff = target.getTime() - n;
  return {
    type: 'countdown',
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    nextLabel,
  };
}

const slides: Slide[] = [
  { image: hero1, title: 'Welcome to Rikuruma Pentecostal Church', subtitle: 'A Spirit-filled community transforming lives through the power of God in Nyamira', objectPosition: 'center 30%' },
  { image: hero2, title: 'Joyful Praise & Divine Worship', subtitle: 'Lifting high the name of Jesus with heart-filled adoration and thanksgiving', objectPosition: 'center 25%' },
  { image: hero3, title: 'Growing Together in Faith', subtitle: 'Building a strong foundation in Christ through fellowship and biblical teaching', objectPosition: 'center center' },
  { image: hero4, title: "The Truth of God's Word", subtitle: 'Preaching the unadulterated Gospel of Jesus Christ to transform generations', objectPosition: 'center 30%' },
  { image: hero5, title: 'Unity in Fervent Prayer', subtitle: 'Standing together in prayer for our community, church family, and the world', objectPosition: 'center center' },
  { image: hero6, title: 'Empowered Church Ministries', subtitle: 'Equipping believers to serve, lead, and make an impact in every sphere of life', objectPosition: 'center 25%' },
  { image: hero7, title: 'Fellowship & Love in Action', subtitle: "Demonstrating Christ's love through genuine fellowship and compassionate outreach", objectPosition: 'center 30%' },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide]   = useState(0);
  const [touchStart, setTouchStart]       = useState<number | null>(null);
  const [touchEnd, setTouchEnd]           = useState<number | null>(null);
  const [events, setEvents]               = useState<ChurchEvent[]>([]);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [, setTick]                       = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % slides.length), []);
  const prevSlide = useCallback(() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length), []);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(nextSlide, 5500);
    return () => clearInterval(id);
  }, [nextSlide]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const handleTouchMove  = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd   = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) nextSlide(); else if (d < -50) prevSlide();
  };

  // Fetch events for bubble
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/events`, { credentials: 'include' });
        if (!res.ok) return;
        const all: ChurchEvent[] = await res.json();
        const now = Date.now();
        const relevant = all
          .filter(e => {
            const end = e.endDate ? new Date(e.endDate).getTime() : null;
            return !end || now < end + 7200000; // hide >2h after ending
          })
          .sort((a, b) => {
            const aStarted = now >= new Date(a.date).getTime();
            const bStarted = now >= new Date(b.date).getTime();
            if (aStarted && !bStarted) return -1;
            if (!aStarted && bStarted) return 1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .slice(0, 3);
        if (relevant.length > 0) setEvents(relevant);
      } catch { /* silent */ }
    })();
  }, []);

  // Bubble always visible after mount (Sunday Service is always shown)
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Tick every second to keep all countdowns live
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full h-[460px] sm:h-[540px] md:h-[620px] lg:h-[680px] overflow-hidden bg-slate-950 select-none group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Images */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" style={{ objectPosition: slide.objectPosition || 'center 30%' }} loading={index === 0 ? 'eager' : 'lazy'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pt-8 pb-5 md:pt-12 md:pb-6">

        {/* Center Main Slide Text — flex-1 centers it in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            {slides.map((slide, index) => {
              if (index !== currentSlide) return null;
              return (
                <div key={index} className="space-y-4 md:space-y-6 transition-all duration-500">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-tight drop-shadow-lg" style={{ fontFamily: "'Archivo Black', 'Poppins', sans-serif", textShadow: '0 3px 8px rgba(0,0,0,0.9)' }}>
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md px-2" style={{ fontFamily: "'Poppins', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.85)' }}>
                    {slide.subtitle}
                  </p>
                  <div className="pt-2 md:pt-4 flex flex-row gap-3.5 justify-center items-center">
                    <a href="#about" className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-[#FF3B30] hover:bg-[#E0221A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-red-900/30 cursor-pointer text-center">
                      Learn More
                    </a>
                    <button onClick={() => navigate('/signIn')} className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg backdrop-blur-md transition-all duration-300 hover:scale-105 border border-white/40 hover:border-white cursor-pointer text-center">
                      Join Us
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Event Bubble — always shown, Sunday Service pinned ── */}
        {(() => {
          const ss = getSundayServiceStatus();
          return (
            <div
              className="flex justify-center px-6 sm:px-2 mb-2"
              style={{
                opacity: bubbleVisible ? 1 : 0,
                transform: bubbleVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
              }}
            >
              <div style={{ width: '100%', maxWidth: 520, background: 'rgba(5,16,9,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 12, overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 16px 7px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                    <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', opacity: 0.55 }} />
                    <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', position: 'relative' }} />
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Services &amp; Events
                  </span>
                </div>

                {/* ── Pinned: Sunday Service ── */}
                <div style={{ padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>Sunday Service</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', marginBottom: 6 }}>RPC Nyamira · 9:00 AM – 1:00 PM</p>

                  {ss.type === 'live' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 11px' }}>
                      <span className="animate-ping" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                      Happening Now
                    </span>
                  )}

                  {ss.type === 'ended' && (
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
                      Service ended 1:00 PM — next Sunday coming up
                    </span>
                  )}

                  {ss.type === 'countdown' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{ss.nextLabel}</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 5 }}>
                        {ss.days > 0 && (
                          <>
                            <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{ss.days}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>d</span>
                          </>
                        )}
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(ss.hours).padStart(2,'0')}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>h</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(ss.minutes).padStart(2,'0')}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>m</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(ss.seconds).padStart(2,'0')}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>s</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other events from backend */}
                {events.map((ev, i) => {
                  const status = getEventStatus(ev);
                  return (
                    <div key={ev._id} style={{ padding: '10px 20px', textAlign: 'center', borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                      <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>

                      {status.type === 'live' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 11px' }}>
                          <span className="animate-ping" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                          Happening Now
                        </span>
                      )}
                      {status.type === 'ended' && (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
                          Ended · {new Date(status.endedAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })} at {new Date(status.endedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {status.type === 'countdown' && (
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 5 }}>
                          {status.days > 0 && (<><span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{status.days}</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>d</span></>)}
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(status.hours).padStart(2,'0')}</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>h</span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(status.minutes).padStart(2,'0')}</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>m</span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(status.seconds).padStart(2,'0')}</span><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>s</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* View All button */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '7px 16px 10px' }}>
                  <button
                    onClick={() => navigate('/news')}
                    style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#16a34a', border: 'none', borderRadius: 7, padding: '6px 20px', cursor: 'pointer', letterSpacing: '0.04em', transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#15803d'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#16a34a'; }}
                  >
                    View All Events
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Bottom dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button key={index} onClick={() => setCurrentSlide(index)}
                className={`group relative h-2.5 rounded-full transition-all duration-500 focus:outline-none ${isActive ? 'w-10 sm:w-12 bg-amber-400' : 'w-2.5 sm:w-3 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-xl opacity-90 hover:opacity-100 focus:outline-none" aria-label="Previous Slide">
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-xl opacity-90 hover:opacity-100 focus:outline-none" aria-label="Next Slide">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
};

export default HeroSection;
