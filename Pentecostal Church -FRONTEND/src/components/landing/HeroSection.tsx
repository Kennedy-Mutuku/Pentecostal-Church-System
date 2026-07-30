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
  category: string;
}

interface Countdown { days: number; hours: number; minutes: number; seconds: number; }

const slides: Slide[] = [
  { image: hero1, title: 'Welcome to Rikuruma Pentecostal Church', subtitle: 'A Spirit-filled community transforming lives through the power of God in Nyamira', objectPosition: 'center 30%' },
  { image: hero2, title: 'Joyful Praise & Divine Worship', subtitle: 'Lifting high the name of Jesus with heart-filled adoration and thanksgiving', objectPosition: 'center 25%' },
  { image: hero3, title: 'Growing Together in Faith', subtitle: 'Building a strong foundation in Christ through fellowship and biblical teaching', objectPosition: 'center center' },
  { image: hero4, title: "The Truth of God's Word", subtitle: 'Preaching the unadulterated Gospel of Jesus Christ to transform generations', objectPosition: 'center 30%' },
  { image: hero5, title: 'Unity in Fervent Prayer', subtitle: 'Standing together in prayer for our community, church family, and the world', objectPosition: 'center center' },
  { image: hero6, title: 'Empowered Church Ministries', subtitle: 'Equipping believers to serve, lead, and make an impact in every sphere of life', objectPosition: 'center 25%' },
  { image: hero7, title: 'Fellowship & Love in Action', subtitle: "Demonstrating Christ's love through genuine fellowship and compassionate outreach", objectPosition: 'center 30%' },
];

const categoryAccent: Record<string, string> = {
  Service: '#7c3aed', Revival: '#dc2626', Concert: '#0891b2',
  Conference: '#d97706', Outreach: '#059669', Other: '#6b7280',
};

function calcCountdown(dateStr: string): Countdown | null {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide]   = useState(0);
  const [touchStart, setTouchStart]       = useState<number | null>(null);
  const [touchEnd, setTouchEnd]           = useState<number | null>(null);
  const [upcomingEvent, setUpcomingEvent] = useState<ChurchEvent | null>(null);
  const [countdown, setCountdown]         = useState<Countdown | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);

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

  // Fetch next upcoming event
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/events`, { credentials: 'include' });
        if (!res.ok) return;
        const events: ChurchEvent[] = await res.json();
        const upcoming = events
          .filter(e => new Date(e.date).getTime() > Date.now())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        if (upcoming) {
          setUpcomingEvent(upcoming);
          setTimeout(() => setBubbleVisible(true), 800);
        }
      } catch { /* silent */ }
    })();
  }, []);

  // Live countdown tick
  useEffect(() => {
    if (!upcomingEvent) return;
    const tick = () => setCountdown(calcCountdown(upcomingEvent.date));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [upcomingEvent]);

  const accent = upcomingEvent ? (categoryAccent[upcomingEvent.category] || '#6b7280') : '#dc2626';

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
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-10 md:py-16">

        {/* Center Main Slide Text */}
        <div className="my-auto text-center max-w-4xl mx-auto">
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

        {/* Bottom dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
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

      {/* ── Event Bubble ──────────────────────────────────────────── */}
      {upcomingEvent && countdown && (
        <div
          className="absolute z-30 bottom-11 sm:bottom-13 left-0 right-0 flex justify-center px-4"
          style={{
            opacity: bubbleVisible ? 1 : 0,
            transform: bubbleVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Bubble */}
          <div
            className="flex items-center gap-4 sm:gap-5 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 w-full"
            style={{
              maxWidth: 580,
              background: 'rgba(6,18,10,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderLeft: '3px solid #22c55e',
              border: '1px solid rgba(34,197,94,0.28)',
              borderLeftWidth: 3,
              borderLeftColor: '#22c55e',
              boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
            }}
          >
            {/* Pulsing dot */}
            <div className="relative flex-shrink-0">
              <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
              <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ background: '#22c55e', opacity: 0.5 }} />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 10, fontWeight: 600, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                Next Event
              </p>
              <p style={{ fontSize: 21, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 5 }} className="truncate sm:text-[24px]">
                {upcomingEvent.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                {countdown.days > 0 && (
                  <>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{countdown.days}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginRight: 1 }}>d</span>
                  </>
                )}
                <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(countdown.hours).padStart(2,'0')}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>h</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(countdown.minutes).padStart(2,'0')}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>m</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{String(countdown.seconds).padStart(2,'0')}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>s</span>
              </div>
            </div>

            {/* Details button */}
            <button
              onClick={() => navigate('/news')}
              style={{
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                background: '#16a34a',
                border: 'none',
                borderRadius: 7,
                padding: '6px 13px',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#15803d'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#16a34a'; }}
            >
              Details
            </button>
          </div>
        </div>
      )}

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
