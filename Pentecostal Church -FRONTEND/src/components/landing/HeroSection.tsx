import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

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

const slides: Slide[] = [
  {
    image: hero1,
    title: 'Welcome to Rikuruma Pentecostal Church',
    subtitle: 'A Spirit-filled community transforming lives through the power of God in Nyamira',
    objectPosition: 'center 30%',
  },
  {
    image: hero2,
    title: 'Joyful Praise & Divine Worship',
    subtitle: 'Lifting high the name of Jesus with heart-filled adoration and thanksgiving',
    objectPosition: 'center 25%',
  },
  {
    image: hero3,
    title: 'Growing Together in Faith',
    subtitle: 'Building a strong foundation in Christ through fellowship and biblical teaching',
    objectPosition: 'center center',
  },
  {
    image: hero4,
    title: "The Truth of God's Word",
    subtitle: 'Preaching the unadulterated Gospel of Jesus Christ to transform generations',
    objectPosition: 'center 30%',
  },
  {
    image: hero5,
    title: 'Unity in Fervent Prayer',
    subtitle: 'Standing together in prayer for our community, church family, and the world',
    objectPosition: 'center center',
  },
  {
    image: hero6,
    title: 'Empowered Church Ministries',
    subtitle: 'Equipping believers to serve, lead, and make an impact in every sphere of life',
    objectPosition: 'center 25%',
  },
  {
    image: hero7,
    title: 'Fellowship & Love in Action',
    subtitle: "Demonstrating Christ's love through genuine fellowship and compassionate outreach",
    objectPosition: 'center 30%',
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

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
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image - Clean, clear, un-scaled */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: slide.objectPosition || 'center 30%',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Gradient Overlays: Professional gradient ensuring readability without masking image detail */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-10 md:py-16">
        
        {/* Top bar with slide counter controls */}
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-xs sm:text-sm font-semibold tracking-wider bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-amber-400 font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/60 transition-all duration-200"
              title={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
              aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Center Main Slide Text */}
        <div className="my-auto text-center max-w-4xl mx-auto">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;

            if (!isActive) return null;

            return (
              <div
                key={index}
                className="space-y-4 md:space-y-6 transition-all duration-500"
              >
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-tight drop-shadow-lg"
                  style={{
                    fontFamily: "'Archivo Black', 'Poppins', sans-serif",
                    textShadow: '0 3px 8px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  {slide.title}
                </h1>

                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md px-2"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.85)',
                  }}
                >
                  {slide.subtitle}
                </p>

                <div className="pt-2 md:pt-4 flex flex-row gap-3.5 justify-center items-center">
                  <a
                    href="#about"
                    className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-[#FF3B30] hover:bg-[#E0221A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-red-900/30 cursor-pointer text-center"
                  >
                    Learn More
                  </a>
                  <button
                    onClick={() => navigate('/signIn')}
                    className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-white/10 hover:bg-white text-white hover:text-black text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg backdrop-blur-md transition-all duration-300 hover:scale-105 border border-white/40 hover:border-white cursor-pointer text-center"
                  >
                    Join Us
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Indicator Dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`group relative h-2.5 rounded-full transition-all duration-500 focus:outline-none ${
                  isActive ? 'w-10 sm:w-12 bg-amber-400' : 'w-2.5 sm:w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                title={`Slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows (Desktop & Tablet) */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-xl opacity-90 hover:opacity-100 focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-xl opacity-90 hover:opacity-100 focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
};

export default HeroSection;


