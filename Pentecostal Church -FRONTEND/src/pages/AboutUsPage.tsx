// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/aboutUsPage.css';

interface Scripture {
  text: string;
  ref: string;
}

interface Philosophy {
  number: string;
  icon: string;
  title: string;
  body: string;
  scriptures: Scripture[];
}

const philosophies: Philosophy[] = [
  {
    number: '01',
    icon: 'fas fa-cross',
    title: 'Philosophy of Ministry',
    body: 'Rikuruma Pentecostal Church exists to glorify God and advance His Kingdom by preaching the gospel of Jesus Christ, nurturing believers into spiritual maturity, and empowering them to serve under the anointing of the Holy Spirit. We believe that every believer is called, gifted, and commissioned to make a difference for Christ in their home, community, and generation.',
    scriptures: [
      { text: 'Go therefore and make disciples of all nations…', ref: 'Matthew 28:19–20' },
      { text: '"Not by might nor by power, but by My Spirit," says the Lord of hosts.', ref: 'Zechariah 4:6' },
    ],
  },
  {
    number: '02',
    icon: 'fas fa-music',
    title: 'Philosophy of Worship',
    body: 'We believe worship is the heartbeat of the church. True worship flows from a pure heart that has encountered God through Jesus Christ and is guided by the Holy Spirit. Our worship is lively, Spirit-led, and grounded in truth — expressed through prayer, praise, thanksgiving, and obedience.',
    scriptures: [
      { text: 'God is Spirit, and those who worship Him must worship in spirit and truth.', ref: 'John 4:24' },
      { text: 'Let everything that has breath praise the Lord.', ref: 'Psalm 150:6' },
    ],
  },
  {
    number: '03',
    icon: 'fas fa-book-open',
    title: 'Philosophy of the Word',
    body: 'We believe the Bible is the inspired, infallible Word of God — our supreme authority for faith and conduct. All preaching, teaching, and decision-making in our church must align with Scripture, which is profitable for doctrine, correction, and instruction in righteousness.',
    scriptures: [
      { text: 'All Scripture is given by inspiration of God…', ref: '2 Timothy 3:16' },
    ],
  },
  {
    number: '04',
    icon: 'fas fa-hands',
    title: 'Philosophy of Prayer',
    body: 'We believe that prayer is the power that sustains the church and connects us to the will of God. As a praying church, we hold regular prayer meetings and encourage every member to live a life of intercession, thanksgiving, and dependence on God.',
    scriptures: [
      { text: 'Men ought always to pray, and not faint.', ref: 'Luke 18:1' },
      { text: 'The effective, fervent prayer of a righteous man avails much.', ref: 'James 5:16' },
    ],
  },
  {
    number: '05',
    icon: 'fas fa-fire',
    title: 'Philosophy of the Holy Spirit',
    body: 'We believe in the baptism of the Holy Spirit with the evidence of speaking in tongues, and in the continual manifestation of spiritual gifts within the church. The Holy Spirit empowers believers to witness, live holy lives, and serve effectively in the body of Christ.',
    scriptures: [
      { text: 'You shall receive power when the Holy Spirit has come upon you.', ref: 'Acts 1:8' },
    ],
  },
  {
    number: '06',
    icon: 'fas fa-user-tie',
    title: 'Philosophy of Leadership',
    body: 'We believe that leadership is a divine calling to serve, not to rule. Our leaders must model humility, integrity, faithfulness, and spiritual maturity. Every decision and direction taken by leadership should be guided by prayer, wisdom, and the Word of God.',
    scriptures: [
      { text: 'Whoever wants to become great among you must be your servant.', ref: 'Matthew 20:26' },
    ],
  },
  {
    number: '07',
    icon: 'fas fa-seedling',
    title: 'Philosophy of Discipleship',
    body: 'We believe that every believer should grow to become a true disciple of Christ — rooted in the Word, steadfast in prayer, and strong in character. Our discipleship process equips believers to live godly lives, discover their gifts, and serve effectively in the ministry.',
    scriptures: [
      { text: 'As you have therefore received Christ Jesus the Lord, so walk in Him.', ref: 'Colossians 2:6' },
    ],
  },
  {
    number: '08',
    icon: 'fas fa-globe',
    title: 'Philosophy of Evangelism & Mission',
    body: 'We believe that the Great Commission is the heartbeat of the church. We are called to reach the lost with the gospel, both locally and beyond, through preaching, personal witness, and acts of love. Our church exists not only to gather believers but also to send them into the world as light and ambassadors of Christ.',
    scriptures: [
      { text: 'The Son of Man came to seek and to save the lost.', ref: 'Luke 19:10' },
    ],
  },
  {
    number: '09',
    icon: 'fas fa-users',
    title: 'Philosophy of Fellowship & Unity',
    body: 'We believe that the church is one body under Christ. We value love, unity, forgiveness, and mutual care among believers. The church must be a family where everyone feels accepted, encouraged, and supported in their walk with God.',
    scriptures: [
      { text: 'How good and pleasant it is when brethren dwell together in unity.', ref: 'Psalm 133:1' },
    ],
  },
  {
    number: '10',
    icon: 'fas fa-shield-halved',
    title: 'Philosophy of Holiness & Integrity',
    body: 'We believe that holiness is the mark of a true believer. As a Pentecostal church, we are committed to teaching and living out a lifestyle of purity, integrity, and godliness in all aspects of life — both public and private.',
    scriptures: [
      { text: 'Be holy, for I am holy.', ref: '1 Peter 1:16' },
    ],
  },
  {
    number: '11',
    icon: 'fas fa-hand-holding-heart',
    title: 'Philosophy of Service',
    body: 'We believe that ministry is not for a few but for all. Every believer has been given gifts to serve in the church and in the world. We encourage active involvement in ministry, outreach, and acts of compassion as an expression of love for God and others.',
    scriptures: [
      { text: 'Each of you should use whatever gift you have received to serve others.', ref: '1 Peter 4:10' },
    ],
  },
  {
    number: '12',
    icon: 'fas fa-city',
    title: 'Philosophy of Community Transformation',
    body: 'We believe the church must impact its community through love, compassion, and service. Rikuruma Pentecostal Church seeks to bring hope to the hopeless, help to the needy, and light to the dark corners of our society. Our goal is to see spiritual revival that brings social, moral, and economic transformation in Magwagwa and beyond.',
    scriptures: [
      { text: 'You are the light of the world. A city set on a hill cannot be hidden.', ref: 'Matthew 5:14' },
    ],
  },
  {
    number: '13',
    icon: 'fas fa-trophy',
    title: 'Philosophy of Growth & Excellence',
    body: 'We believe that God desires His church to grow spiritually, numerically, and in influence. We commit to serving with excellence, accountability, and stewardship — doing all things as unto the Lord and not unto men.',
    scriptures: [
      { text: 'Whatever you do, do it heartily, as to the Lord.', ref: 'Colossians 3:23' },
    ],
  },
];

const AboutUsPage = () => {
  const [openCard, setOpenCard] = useState<number | null>(null);
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
      
      // Expand card if it's a philosophy card and matches the hash
      if (hash === '#philosophy') {
        // Automatically open the first philosophy card or show philosophy list
        setOpenCard(0);
      }
      
      const headerEl = document.querySelector('.main-header-wrapper');
      const headerH = headerEl ? (headerEl as HTMLElement).offsetHeight : 100;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(timer);
  }, [location]);

  const toggle = (i: number) => setOpenCard(openCard === i ? null : i);

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

      {/* Philosophy of Ministry */}
      <section id="philosophy" className="section philosophy-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">How We Function</span>
            <h2 className="section-title">Our Ministry Philosophy</h2>
            <p className="section-description">
              The convictions and values that shape everything we do as a church family.
            </p>
          </div>
          <div className="philosophy-grid">
            {philosophies.map((p, i) => (
              <div
                key={i}
                className={`phil-card${openCard === i ? ' phil-card--open' : ''}`}
                onClick={() => toggle(i)}
              >
                <div className="phil-card-header">
                  <div className="phil-card-icon">
                    <i className={p.icon}></i>
                  </div>
                  <div className="phil-card-meta">
                    <span className="phil-number">{p.number}</span>
                    <h3 className="phil-title">{p.title}</h3>
                  </div>
                  <i className="fas fa-chevron-down phil-chevron"></i>
                </div>
                <div className="phil-card-body">
                  <p>{p.body}</p>
                  {p.scriptures.map((s, j) => (
                    <blockquote key={j} className="phil-scripture">
                      <i className="fas fa-quote-left"></i>
                      <span>"{s.text}"</span>
                      <cite>— {s.ref}</cite>
                    </blockquote>
                  ))}
                </div>
              </div>
            ))}
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
