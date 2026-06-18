import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import community images
import hero1 from '../../assets/hero-1.jpg';
import hero2 from '../../assets/hero-2.jpg';
import hero3 from '../../assets/hero-3.jpg';
import hero4 from '../../assets/hero-4.jpg';
import hero5 from '../../assets/hero-5.jpg';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    image: hero1,
    title: 'Welcome to Rikuruma Pentecostal Church',
    subtitle: 'A Spirit-filled community transforming lives through the power of God in Nyamira',
  },
  {
    image: hero2,
    title: 'Our Sanctuary',
    subtitle: 'A place of refuge, prayer, and divine encounters for all people',
  },
  {
    image: hero3,
    title: 'Growing Together in Faith',
    subtitle: 'Building a strong foundation in Christ through fellowship and discipleship',
  },
  {
    image: hero4,
    title: 'The Word of God',
    subtitle: 'Preaching the unadulterated truth of the Gospel to transform generations',
  },
  {
    image: hero5,
    title: 'Unity in Prayer',
    subtitle: 'Fervent prayer and intercession for our community and the world',
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        setPreviousSlide(prev);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1200);
        return (prev + 1) % slides.length;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setPreviousSlide(currentSlide);
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  return (
    <section className="relative h-[380px] md:h-screen md:min-h-[650px] overflow-hidden bg-black md:pt-20">
      {/* Background Images with Smooth Crossfade */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPrevious = index === previousSlide && isAnimating;

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : isPrevious ? 1 : 0,
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
              transition: isActive ? 'opacity 1.2s ease-in-out' : 'opacity 0.8s ease-in-out 0.4s',
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 8s ease-out',
              }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto w-full relative h-[80%] md:h-[65%] flex items-center justify-center">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={index}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full transition-all duration-1000"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(-50%) scale(1)' : 'translateY(-40%) scale(0.95)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Main Heading in Serif font */}
                <h1
                  className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 md:mb-6 leading-tight tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 0, 0, 0.4)',
                    maxWidth: '850px'
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p
                  className="text-xs sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-4 md:mb-10 font-normal"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.85), 0 0 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
                  <a
                    href="#about"
                    className="px-6 py-2.5 md:px-8 md:py-3.5 bg-[#E53935] hover:bg-[#C62828] text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30 cursor-pointer text-center"
                  >
                    Learn More
                  </a>
                  <button
                    onClick={() => navigate('/signIn')}
                    className="px-6 py-2.5 md:px-8 md:py-3.5 bg-transparent hover:bg-white hover:text-black text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:scale-105 border-2 border-white cursor-pointer text-center"
                  >
                    Join Us
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 outline-none focus:outline-none ${index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/40 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
