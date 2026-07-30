import React, { useEffect, useState } from 'react';
import '../styles/Handbook.css';

interface DeptSection {
  heading: string;
  items: string[];
}

interface Department {
  num: string;
  icon: string;
  title: string;
  theme?: string;
  purpose: string;
  sections: DeptSection[];
  outcomes: string[];
}

const departments: Department[] = [
  {
    num: '01',
    icon: 'fas fa-child',
    title: 'Youth Department',
    theme: 'Raising a Generation: Saved, Grounded, and Sent',
    purpose: 'To disciple, mentor, and develop children, teenagers, and young adults into committed followers of Christ.',
    sections: [
      {
        heading: 'Training Modules',
        items: [
          'Salvation & Spiritual Growth',
          'Identity & Purpose in Christ',
          'Leadership & Responsibility',
          'Navigating Modern Challenges',
          'Youth Evangelism & Outreach',
        ],
      },
    ],
    outcomes: [
      'Spiritually grounded youth',
      'Emerging young leaders',
      'Increased youth involvement in ministry',
      'Strong retention within the church',
    ],
  },
  {
    num: '02',
    icon: 'fas fa-music',
    title: 'Music & Worship Department',
    theme: 'Worship in Spirit and in Truth',
    purpose: 'To cultivate a Spirit-led worship culture that glorifies God and supports the preaching of the Word.',
    sections: [
      {
        heading: 'Training Modules',
        items: [
          'Theology of Worship',
          'Excellence in Music Ministry',
          'Spiritual Discipline for Musicians',
          'Choir & Praise Team Structure',
          'Leading Congregational Worship',
        ],
      },
      {
        heading: 'Practical Training',
        items: [
          'Rehearsal systems',
          'Vocal development',
          'Band coordination',
          'Service flow management',
        ],
      },
      {
        heading: "Media & Communications Unit (operates within this department)",
        items: [
          'Oversee sound systems and projection',
          'Manage church social media platforms',
          'Coordinate live streaming and recordings',
          'Handle church publicity and announcements',
          'Maintain media equipment and digital archives',
        ],
      },
    ],
    outcomes: [
      'Unified worship culture',
      'Skilled and spiritually mature musicians',
      'Orderly and powerful services',
      'Technically excellent, well-communicated services with strong online presence',
    ],
  },
  {
    num: '03',
    icon: 'fas fa-book-open',
    title: 'Sunday School / Christian Education',
    theme: 'Rooted in the Word',
    purpose: 'To provide systematic biblical teaching that establishes believers in sound doctrine and holy living.',
    sections: [
      {
        heading: 'Training Modules',
        items: [
          'Biblical Foundations',
          'Pentecostal Doctrine',
          'Teaching Methods',
          'Age-Appropriate Curriculum Development',
          'Discipleship Systems',
        ],
      },
    ],
    outcomes: [
      'Biblically literate members',
      'Trained teachers',
      'Doctrinal stability',
      'Strong discipleship culture',
    ],
  },
  {
    num: '04',
    icon: 'fas fa-globe',
    title: 'Evangelism & Outreach Department',
    theme: 'Winning Souls. Building the Kingdom.',
    purpose: 'To lead the church in soul-winning, community impact, and church expansion.',
    sections: [
      {
        heading: 'Training Modules',
        items: [
          'The Great Commission',
          'Personal Evangelism',
          'Community Outreach Strategies',
          'Follow-Up & Discipleship',
          'Cell Group Development',
        ],
      },
      {
        heading: 'Field Work',
        items: [
          'Community prayer walks',
          'Revival services',
          'Door-to-door outreach',
          'School and youth outreach',
        ],
      },
    ],
    outcomes: [
      'Increased conversions',
      'Church growth',
      'New outreach centers / cell groups',
      'Strong follow-up system',
    ],
  },
  {
    num: '05',
    icon: 'fas fa-venus',
    title: "Women's Ministry",
    theme: 'Women of Prayer, Power, and Purpose',
    purpose: 'To empower women in spiritual growth, leadership, family influence, and community transformation.',
    sections: [
      {
        heading: 'Training Modules',
        items: [
          'Spiritual Formation',
          'Holiness & Lifestyle',
          'Leadership Development',
          'Family & Community Impact',
          'Intercession & Prayer Leadership',
        ],
      },
    ],
    outcomes: [
      'Strong prayer movement',
      'Developed women leaders',
      'Active community influence',
      'Support system for families',
    ],
  },
  {
    num: '06',
    icon: 'fas fa-user-plus',
    title: 'New Membership & Assimilation Department',
    purpose: 'To ensure every new believer and new member is properly received, discipled, documented, and integrated into the life of the church.',
    sections: [
      {
        heading: 'Responsibilities',
        items: [
          'Conduct new membership classes and orientation',
          'Maintain accurate membership records',
          'Facilitate baptism and foundational teaching',
          'Assign spiritual mentors',
          'Integrate new members into departments and cell groups',
        ],
      },
    ],
    outcomes: [
      'Strong retention of new members',
      'Smooth integration into church life',
      'Clear membership accountability',
      'Spiritually grounded believers',
    ],
  },
  {
    num: '07',
    icon: 'fas fa-hand-holding-heart',
    title: 'Welfare & Benevolence Department',
    purpose: "To demonstrate Christ's love through structured care and support for members and the community.",
    sections: [
      {
        heading: 'Responsibilities',
        items: [
          'Coordinate support for members in crisis',
          'Organize hospital visitation',
          'Provide bereavement support',
          'Manage benevolence fund (under financial policy)',
          'Coordinate community compassion initiatives',
        ],
      },
    ],
    outcomes: [
      'Strong unity among members',
      'Practical demonstration of love',
      'Structured crisis response',
      'Community trust and testimony',
    ],
  },
  {
    num: '08',
    icon: 'fas fa-gavel',
    title: 'Disciplinary & Ethics Committee',
    purpose: 'To uphold biblical standards of conduct while promoting restoration, reconciliation, and spiritual integrity.',
    sections: [
      {
        heading: 'Authority',
        items: ['Operates under the Church Council'],
      },
      {
        heading: 'Responsibilities',
        items: [
          'Address misconduct biblically (Matthew 18 principle)',
          'Mediate conflicts within leadership and membership',
          'Ensure ethical accountability',
          'Recommend corrective or restorative measures',
          'Protect unity and spiritual health',
        ],
      },
      {
        heading: 'Guiding Principles',
        items: [
          'Restoration over punishment',
          'Confidentiality and integrity',
          'Fair hearing and biblical justice',
          'Protection of church witness',
        ],
      },
    ],
    outcomes: [],
  },
];

const tocItems = [
  { id: 'introduction', label: 'I. Introduction' },
  { id: 'governance', label: 'II. Governance & Leadership' },
  { id: 'responsibilities', label: 'III. Core Responsibilities' },
  { id: 'departments', label: 'IV. Departmental Framework' },
  { id: 'training', label: 'V. Training Model' },
  { id: 'accountability', label: 'VI. Accountability System' },
  { id: 'objectives', label: 'VII. Strategic Objectives' },
  { id: 'declaration', label: 'VIII. Our Declaration' },
];

const HandbookPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(tocItems[0].id);
  const [openDept, setOpenDept] = useState<string | null>(departments[0].num);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Church Handbook | RPC Nyamira';
  }, []);

  useEffect(() => {
    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleDept = (num: string) => {
    setOpenDept((current) => (current === num ? null : num));
  };

  return (
    <div className="handbook-page">
      <div className="handbook-hero">
        <div className="handbook-hero-content">
          <span className="handbook-eyebrow">Reaching Nations With The Gospel Of Jesus Christ &mdash; Matthew 28:19&ndash;20</span>
          <h1>Rikuruma Church Handbook</h1>
        </div>
      </div>

      <nav className="handbook-toc" aria-label="Handbook sections">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`handbook-toc-link${activeSection === item.id ? ' active' : ''}`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="handbook-body">
        <section id="introduction" className="handbook-section">
          <h2 className="handbook-section-title">I. Introduction: The Mandate Before Us</h2>
          <p>To the leaders, workers, and members of Rikuruma Pentecostal Church,</p>
          <p>Grace and peace be unto you.</p>
          <p>
            I am writing this to you not as one holding a title, but as one carrying a divine assignment. The role
            of a Senior Pastor is not ceremonial; it is structural, spiritual, and strategic. God has entrusted us
            with more than a congregation. He has entrusted us with a calling, a community, and a commission.
            As a local church positioned in this generation, we must not only grow numerically but grow
            structurally, spiritually, and strategically.
          </p>
          <div className="handbook-quote">
            <i className="fas fa-quote-left"></i>
            <span>"And I will give you shepherds after mine heart, which shall feed you with knowledge and understanding."</span>
            <cite>&mdash; Jeremiah 3:15</cite>
          </div>
          <p>
            To feed with knowledge and understanding requires intentional systems, structured leadership,
            accountability, and continuous training.
          </p>
          <p>
            This document establishes the leadership framework, departmental structure, and strategic direction
            for Rikuruma Pentecostal Church as we prepare for sustainable growth and Kingdom impact.
          </p>
        </section>

        <section id="governance" className="handbook-section">
          <h2 className="handbook-section-title">II. Governance & Leadership Structure</h2>

          <div className="handbook-card">
            <div className="handbook-card-header">
              <div className="handbook-icon"><i className="fas fa-cross"></i></div>
              <div>
                <h3>1. Executive Leadership</h3>
                <p className="handbook-card-subtitle">Senior Pastor: Rev. Omondi Kepher</p>
              </div>
            </div>
            <p className="handbook-card-label">Primary Responsibilities</p>
            <ul className="handbook-list">
              <li>Spiritual oversight</li>
              <li>Vision casting</li>
              <li>Doctrinal integrity</li>
              <li>Leadership development</li>
              <li>Strategic direction</li>
            </ul>
          </div>

          <div className="handbook-card">
            <div className="handbook-card-header">
              <div className="handbook-icon"><i className="fas fa-users-cog"></i></div>
              <h3>2. Church Council / Board</h3>
            </div>
            <p className="handbook-card-label">Purpose</p>
            <ul className="handbook-list">
              <li>Provide administrative oversight</li>
              <li>Ensure financial accountability</li>
              <li>Support pastoral vision</li>
              <li>Strengthen governance systems</li>
            </ul>
          </div>

          <div className="handbook-card">
            <div className="handbook-card-header">
              <div className="handbook-icon"><i className="fas fa-sitemap"></i></div>
              <h3>3. Ministry Leadership Structure</h3>
            </div>
            <div className="handbook-flow">
              <span>Senior Pastor</span>
              <i className="fas fa-arrow-down"></i>
              <span>Church Council</span>
              <i className="fas fa-arrow-down"></i>
              <span>Department Leaders</span>
              <i className="fas fa-arrow-down"></i>
              <span>Ministry Coordinators</span>
              <i className="fas fa-arrow-down"></i>
              <span>Cell Leaders / Ministry Workers</span>
            </div>
            <p className="handbook-card-label">This structure ensures</p>
            <ul className="handbook-list">
              <li>Clear accountability</li>
              <li>Effective communication</li>
              <li>Orderly growth</li>
              <li>Shared responsibility</li>
            </ul>
          </div>
        </section>

        <section id="responsibilities" className="handbook-section">
          <h2 className="handbook-section-title">III. Core Leadership Responsibilities</h2>
          <p>Every leader at Rikuruma Pentecostal Church carries responsibility in three dimensions:</p>

          <div className="handbook-triad">
            <div className="handbook-triad-card">
              <div className="handbook-icon"><i className="fas fa-praying-hands"></i></div>
              <h3>1. Spiritual Responsibility</h3>
              <ul className="handbook-list">
                <li>Maintain personal holiness</li>
                <li>Model Christ-like character</li>
                <li>Protect doctrinal soundness</li>
                <li>Shepherd people faithfully</li>
              </ul>
            </div>
            <div className="handbook-triad-card">
              <div className="handbook-icon"><i className="fas fa-chalkboard-teacher"></i></div>
              <h3>2. Developmental Responsibility</h3>
              <ul className="handbook-list">
                <li>Train upcoming leaders</li>
                <li>Mentor younger believers</li>
                <li>Equip ministry workers</li>
                <li>Multiply leadership capacity</li>
              </ul>
            </div>
            <div className="handbook-triad-card">
              <div className="handbook-icon"><i className="fas fa-chess"></i></div>
              <h3>3. Strategic Responsibility</h3>
              <ul className="handbook-list">
                <li>Expand outreach efforts</li>
                <li>Strengthen departments</li>
                <li>Increase evangelism impact</li>
                <li>Ensure sustainability of ministry</li>
              </ul>
            </div>
          </div>

          <p className="handbook-tagline-text">
            Calling without training leads to instability.<br />
            Calling with structure produces lasting fruit.
          </p>
        </section>

        <section id="departments" className="handbook-section">
          <h2 className="handbook-section-title">IV. Departmental Framework</h2>
          <p>Each department operates under:</p>
          <ul className="handbook-list handbook-list-inline">
            <li>Spiritual accountability</li>
            <li>Operational excellence</li>
            <li>Leadership development</li>
            <li>Measurable Kingdom impact</li>
          </ul>
          <p className="handbook-dept-hint">Tap a department below to view its training modules and expected outcomes.</p>

          <div className="handbook-dept-accordion">
            {departments.map((d) => {
              const isOpen = openDept === d.num;
              return (
                <div key={d.num} className={`handbook-dept-card${isOpen ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="dept-header"
                    onClick={() => toggleDept(d.num)}
                    aria-expanded={isOpen}
                  >
                    <div className="dept-icon-wrapper">
                      <i className={d.icon}></i>
                    </div>
                    <div className="dept-meta">
                      <span className="dept-num">Department {d.num}</span>
                      <h3 className="dept-title">{d.title}</h3>
                      {d.theme && <p className="dept-theme">"{d.theme}"</p>}
                    </div>
                    <i className="fas fa-chevron-down dept-chevron"></i>
                  </button>

                  <div className="dept-body">
                    <div className="dept-body-inner">
                      <p className="dept-purpose">{d.purpose}</p>

                      {d.sections.map((s, i) => (
                        <div key={i} className="dept-subsection">
                          <p className="dept-subheading">{s.heading}</p>
                          <ul className="handbook-list">
                            {s.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {d.outcomes.length > 0 && (
                        <div className="dept-outcomes">
                          <p className="dept-subheading">Expected Outcomes</p>
                          <ul className="handbook-list handbook-list-check">
                            {d.outcomes.map((o, idx) => (
                              <li key={idx}>{o}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="training" className="handbook-section">
          <h2 className="handbook-section-title">V. Training Model</h2>
          <p className="handbook-card-label">"RPC Leadership Development Model": Annual Structure</p>
          <ul className="handbook-list">
            <li>Quarterly Leadership Trainings</li>
            <li>Monthly Department Meetings</li>
            <li>Annual Leadership Summit</li>
            <li>Continuous Local Implementation</li>
          </ul>
          <p className="handbook-card-label">The Annual Leadership Summit will</p>
          <ul className="handbook-list">
            <li>Cast vision</li>
            <li>Evaluate progress</li>
            <li>Train leaders</li>
            <li>Strengthen unity</li>
          </ul>
        </section>

        <section id="accountability" className="handbook-section">
          <h2 className="handbook-section-title">VI. Performance & Accountability System</h2>
          <p>Each department shall report:</p>
          <div className="handbook-triad">
            <div className="handbook-triad-card">
              <h3>Monthly</h3>
              <ul className="handbook-list">
                <li>Activities conducted</li>
                <li>Attendance</li>
                <li>Trainings held</li>
                <li>Challenges faced</li>
              </ul>
            </div>
            <div className="handbook-triad-card">
              <h3>Quarterly</h3>
              <ul className="handbook-list">
                <li>Growth indicators</li>
                <li>Leadership development progress</li>
                <li>Evangelism impact</li>
              </ul>
            </div>
            <div className="handbook-triad-card">
              <h3>Annually</h3>
              <ul className="handbook-list">
                <li>Impact report</li>
                <li>Expansion goals</li>
                <li>Strategic plans for the coming year</li>
              </ul>
            </div>
          </div>
          <p className="handbook-tagline-text">
            Accountability preserves integrity.<br />
            Integrity sustains growth.
          </p>
        </section>

        <section id="objectives" className="handbook-section">
          <h2 className="handbook-section-title">VII. Strategic Objectives (2026&ndash;2030)</h2>
          <ol className="handbook-list handbook-list-numbered">
            <li>Train 50+ ministry leaders</li>
            <li>Establish fully functioning departments</li>
            <li>Launch at least 3 active cell groups</li>
            <li>Increase youth participation by 60%</li>
            <li>Strengthen financial and administrative systems</li>
            <li>Develop a leadership pipeline for future pastors and missionaries</li>
            <li>Expand outreach impact across Nyamira County</li>
          </ol>
        </section>

        <section id="declaration" className="handbook-section handbook-declaration">
          <h2 className="handbook-section-title">VIII. Our Declaration</h2>
          <p className="handbook-declaration-line">Rikuruma Pentecostal Church will not merely exist. It will expand.</p>
          <p className="handbook-declaration-line">It will not merely gather. It will grow.</p>
          <p className="handbook-declaration-line">It will not merely worship. It will work.</p>
          <p>Through servant leadership, structured training, and Spirit-led vision, we will build a church that is:</p>
          <ul className="handbook-list handbook-list-check handbook-list-inline">
            <li>Spiritually strong</li>
            <li>Structurally sound</li>
            <li>Strategically positioned</li>
            <li>Generationally impactful</li>
          </ul>
          <div className="handbook-quote">
            <i className="fas fa-quote-left"></i>
            <span>"This is the Lord's doing; it is marvelous in our eyes."</span>
            <cite>&mdash; Psalm 118:23</cite>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HandbookPage;
