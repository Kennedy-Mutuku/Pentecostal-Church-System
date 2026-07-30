import React, { useEffect, useRef } from 'react';
import '../styles/Philosophies.css';

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
    body: 'We believe worship is the heartbeat of the church. True worship flows from a pure heart that has encountered God through Jesus Christ and is guided by the Holy Spirit. Our worship is lively, Spirit-led, and grounded in truth, expressed through prayer, praise, thanksgiving, and obedience.',
    scriptures: [
      { text: 'God is Spirit, and those who worship Him must worship in spirit and truth.', ref: 'John 4:24' },
      { text: 'Let everything that has breath praise the Lord.', ref: 'Psalm 150:6' },
    ],
  },
  {
    number: '03',
    icon: 'fas fa-book-open',
    title: 'Philosophy of the Word',
    body: 'We believe the Bible is the inspired, infallible Word of God: our supreme authority for faith and conduct. All preaching, teaching, and decision-making in our church must align with Scripture, which is profitable for doctrine, correction, and instruction in righteousness.',
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
    body: 'We believe that every believer should grow to become a true disciple of Christ: rooted in the Word, steadfast in prayer, and strong in character. Our discipleship process equips believers to live godly lives, discover their gifts, and serve effectively in the ministry.',
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
    body: 'We believe that holiness is the mark of a true believer. As a Pentecostal church, we are committed to teaching and living out a lifestyle of purity, integrity, and godliness in all aspects of life, both public and private.',
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
    body: 'We believe that God desires His church to grow spiritually, numerically, and in influence. We commit to serving with excellence, accountability, and stewardship, doing all things as unto the Lord and not unto men.',
    scriptures: [
      { text: 'Whatever you do, do it heartily, as to the Lord.', ref: 'Colossians 3:23' },
    ],
  },
];

const PhilosophiesPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Philosophies | RPC Nyamira";
  }, []);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.philosophy-card');
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="philosophies-page">
      <div className="philosophies-hero">
        <div className="philosophies-hero-content">
          <span className="philosophies-eyebrow">Our Core Convictions</span>
          <h1>Our Ministry Philosophy</h1>
          <p>
            The convictions and values that shape everything we do as a church family.
            Discover the principles that guide our faith, worship, and service.
          </p>
        </div>
      </div>

      <div className="philosophies-grid" ref={gridRef}>
        {philosophies.map((p, index) => (
          <div key={index} className="philosophy-card" style={{ transitionDelay: `${(index % 3) * 80}ms` }}>
            <span className="phil-watermark">{p.number}</span>
            <div className="phil-header">
              <div className="phil-icon-wrapper">
                <i className={p.icon}></i>
              </div>
              <div className="phil-meta">
                <span className="phil-num">Philosophy {p.number}</span>
                <h3 className="phil-title">{p.title}</h3>
              </div>
            </div>

            <p className="phil-body">{p.body}</p>

            {p.scriptures.map((s, idx) => (
              <div key={idx} className="phil-quote">
                <i className="fas fa-quote-left"></i>
                <span>"{s.text}"</span>
                <cite>{s.ref}</cite>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhilosophiesPage;
