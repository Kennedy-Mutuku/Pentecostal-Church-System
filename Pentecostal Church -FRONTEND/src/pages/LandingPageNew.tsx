import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/landing';
import LiveAttendanceBanner from '../components/landing/LiveAttendanceBanner';
import NewsEvents from '../components/landing/NewsEvents';
import '../styles/landingRikuruma.css';

interface Detail {
  icon: string;
  label: string;
  value: string;
}

interface Activity {
  id: number;
  poster: string;
  status: string;
  statusClass: string;
  title: string;
  description: string;
  details: Detail[];
}

interface Choir {
  id: number;
  title: string;
  videoId: string;
  start: number;
}

interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

const LandingPageNew = () => {
  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials: Testimonial[] = [
    {
      quote: "Rikuruma Pentecostal Church has been a blessing to my family. The teachings are biblical, the worship is powerful, and the fellowship is genuine. God is truly in this place!",
      author: "Susan Mokeira",
      location: "Nyakoe"
    },
    {
      quote: "I found Christ at Rikuruma and my life was transformed. The youth ministry helped me grow in faith and discover my purpose. I am forever grateful to this church family.",
      author: "Mirriam",
      location: "Magwagwa"
    },
    {
      quote: "The prayers and support from this church carried me through difficult times. Rikuruma Pentecostal Church is more than a church - it's a family where God's love is demonstrated daily.",
      author: "Kennedy Mutuku",
      location: "Kisii"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);



  // Activities Slider State
  const [currentActivity, setCurrentActivity] = useState(0);
  const activities: Activity[] = [
    {
      id: 1,
      poster: '/images/activity-album-launch.png',
      status: 'Successful Launch',
      statusClass: 'success',
      title: 'Trumpet of Yahweh: First Album',
      description: "We celebrate the successful launch of our choir's first album, a journey of faith and praise that has finally come to fruition for the glory of God.",
      details: [
        { icon: 'fas fa-music', label: 'Songs', value: 'Umetutengeneza, Leo Kuna nini, Mwanadamu...' },
        { icon: 'fas fa-calendar-check', label: 'Launched', value: '15th November 2025' },
        { icon: 'fas fa-users', label: 'Choir', value: 'Trumpet of Yahweh (RPC Nyamira)' }
      ]
    },
    {
      id: 2,
      poster: '/images/activity-revival.jpg',
      status: 'Upcoming Revival',
      statusClass: '',
      title: 'Revival Meeting & Album Launch',
      description: 'Join us for a powerful time of spiritual awakening and revival as we continue to celebrate the power of God in our midst.',
      details: [
        { icon: 'fas fa-user-tie', label: 'Hosts', value: 'Rev. Kepher & Susan Omondi' },
        { icon: 'fas fa-microphone', label: 'Guests', value: 'Bishop Ezekiel Ndubi, Pastor Jackline Kevin' },
        { icon: 'fas fa-clock', label: 'Time', value: 'Sat 15th Nov 2025 | 8:00 AM' }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const nextActivity = () => setCurrentActivity((currentActivity + 1) % activities.length);
  const prevActivity = () => setCurrentActivity((currentActivity - 1 + activities.length) % activities.length);

  // Choir Slider State
  const [currentChoir, setCurrentChoir] = useState(0);
  const choirs: Choir[] = [
    {
      id: 1,
      title: "1. Born to Worship Singers",
      videoId: "O9QnigyLpKY",
      start: 12
    },
    {
      id: 2,
      title: "2. Agape Hearts Singers",
      videoId: "y7yKev9NPYI",
      start: 10
    },
    {
      id: 3,
      title: "3. Trumpet of Yahweh Choir",
      videoId: "AaiI4I7-Bmw",
      start: 12
    }
  ];
  const [playingChoirId, setPlayingChoirId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChoir(prev => (prev + 1) % choirs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [choirs.length]);

  const nextChoir = () => setCurrentChoir((currentChoir + 1) % choirs.length);
  const prevChoir = () => setCurrentChoir((currentChoir - 1 + choirs.length) % choirs.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Scoped Rikuruma Landing page sections */}
      <div className="landing-rikuruma">
        {/* Wave Divider */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path className="shape-fill" fill="#ffffff" d="M0,60 Q12.5,50 25,60 T50,60 T75,60 T100,60 T125,60 T150,60 T175,60 T200,60 T225,60 T250,60 T275,60 T300,60 T325,60 T350,60 T375,60 T400,60 T425,60 T450,60 T475,60 T500,60 T525,60 T550,60 T575,60 T600,60 T625,60 T650,60 T675,60 T700,60 T725,60 T750,60 T775,60 T800,60 T825,60 T850,60 T875,60 T900,60 T925,60 T950,60 T975,60 T1000,60 T1025,60 T1050,60 T1075,60 T1100,60 T1125,60 T1150,60 T1175,60 T1200,60 L1200,120 L0,120 Z"></path>
            <path fill="none" stroke="#3b1a62" strokeWidth="4" d="M0,60 Q12.5,50 25,60 T50,60 T75,60 T100,60 T125,60 T150,60 T175,60 T200,60 T225,60 T250,60 T275,60 T300,60 T325,60 T350,60 T375,60 T400,60 T425,60 T450,60 T475,60 T500,60 T525,60 T550,60 T575,60 T600,60 T625,60 T650,60 T675,60 T700,60 T725,60 T750,60 T775,60 T800,60 T825,60 T850,60 T875,60 T900,60 T925,60 T950,60 T975,60 T1000,60 T1025,60 T1050,60 T1075,60 T1100,60 T1125,60 T1150,60 T1175,60 T1200,60"></path>
          </svg>
        </div>

        {/* Live Attendance Sessions — appears only when sessions are active */}
        <LiveAttendanceBanner />

        {/* News & Upcoming Events */}
        <NewsEvents />

        {/* About Section */}
        <section id="about" className="about-section section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Who We Are</span>
              <h2 className="section-title">About Rikuruma Pentecostal Church Nyamira</h2>
            </div>
            <div className="about-content">
              <div className="about-text">
                <p className="lead">
                  Rikuruma Pentecostal Church is a Christ-centered, Bible-believing ministry dedicated to preaching the Gospel of Jesus Christ and raising disciples through the power of the Holy Spirit. Guided by the Word of God, we believe in the sovereignty and eternal existence of God.
                </p>
                <div className="location-badge">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Located in Magwagwa, Nyamira County, Kenya</span>
                </div>
                <p>
                  Join us as we worship in spirit and in truth and grow together in faith. Our community is built on the foundation of God's Word and empowered by the Holy Spirit.
                </p>
                <p>
                  Through dynamic worship services, powerful prayer meetings, and passionate community outreach, we are committed to being a beacon of hope and light in Nyamira and beyond.
                </p>

                <Link to="/about" className="btn btn-primary">Read More About Us</Link>
              </div>
              <div className="about-image">
                <img
                  src="/images/about-church.jpg"
                  alt="Rikuruma Pentecostal Church Nyamira Building"
                  className="about-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Mission Section */}
        <section id="vision-mission" className="vision-mission-section">
          <div className="container">
            <div className="vm-cards">
              <div className="vm-card vision-card">
                <div className="vm-icon"><i className="fas fa-eye"></i></div>
                <div className="vm-content">
                  <h3>Our Vision</h3>
                  <p>To be a Spirit-empowered church that transforms Nyamira and beyond through the Gospel, raising up disciples who impact their generation for Christ.</p>
                </div>
              </div>
              <div className="vm-card mission-card">
                <div className="vm-icon"><i className="fas fa-bullseye"></i></div>
                <div className="vm-content">
                  <h3>Our Mission</h3>
                  <p>To worship God passionately, preach the Gospel boldly, disciple believers faithfully, and serve our community compassionately in the power of the Holy Spirit.</p>
                </div>
              </div>
              <div className="vm-card values-card">
                <div className="vm-icon"><i className="fas fa-heart"></i></div>
                <div className="vm-content">
                  <h3>Our Values</h3>
                  <p>Spirit-led Worship, Biblical Truth, Fervent Prayer, Genuine Love, Community Service, and Christ-centered Living guide everything we do.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ministries Section */}
        <section className="ministries-section section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">What We Do</span>
              <h2 className="section-title">Our Choirs & Ministries</h2>
              <p className="section-description">We serve through various ministries and musical groups designed to meet the spiritual and physical needs of people at every stage of life.</p>
            </div>

            {/* Our Choirs Section */}
            <div className="choirs-grid">
              {choirs.map((choir, index) => (
                <div key={choir.id} className={`choir-card ${index === currentChoir ? 'active' : ''}`}>
                  <div className="video-container">
                    {playingChoirId === choir.id ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${choir.videoId}?start=${choir.start}&autoplay=1&playsinline=1`}
                        title={choir.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <button
                        type="button"
                        className="video-thumbnail-trigger"
                        onClick={() => setPlayingChoirId(choir.id)}
                        aria-label={`Play ${choir.title}`}
                        style={{
                          position: 'absolute', inset: 0, width: '100%', height: '100%',
                          border: 0, padding: 0, cursor: 'pointer',
                          backgroundImage: `url(https://img.youtube.com/vi/${choir.videoId}/hqdefault.jpg)`,
                          backgroundSize: 'cover', backgroundPosition: 'center',
                        }}
                      >
                        <span style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.35))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: 'rgba(198,40,40,0.9)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                          }}>
                            <i className="fas fa-play" style={{ fontSize: '22px', marginLeft: '4px' }}></i>
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="choir-info">
                    <h3>{choir.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-nav mobile-only">
              <button className="slider-prev" onClick={prevChoir} aria-label="Previous Choir">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="slider-next" onClick={nextChoir} aria-label="Next Choir">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <a
                href="https://www.youtube.com/@savedbychriststainedbylove?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '12px 28px', borderRadius: '9999px',
                  background: '#FF0000', color: '#fff',
                  fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,0,0,0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(255,0,0,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,0,0,0.3)'; }}
              >
                <i className="fab fa-youtube" style={{ fontSize: '1.3rem' }}></i>
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </section>


        {/* Activities & Programs Section */}
        <section className="events-section section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Past & Present</span>
              <h2 className="section-title">Activities and Programs</h2>
              <p className="section-description">Showcasing the mighty work of God through our various church activities and spiritual programs.</p>
            </div>

            <div className="activities-slider">
              {activities.map((activity, index) => (
                <div key={activity.id} className={`activity-card ${index === currentActivity ? 'active' : ''}`}>
                  <div className="activity-poster">
                    <img src={activity.poster} alt={activity.title} />
                  </div>
                  <div className="activity-info">
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <ul className="activity-details">
                      {activity.details.map((detail, dIndex) => (
                        <li key={dIndex}>
                          <i className={detail.icon}></i> <strong>{detail.label}:</strong> {detail.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-nav mobile-only">
              <button className="slider-prev" onClick={prevActivity} aria-label="Previous Activity">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="slider-next" onClick={nextActivity} aria-label="Next Activity">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Testimonies</span>
              <h2 className="section-title">Lives Transformed</h2>
            </div>
            <div className="testimonials-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}>
                  <div className="testimonial-content">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p>"{testimonial.quote}"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                        {testimonial.author.trim().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.author}</h4>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="slider-nav mobile-only">
                <button className="slider-prev" onClick={prevTestimonial} aria-label="Previous Testimonial">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="slider-next" onClick={nextTestimonial} aria-label="Next Testimonial">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Partner With Us In Reaching The Lost</h2>
              <p>Your prayers and generous giving enable us to continue spreading the Gospel and transforming lives.</p>

              <div className="mpesa-till-container">
                <div className="mpesa-header">
                  <span className="lipa-na">LIPA NA</span>
                  <span className="mpesa-text">M-PESA</span>
                </div>
                <div className="till-number">
                  <span className="till-label">TILL NUMBER:</span>
                  <span className="number">5173289</span>
                </div>
              </div>

              <div className="cta-buttons">
                <Link to="/recomendations" className="btn btn-primary">Enquire or Contact Us</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Location Map Section */}
        <section className="map-section">
          <iframe
            src="https://maps.google.com/maps?q=Rikuruma%20Pentecostal%20Church,%20Magwagwa,%20Nyamira%20County&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rikuruma Pentecostal Church Location"
          ></iframe>
        </section>

      </div>
    </div>
  );
};

export default LandingPageNew;
