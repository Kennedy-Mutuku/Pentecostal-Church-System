// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/aboutUsPage.css';


const AboutUsPage = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      
      const headerEl = document.querySelector('.main-header-wrapper');
      const headerH = headerEl ? (headerEl as HTMLElement).offsetHeight : 100;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(timer);
  }, [location]);


  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>About Us</span>
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <section id="who-we-are" className="section about-who-section">
        <div className="container">
          <div className="about-who-grid">
            <div className="about-who-text">
              <span className="section-subtitle">Who We Are</span>
              <h2 className="section-title">Our Identity in Christ</h2>
              <p className="lead">
                Rikuruma Pentecostal Church is a Christ-centered, Bible-believing,
                Spirit-filled church located in Magwagwa, Nyamira County.
              </p>
              <p>
                Our passion is to raise a Spirit-empowered generation that loves God,
                lives by His Word, and transforms families and communities for the glory
                of Jesus Christ.
              </p>
              <p>
                We are committed to building strong believers, nurturing godly families,
                and advancing the Kingdom of God through the power of the Holy Spirit.
              </p>
              <blockquote className="about-scripture">
                <i className="fas fa-quote-left"></i>
                <span>For no other foundation can anyone lay than that which is laid, which is Jesus Christ.</span>
                <cite>— 1 Corinthians 3:11</cite>
              </blockquote>
              <div className="location-badge">
                <i className="fas fa-map-marker-alt"></i>
                <span>Magwagwa, Nyamira County, Kenya</span>
              </div>
            </div>
            <div className="about-who-image">
              <img src="/images/about-church.jpg" alt="Rikuruma Pentecostal Church congregation" />
              <div className="about-image-badge">
                <i className="fas fa-cross"></i>
                <span>Est. Magwagwa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section id="our-history" className="section our-history-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Story</span>
            <h2 className="section-title">Our History</h2>
          </div>
          <div className="history-content">
            <div className="history-text">
              <p>
                Rikuruma Pentecostal Church was founded in Magwagwa, Nyamira County, with a burning
                vision to plant a Spirit-filled congregation that would bring the Gospel of Jesus
                Christ to the community and beyond.
              </p>
              <p>
                From humble beginnings — a small gathering of faithful believers — the church has
                grown into a vibrant community of worshippers, intercessors, and disciples. Through
                every season, God's faithfulness has been our testimony.
              </p>
              <p>
                Today, Rikuruma Pentecostal Church stands as a beacon of hope in Nyamira County,
                committed to preaching the unadulterated Word of God, empowering believers through
                the Holy Spirit, and transforming lives for the glory of Jesus Christ.
              </p>
              <blockquote className="about-scripture">
                <i className="fas fa-quote-left"></i>
                <span>The Lord has done great things for us, and we are filled with joy.</span>
                <cite>— Psalm 126:3</cite>
              </blockquote>
            </div>
            <div className="history-milestones">
              <div className="milestone">
                <div className="milestone-icon"><i className="fas fa-flag"></i></div>
                <div className="milestone-text">
                  <h4>Church Founded</h4>
                  <p>Established in Magwagwa with a core group of believers passionate about God's Kingdom.</p>
                </div>
              </div>
              <div className="milestone">
                <div className="milestone-icon"><i className="fas fa-users"></i></div>
                <div className="milestone-text">
                  <h4>Growing Congregation</h4>
                  <p>The church grew steadily as God added to its numbers — families, youth, and children.</p>
                </div>
              </div>
              <div className="milestone">
                <div className="milestone-icon"><i className="fas fa-globe"></i></div>
                <div className="milestone-text">
                  <h4>Community Impact</h4>
                  <p>Expanded outreach ministries reaching the needy, the lost, and the surrounding communities.</p>
                </div>
              </div>
              <div className="milestone">
                <div className="milestone-icon"><i className="fas fa-star"></i></div>
                <div className="milestone-text">
                  <h4>Continuing the Vision</h4>
                  <p>Today we press forward with greater faith, excellence, and devotion to the call of God.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="section vm-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Direction</span>
            <h2 className="section-title">Vision &amp; Mission</h2>
          </div>
          <div className="vm-grid">
            <div className="vm-box">
              <div className="vm-icon"><i className="fas fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>To be a Spirit-empowered church that transforms Nyamira and beyond through the Gospel, raising up disciples who impact their generation for Christ.</p>
            </div>
            <div className="vm-box">
              <div className="vm-icon"><i className="fas fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>To worship God passionately, preach the Gospel boldly, disciple believers faithfully, and serve our community compassionately in the power of the Holy Spirit.</p>
            </div>
            <div className="vm-box">
              <div className="vm-icon"><i className="fas fa-anchor"></i></div>
              <h3>Our Foundation</h3>
              <p>The Lord Jesus Christ — the same yesterday, today, and forever. Every ministry, teaching, and decision is anchored in His Word and led by His Spirit.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Statement of Faith */}
      <section id="statement-of-faith" className="section faith-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What We Believe</span>
            <h2 className="section-title">Fundamental Truths</h2>
          </div>
          <div className="faith-grid">
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-book-open"></i></div>
              <h4>The Word of God</h4>
              <p>We believe the Bible is the inspired and only infallible and authoritative Word of God.</p>
            </div>
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-infinity"></i></div>
              <h4>The Holy Trinity</h4>
              <p>We believe that there is one God, existent in three persons: Father, Son and Holy Spirit.</p>
            </div>
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-heart"></i></div>
              <h4>Salvation</h4>
              <p>We believe that for the salvation of lost and sinful people, regeneration by the Holy Spirit is absolutely essential.</p>
            </div>
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-fire"></i></div>
              <h4>Baptism of the Spirit</h4>
              <p>We believe in the baptism of the Holy Spirit with the evidence of speaking in other tongues.</p>
            </div>
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-water"></i></div>
              <h4>Water Baptism</h4>
              <p>We believe in baptism by full immersion in water as an outward sign of an inward transformation.</p>
            </div>
            <div className="faith-item">
              <div className="faith-icon"><i className="fas fa-cloud-sun"></i></div>
              <h4>The Second Coming</h4>
              <p>We believe in the personal, imminent return of Jesus Christ for His church and His glorious reign on earth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Banner */}
      <section className="commitment-section">
        <div className="container">
          <div className="commitment-inner">
            <div className="commitment-icon"><i className="fas fa-cross"></i></div>
            <h2>Our Commitment</h2>
            <p>
              As Rikuruma Pentecostal Church, we commit ourselves to remain faithful to
              God's Word, sensitive to the Holy Spirit, and steadfast in fulfilling our
              divine assignment. We will continue to build a loving, prayerful, Spirit-led
              church that transforms lives and glorifies Jesus Christ in all things.
            </p>
            <blockquote>
              "To Him be glory in the church by Christ Jesus to all generations, forever and ever. Amen."
              <cite>— Ephesians 3:21</cite>
            </blockquote>
            <Link to="/recomendations" className="btn btn-secondary">Get Involved</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
