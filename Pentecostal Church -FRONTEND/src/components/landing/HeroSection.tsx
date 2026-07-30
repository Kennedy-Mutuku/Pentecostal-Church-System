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
            className="relative flex items-center gap-4 sm:gap-5 rounded-2xl px-5 sm:px-7 py-4 sm:py-5 w-full"
            style={{
              maxWidth: 580,
              background: 'linear-gradient(135deg, rgba(4,20,10,0.93) 0%, rgba(5,30,15,0.93) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(34,197,94,0.5)',
              boxShadow: '0 0 0 1px rgba(34,197,94,0.12), 0 0 40px rgba(34,197,94,0.22), 0 12px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            {/* Green glow strip at top */}
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: 'linear-gradient(90deg, transparent, #22c55e, transparent)', borderRadius: 2 }} />

            {/* Pulsing dot */}
            <div className="relative flex-shrink-0">
              <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 10px #22c55e, 0 0 20px rgba(34,197,94,0.5)' }} />
              <div className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping" style={{ background: '#22c55e', opacity: 0.45 }} />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.2em] mb-1" style={{ color: '#4ade80' }}>
                Coming Up
              </p>
              <p className="text-white text-[15px] sm:text-[18px] font-bold leading-snug truncate">
                {upcomingEvent.title}
              </p>
              {/* Countdown */}
              <div className="flex items-baseline gap-1.5 mt-1.5">
                {countdown.days > 0 && (
                  <>
                    <span className="font-black text-sm sm:text-base font-mono" style={{ color: '#4ade80' }}>{countdown.days}</span>
                    <span className="text-white/40 text-[11px] mr-0.5">d</span>
                  </>
                )}
                <span className="font-black text-sm sm:text-base font-mono" style={{ color: '#4ade80' }}>{String(countdown.hours).padStart(2,'0')}</span>
                <span className="text-white/40 text-[11px]">h</span>
                <span className="font-black text-sm sm:text-base font-mono" style={{ color: '#4ade80' }}>{String(countdown.minutes).padStart(2,'0')}</span>
                <span className="text-white/40 text-[11px]">m</span>
                <span className="font-black text-sm sm:text-base font-mono" style={{ color: '#4ade80' }}>{String(countdown.seconds).padStart(2,'0')}</span>
                <span className="text-white/40 text-[11px]">s</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch bg-white/10 flex-shrink-0" />

            {/* View Details button */}
            <button
              onClick={() => navigate('/news')}
              className="flex-shrink-0 flex items-center gap-2 font-extrabold rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-[12px] sm:text-[13px] uppercase tracking-wider transition-all duration-200"
              style={{
                color: '#fff',
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                boxShadow: '0 4px 16px rgba(34,197,94,0.45)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(34,197,94,0.7)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(34,197,94,0.45)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              View Details
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
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
