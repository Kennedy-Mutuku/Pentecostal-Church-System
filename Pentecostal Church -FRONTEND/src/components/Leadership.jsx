import assistantPatronImg from '../assets/Rev.Kephar.jpeg';
import firstLadyImg from '../assets/susan.JPG';
import board1Img from '../assets/Board 1.jpeg';
import board2Img from '../assets/Board 2.jpeg';
import board3Img from '../assets/Board 3.jpeg';
import board4Img from '../assets/Board 4 best.jpeg';
import React from 'react';
import { Link } from 'react-router-dom';
import './Leadership.css'
import { FaYoutube, FaInstagram, FaXTwitter, FaTiktok, FaFacebook, FaWhatsapp } from "react-icons/fa6";
const Leadership = () => {
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

  const boardPhotos = [
    { image: board1Img, caption: 'Board members in fellowship' },
    { image: board2Img, caption: 'Board members in fellowship' },
    { image: board3Img, caption: 'Board members in fellowship' },
    { image: board4Img, caption: 'Board members in fellowship' }
  ];

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

          {/* Board Members Gallery */}
          <section className="section board-section">
            <div className="section-header">
              <h2>Our Boards</h2>
              <p>The dedicated board members who coordinate and serve across the various ministries of RPC Nyamira.</p>
            </div>
            <div className="board-gallery">
              {boardPhotos.map((photo, index) => (
                <figure key={index} className="board-photo">
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    width="1280"
                    height="720"
                  />
                </figure>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Leadership;
