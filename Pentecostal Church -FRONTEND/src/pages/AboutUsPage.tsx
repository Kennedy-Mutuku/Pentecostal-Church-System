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
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section id="our-history" className="section our-history-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Story</span>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-primary, sans-serif)', fontSize: '2.4rem', color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>History of Rikuruma Pentecostal Church</h2>
          </div>
          <div className="history-content" style={{ display: 'block' }}>
            <div className="history-text" style={{ width: '100%', maxWidth: '100%' }}>
              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>The Beginning</h3>
              <p>
                Rikuruma Pentecostal Church was established in August 2001 after separating from the Kiomanga Pentecostal Assemblies of God (PAG). Under the leadership of Pastor Jack Bolo Omondi, together with a small group of committed believers, the church initially began its fellowship in a home in Rikuruma, Magwagwa, Nyamira County. Although the congregation had separated from PAG, it retained the name Rikuruma Pentecostal Church, a name that continues to identify the ministry today.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Seeking Spiritual Covering</h3>
              <p>
                Following its establishment, the church sought spiritual affiliation since it could not operate independently without recognized oversight. An attempt was made to affiliate with Deliverance Church, and Pastor Arita from Deliverance Church Nyamira visited and ministered to the congregation during this period. However, despite the efforts made, the affiliation was not successful.
              </p>
              <p>
                After consultations with Bishop Dr. Ezekiel Mosago Ndumbi of Kisii Pentecostal Church, Pastor Johnson Oanda was sent to shepherd the congregation. During this period, disagreements arose concerning the church's original property. Some members wished to retain the PAG identity, while others desired to continue under the newly established ministry. These differences eventually led to the loss of the church's original land.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>A New Beginning</h3>
              <p>
                In 2006, through the leadership of Pastor James Mwagi, who served as the resident pastor, the church acquired the land on which it currently stands. This marked a significant milestone in the ministry's history, providing the congregation with a permanent place of worship and renewed hope for future growth.
              </p>
              <p>
                Pastor James Mwagi faithfully led the church until 2012. During his tenure, the congregation constructed a modest iron-sheet sanctuary that became the church's home for worship and ministry.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Growth Under Rev. Kepher Omondi</h3>
              <p>
                In 2013, Rev. Kepher Omondi was appointed by Bishop Dr. Ezekiel Mosago Ndumbi to serve as the resident pastor of Rikuruma Pentecostal Church. Initially, he was reluctant to accept the appointment. The church was located in a rural village in Rikuruma, Nyamira County, a considerable distance from his home in Kisii Town, where he lived with his young family. In addition, he was serving as a civil servant, making the daily commute both demanding and challenging. As it was also his first pastoral assignment as the overall leader of a congregation, the responsibility seemed overwhelming.
              </p>
              <p>
                The congregation, too, was initially hesitant to receive a new and relatively young pastor. Recognizing both the challenges and the potential, Bishop Dr. Ezekiel Mosago Ndumbi encouraged Rev. Kepher to serve for just three months while a more suitable person was sought to take over the ministry.
              </p>
              <p>
                However, God's plans unfolded differently. During those first months of ministry, Rev. Kepher's dedication, humility, and commitment gradually won the confidence of the congregation. Rather than requesting another pastor, the church leadership unanimously expressed their desire for him to continue leading the ministry.
              </p>
              <p>
                In 2014, the church leadership formally wrote to Bishop Dr. Ezekiel Mosago Ndumbi requesting that Rev. Kepher Omondi be confirmed and ordained as the resident pastor. The bishop graciously accepted the request, and in 2015, Rev. Kepher, together with other ministers, was ordained into the office of Reverend at Kisii Pentecostal Church.
              </p>
              <p>
                Following the ordination service, Rikuruma Pentecostal Church held a joyous homecoming and thanksgiving celebration to honor Rev. Kepher. This occasion marked the beginning of a new chapter in the church's history.
              </p>
              <p>
                Under Rev. Kepher's leadership, the church entered a season of remarkable spiritual and physical growth. Despite numerous financial and logistical challenges, he led the congregation with unwavering faith and perseverance. Construction of a permanent sanctuary began during his tenure, reflecting the church's vision of establishing a lasting place of worship for future generations. His ministry has continued to inspire the congregation through steadfast leadership, servant-hearted dedication, and a passion for seeing lives transformed by the Gospel.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>A Ministry of Impact</h3>
              <p>
                Over the years, Rikuruma Pentecostal Church has grown into a vibrant center for worship, discipleship, and community transformation. (A center of excellence)
              </p>
              <p>
                The church has hosted numerous spiritual gatherings, leadership seminars, academic empowerment programs, conferences, crusades, and revival meetings. These events have strengthened believers spiritually while also encouraging academic excellence, financial responsibility, and holistic personal development.
              </p>
              <p>
                The ministry has been privileged to receive guest ministers and worship teams from various parts of Kenya as well as from countries including the United States, Ghana, India, and Tanzania. Many respected servants of God have ministered to the congregation, enriching the church through biblical teaching, evangelism, and missions.
              </p>
              <p>
                The church has also actively participated in evangelistic outreach and mission work, including ministry among university students through missions at institutions such as Kisii University and the University of Nairobi.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Transforming Lives</h3>
              <p>
                By God's grace, Rikuruma Pentecostal Church has witnessed countless testimonies of transformed lives.
              </p>
              <p>
                Many young people who grew up within the church have gone on to graduate from colleges and universities, becoming professionals and servant leaders in society. The church has celebrated numerous Christian marriages, raised families grounded in biblical values, and nurtured generations of believers committed to serving God.
              </p>
              <p>
                Throughout its journey, the church has remained devoted to preaching the Gospel, making disciples, and impacting both the local community and beyond.
              </p>

              <h3 style={{ color: '#E53935', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Looking Ahead</h3>
              <p>
                As the ministry continues to grow, Rikuruma Pentecostal Church remains committed to expanding the Kingdom of God through evangelism, discipleship, leadership development, and compassionate community outreach.
              </p>
              <p>
                Among its future aspirations is strengthening its outreach ministries, including visiting and supporting orphanages and other vulnerable members of society, while continuing to proclaim the Gospel of Jesus Christ with faithfulness and excellence.
              </p>
              <p>
                From humble beginnings in a home fellowship to becoming a thriving congregation in Rikuruma, the story of Rikuruma Pentecostal Church stands as a testimony to God's faithfulness, grace, and unwavering provision throughout every season.
              </p>
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
