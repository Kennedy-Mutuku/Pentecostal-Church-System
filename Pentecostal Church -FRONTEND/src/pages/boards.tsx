import React from 'react';
import styles from '../styles/classes.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import betPImg from '../assets/Best-p.png'
import classImg from '../assets/class.png'
import disciplesipImg from '../assets/discipleship.png'
import fellowshipImg from '../assets/fellowship.png'

interface ClassInfo {
  title: string;
  description: string;
  imgSrc: any;
  delay: string;
  socialLink: string;
  socialIconClass: any;
}

const classData: ClassInfo[] = [
  {
    title: 'ICT Board',
    description: 'RPC ICT board is responsible for Managing RPC Nyamira website, Projection of all church activities, Managing the church facebook account, Preparation and updating of the database. It is headed by the publicity secretary as the overseer, the chairperson and the secretary who are nominated by the board members.',
    imgSrc: betPImg,
    delay: '0.1s',
    socialLink: 'https://www.facebook.com/share/18rhcZ1XpA/',
    socialIconClass: faFacebook,
  },
  {
    title: 'Communication Board',
    description: 'The communication board is responsible for: Publicizing the church activities, Heads in creating awareness of social networks and their publications, Managing RPC Nyamira X account. It is headed by the publicity secretary as the overseer, the chairperson and the secretary who are nominated by the board members.',
    imgSrc: disciplesipImg,
    delay: '0.2s',
    socialLink: 'https://www.tiktok.com/@rikurumapentecostal',
    socialIconClass: faTiktok,
  },
  {
    title: 'Media Production Board',
    description: 'RPC Media production board is responsible for the following in the church, Covering all the RPC Nyamira activities where necessary, Managing RPC Nyamira youtube page, Edit and keep all coverage and/or provide them when need arise. It is headed by the publicity secretary as the overseer, the chairperson and the secretary.',
    imgSrc: classImg,
    delay: '0.3s',
    socialLink: 'https://x.com/rpcnyamira',
    socialIconClass: faXTwitter,
  },
  {
    title: 'Editorial Board',
    description: "RPC editorial board is responsible for: Publication of the Beyond the Origin magazine and any other publications as directed by the executive committee. It is also responsible for the selling of the publications. It is headed by the Boards coordinator as the overseer, the chairperson and the secretary.",
    imgSrc: fellowshipImg,
    delay: '0.4s',
    socialLink: 'https://www.youtube.com/@savedbychriststainedbylove',
    socialIconClass: faYoutube,
  },
];

const BoardsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>RPC Nyamira BOARDS</h2>
        <p>Meet the boards we have in RPC Nyamira</p>
      </div>

      <div className={styles.row}>
        {classData.map((classInfo, index) => (
          <div
            key={index}
            className={`${styles.card} ${styles.animated} ${
              index % 2 === 0 ? styles.fadeInDown : styles.fadeInUp
            }`}
            style={{ animationDelay: classInfo.delay }}
          >
            <div className={styles.classimg}>
              <img src={classInfo.imgSrc} alt={classInfo.title} />
            </div>
            <div className={styles.classBox}>
              <h3>{classInfo.title}</h3>
              <p>{classInfo.description}</p>
              <ul className={styles.socialLinks}>
                <li>
                  <a href={classInfo.socialLink} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={classInfo.socialIconClass} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;
