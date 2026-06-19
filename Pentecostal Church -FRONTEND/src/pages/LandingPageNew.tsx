import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/landing';
import LiveAttendanceBanner from '../components/landing/LiveAttendanceBanner';
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
  videoUrl: string;
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
      videoUrl: "https://www.youtube.com/embed/O9QnigyLpKY?si=Qel0bhomgbV2vD4-&start=12&autoplay=1&mute=1&playsinline=1"
    },
    {
      id: 2,
      title: "2. Agape Hearts Singers",
      videoUrl: "https://www.youtube.com/embed/y7yKev9NPYI?si=1BkELlcqMarSchT1&start=10&playsinline=1"
    },
    {
      id: 3,
      title: "3. Trumpet of Yahweh Choir",
      videoUrl: "https://www.youtube.com/embed/AaiI4I7-Bmw?si=z0t0kaagwnKeDW-t&start=12&playsinline=1"
    }
  ];

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
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>

        {/* Live Attendance Sessions — appears only when sessions are active */}
        <LiveAttendanceBanner />

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
                <div className="about-features">
                  <div className="feature">
                    <i className="fas fa-bible"></i>
                    <span>Bible-Based Teaching</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-hands-praying"></i>
                    <span>Prayer Focused</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-users"></i>
                    <span>Community Driven</span>
                  </div>
                </div>
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
                <h3>Our Vision</h3>
                <p>To be a Spirit-empowered church that transforms Nyamira and beyond through the Gospel, raising up disciples who impact their generation for Christ.</p>
              </div>
              <div className="vm-card mission-card">
                <h3>Our Mission</h3>
                <p>To worship God passionately, preach the Gospel boldly, disciple believers faithfully, and serve our community compassionately in the power of the Holy Spirit.</p>
              </div>
              <div className="vm-card values-card">
                <h3>Our Values</h3>
                <p>Spirit-led Worship, Biblical Truth, Fervent Prayer, Genuine Love, Community Service, and Christ-centered Living guide everything we do.</p>
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
                    <iframe
                      src={choir.videoUrl}
                      title={choir.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="choir-info">
                    <h3>{choir.title}</h3>
                  </div>
                </div>
              ))}
              <div className="slider-nav mobile-only">
                <button className="slider-prev" onClick={prevChoir} aria-label="Previous Choir">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="slider-next" onClick={nextChoir} aria-label="Next Choir">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
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
                    <span className={`activity-status ${activity.statusClass}`}>{activity.status}</span>
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
              <div className="slider-nav mobile-only">
                <button className="slider-prev" onClick={prevActivity} aria-label="Previous Activity">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="slider-next" onClick={nextActivity} aria-label="Next Activity">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
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
                      <i className="fas fa-user"></i>
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


      </div>
    </div>
  );
};

export default LandingPageNew;
