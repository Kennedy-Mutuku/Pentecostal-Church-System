import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Departments.css';

const departments = [
  {
    slug: 'trumpet-of-yahweh',
    name: 'Trumpet of Yahweh Choir',
    tag: 'Music & Worship',
    description:
      'The Trumpet of Yahweh Choir is a Spirit-filled ensemble dedicated to ushering the congregation into the presence of God through powerful, anointed praise and worship. They lead the church in corporate worship every Sunday and special services, proclaiming the glory of God through song.',
    photo: null as string | null,
  },
  {
    slug: 'born-to-worship',
    name: 'Born to Worship Choir',
    tag: 'Praise & Worship',
    description:
      'Born to Worship Choir exists to glorify God through contemporary worship music. Their ministry is characterised by heartfelt adoration and a deep commitment to leading people into an encounter with the Living God. They perform at Sunday services, revivals, and special church events.',
    photo: null as string | null,
  },
  {
    slug: 'agape-hearts',
    name: 'Agape Hearts Choir',
    tag: 'Love & Song',
    description:
      'Agape Hearts Choir ministers through songs of love, grace, and redemption. Rooted in the love of Christ, this choir brings warmth and joy to every service. Their music transcends generations, touching hearts and drawing souls closer to God.',
    photo: null as string | null,
  },
  {
    slug: 'agape-voices',
    name: 'Agape Voices',
    tag: 'Voice & Harmony',
    description:
      'Agape Voices is a harmonious vocal group that channels the love of God through rich, blended voices. They bring a unique and captivating sound to the church, ministering in special services, outreach events, and celebrations, lifting the name of Jesus through melodious praise.',
    photo: null as string | null,
  },
  {
    slug: 'sunday-school',
    name: 'Sunday School',
    tag: 'Children & Education',
    description:
      'Sunday School is a vital ministry dedicated to teaching the next generation about the Word of God, biblical values, and a personal relationship with Jesus Christ. Children are nurtured in a fun, safe, and spiritually enriching environment every Sunday morning.',
    photo: null as string | null,
  },
  {
    slug: 'men-fellowship',
    name: 'Men Fellowship',
    tag: "Men's Ministry",
    description:
      'The Men Fellowship brings together the men of Rikuruma Pentecostal Church to encourage spiritual growth, accountability, and brotherhood in Christ. Through Bible study, prayer, and service, the men are equipped to lead their families and communities with godly integrity.',
    photo: null as string | null,
  },
  {
    slug: 'women-fellowship',
    name: 'Women Fellowship',
    tag: "Women's Ministry",
    description:
      'The Women Fellowship is a community of faith-filled women who support, encourage, and empower one another in Christ. They engage in prayer, discipleship, and outreach activities, serving the church and the community with a spirit of love and service.',
    photo: null as string | null,
  },
  {
    slug: 'youths',
    name: 'Youths',
    tag: 'Youth Ministry',
    description:
      "The Youth Department is a dynamic, Spirit-led ministry that exists to disciple young people in their faith, equip them to live out the Gospel, and empower them to impact their generation for Christ. Through worship, Bible study, and fellowship, the youth of RPC are raised to be tomorrow's leaders.",
    photo: null as string | null,
  },
];

const Departments: React.FC = () => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [skipAnimations, setSkipAnimations] = useState(false);
  const location = useLocation();

  // Set title and scroll to top on initial load (no hash)
  useEffect(() => {
    document.title = 'Departments | RPC Nyamira';
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to section whenever hash changes (covers both initial load with hash
  // and clicking dropdown items while already on this page)
  useEffect(() => {
    if (!location.hash) return;
    setSkipAnimations(true);
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [location.hash]);

  useEffect(() => {
    if (skipAnimations) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dept-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [skipAnimations]);

  return (
    <div className="departments-page">
      {/* Hero */}
      <div className="dept-hero">
        <div className="dept-hero-inner">
          <span className="dept-eyebrow">Our Church Family</span>
          <h1>Departments</h1>
          <p>
            Each department is a family within the family — serving God, growing together,
            and impacting our community through the gifts He has placed within us.
          </p>
        </div>
      </div>

      {/* Department sections */}
      <div className="dept-list">
        {departments.map((dept, index) => {
          const isReverse = index % 2 === 1;
          return (
            <React.Fragment key={dept.slug}>
              <section
                id={dept.slug}
                className={`dept-section${isReverse ? ' dept-section--reverse' : ''}${isReverse ? ' dept-section--alt' : ''}${skipAnimations ? ' dept-visible' : ''}`}
                ref={(el) => { sectionRefs.current[index] = el; }}
              >
                {/* Photo side */}
                <div className="dept-media">
                  {dept.photo ? (
                    <img src={dept.photo} alt={dept.name} className="dept-img" />
                  ) : (
                    <div className="dept-photo-placeholder">
                      <div className="dept-placeholder-inner">
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Photo coming soon</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text side */}
                <div className="dept-body">
                  <h2 className="dept-name">{dept.name}</h2>
                  <div className="dept-rule" />
                  <p className="dept-desc">{dept.description}</p>
                </div>
              </section>

              {index < departments.length - 1 && (
                <div className="dept-divider" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
