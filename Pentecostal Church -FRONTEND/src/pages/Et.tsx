import React, { useEffect } from 'react';
import styles from '../styles/ET.module.css';
import { Link } from 'react-router-dom';

const Etpage: React.FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teams = [
    {
      id: 'rivet',
      name: 'RIVET',
      fullName: 'Rift Valley Evangelistic Team',
      description: 'Focused on spreading the Gospel across the Rift Valley region through impactful missions and fellowships.',
      path: '/ets/rivet'
    },
    {
      id: 'net',
      name: 'NET',
      fullName: 'Nyanza Evangelistic Team',
      description: 'Dedicated to evangelizing the Nyanza region and advancing the Kingdom of God through outreach.',
      path: '/ets/net'
    },
    {
      id: 'eset',
      name: 'ESET',
      fullName: 'Eastern Evangelistic Team',
      description: 'Spreading the Gospel across Eastern, Coastal, and North Eastern regions with a heart for diverse communities.',
      path: '/ets/eset'
    },
    {
      id: 'weso',
      name: 'WESO',
      fullName: 'Western Evangelistic Students Outreach',
      description: 'A passionate ministry dedicated to transform lives in the Western region through effective evangelism.',
      path: '/ets/weso'
    },
    {
      id: 'cet',
      name: 'CET',
      fullName: 'Central Evangelistic Team',
      description: 'Mission-driven ministry committed to evangelizing the Central region and Nairobi with fire for Christ.',
      path: '/ets/cet'
    }
  ];

  return (
    <div className={styles.etLandingPage}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Evangelistic Teams</h1>
          <p className={styles.heroSubtitle}>
            Transforming lives and communities through the power of the Gospel.
            Join our mission to reach every corner of the nation.
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <div className={styles.gridContainer}>
        <div className={styles.teamsGrid}>
          {teams.map((team) => (
            <div key={team.id} className={styles.teamCard}>
              <div className={styles.cardContent}>
                <h2 className={styles.teamName}>{team.name}</h2>
                <p className={styles.teamDescription}>{team.description}</p>
                <Link to={team.path} className={styles.learnMoreBtn}>
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Etpage;
