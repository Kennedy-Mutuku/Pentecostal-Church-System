import myPhoto from '../assets/RPC logo updated.png';
import OmbogoImg from '../assets/FB_IMG_1769696349668.jpg';
import TomImg from '../assets/IMG-20260129-WA0039.jpg';
import tembaImg from '../assets/IMG-20260129-WA0048.jpg';
import kamamiaImg from '../assets/IMG-20260129-WA0040.jpg';
import harrietImg from '../assets/IMG-20260129-WA0053.jpg';
import rachelImg from '../assets/IMG-20260130-WA0003.jpg';
import stanImg from '../assets/IMG-20260130-WA0047.jpg';
import umojaImg from '../assets/IMG-20260130-WA0046.jpg';
import lyndraImg from '../assets/IMG-20260130-WA0045.jpg';
import williamImg from '../assets/IMG-20260129-WA0063.jpg';
import victoriaImg from '../assets/IMG-20260129-WA0058.jpg';
import ookoImg from '../assets/IMG-20260130-WA0050.jpg';
import patronImg from '../assets/IMG_8981.jpg';
import assistantPatronImg from '../assets/Rev.Kephar.jpeg';
import cmfImg from '../assets/cmf.jpg';
import boardsCordImg from '../assets/boardscord.jpeg';
import firstLadyImg from '../assets/susan.JPG';
import React from 'react';
import { Link } from 'react-router-dom';
import './Leadership.css'
import { FaYoutube, FaInstagram, FaXTwitter, FaTiktok, FaFacebook, FaWhatsapp } from "react-icons/fa6";
const Leadership = () => {
  const executiveCommittee = [
    {
      title: 'Chairperson',
      name: 'Stanley Otieno',
      phone: '+254 718 519 242',
      role: 'stanleyotieno10836@gmail.com',
      image: stanImg
    },
    {
      title: 'Vice Chairperson',
      name: 'Munde Alice Harriet',
      phone: '+254 110 473 947',
      role: 'aliceharriet757@gmail.com',
      image: harrietImg
    },
    {
      title: 'Secretary',
      name: 'Odliah Temba',
      phone: '+254 758 816 535',
      role: 'odliahtemba@gmail.com',
      image: tembaImg
    },
    {
      title: 'Public Secretary',
      name: 'Emmanuel Ombogo',
      phone: '+254 717 481 883',
      role: 'emmanuelombongo@gmail.com',
      image: OmbogoImg
    },
    {
      title: 'Treasurer',
      name: 'Rachel Kitivi',
      phone: '+254 719 400 686',
      role: 'rachelkitivi@gamil.com',
      image: rachelImg
    },
    {
      title: 'Worship Coordinator',
      name: 'David Ooko',
      phone: '+254 714 684 714',
      role: 'odurdavid629@gamil.com',
      image: ookoImg
    },
    {
      title: 'Boards Coordinator',
      name: 'Faith Halima',
      phone: '+254 706 434 348',
      role: 'Ministry Coordination',
      image: boardsCordImg
    },
    {
      title: 'Bible Study Coordinator',
      name: 'Victor Kamamia',
      phone: '+254 111 554 776',
      role: 'kamamiavictor@gmail.com',
      image: kamamiaImg
    },
    {
      title: 'Prayer Coordinator',
      name: 'William Ochieng',
      phone: '+254 111 436 995',
      role: 'williamchieng54@gmail.com',
      image: williamImg
    },
    {
      title: 'Missions Coordinator',
      name: 'Tom Muasya',
      phone: '+254 115 875 390',
      role: 'tommuasya65@gmail.com',
      image: TomImg
    },
    {
      title: 'Discipleship Coordinator',
      name: 'Victoria Naserian',
      phone: '+254 100 504 608',
      role: 'ntikoisanaserian@gmail.com',
      image: victoriaImg
    }
  ];

  const patron = {
    title: 'Patron',
    name: 'Dr. Rhoda Auni',
    role: 'Patron, RPC Nyamira',
    image: patronImg
  };

  const assistantPatron = {
    title: 'Senior Pastor',
    name: 'Rev. Kephar OMondi',
    role: 'Senior Pastor, RPC Nyamira',
    image: assistantPatronImg
  };

  const firstLady = {
    title: 'First Lady',
    name: 'Mrs. Kephar Omondi',
    role: 'First Lady, RPC Nyamira',
    image: firstLadyImg
  };

  return (
    <div className="leadership-page">
      {/* Page Content */}
      <div className="page-content">
        {/* Hero Section */}
        <div className="hero">
          <h1>Leadership & Structure</h1>
          <p>Below is the leadership of the Rikuruma Pentecostal Church Nyamira.</p>
        </div>

        {/* Main Content */}
        <div className="container">

          {/* Top Leadership Block */}
          <section className="section">
            <div className="section-container">
              <div className="committee-grid">
                {[assistantPatron, firstLady].map((member, index) => (
                  <div key={index} className="profile-card">
                    <img src={member.image} alt={member.title} className="profile-image"
                      style={{ objectFit: 'cover', objectPosition: 'top' }} />
                    <div className="profile-info">
                      <h3>{member.title}</h3>
                      <p className="profile-name">{member.name}</p>
                      {member.phone && (
                        <p className="profile-phone">
                          <i className="fas fa-phone"></i> {member.phone}
                        </p>
                      )}
                      <p className="role">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


        </div>
      </div>
    </div>
  );
};

export default Leadership;
