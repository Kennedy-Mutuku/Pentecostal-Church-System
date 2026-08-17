import React, { useState } from 'react';
import Lightbox from './Lightbox';

import leader1Img from '../assets/Leader 1.jpeg';
import leader2Img from '../assets/Leader 2.JPG';
import leader3Img from '../assets/Leader 3.JPG';
import leader4Img from '../assets/Leader 4.JPG';
import leader5Img from '../assets/Leader 5.JPG';

import board1Img from '../assets/Board 1.jpeg';
import board2Img from '../assets/Board 2.jpeg';
import board3Img from '../assets/Board 3.jpeg';
import board4Img from '../assets/Board 4 best.jpeg';

import './Leadership.css';

const Leadership = () => {
  const [lightbox, setLightbox] = useState(null);

  const teamLeaders = [
    { id: 1, image: leader1Img, name: 'Rev. Kephar Omondi',   role: 'Senior Pastor & Patron',      position: 'center 15%', zoom: 1.38, translateY: '-4%' },
    { id: 2, image: leader2Img, name: 'Fancy Megiri',          role: 'General Manager',             position: 'center 15%', zoom: 1.0,  translateY: '0%' },
    { id: 3, image: leader3Img, name: 'Lewis Muriu',            role: 'Secretary General',           position: 'center 15%', zoom: 1.0,  translateY: '0%' },
    { id: 4, image: leader4Img, name: 'Ruchuu Joyce',           role: 'Accounts & Finance Officer',  position: 'center 15%', zoom: 1.0,  translateY: '0%' },
    { id: 5, image: leader5Img, name: 'Kennedy Mutuku',         role: 'Executive IT & Media Lead',   position: 'center 25%', zoom: 1.25, translateY: '0%' },
  ];

  const boardPhotos = [
    { image: board1Img, caption: 'Board members in fellowship' },
    { image: board2Img, caption: 'Board members in fellowship' },
    { image: board3Img, caption: 'Board members in fellowship' },
    { image: board4Img, caption: 'Board members in fellowship' },
  ];

  return (
    <>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
          offsetTop={104}
          offsetLeft={44}
        />
      )}

      <div className="leadership-page min-h-screen pt-4 sm:pt-6 pb-16" style={{ overflowX: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 40, paddingTop: 8 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#e65100', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
              RPC NYAMIRA LEADERSHIP
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: -0.5 }}>
              Our Leadership Team
            </h1>
            <p style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>
              Servant leaders and council members serving the congregation of Rikuruma Pentecostal Church Nyamira.
            </p>
          </div>

          {/* Leadership Grid — responsive, never bleeds */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 20,
            marginBottom: 56,
          }}>
            {teamLeaders.map((leader, index) => (
              <div
                key={leader.id}
                onClick={() => setLightbox({ src: leader.image, alt: leader.name })}
                title={`${leader.name} — ${leader.role}`}
                style={{
                  borderRadius: 18,
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: '#f3f4f6',
                  cursor: 'zoom-in',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  position: 'relative',
                }}
                className="group"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    objectPosition: leader.position,
                    transform: leader.zoom > 1 ? `scale(${leader.zoom}) translateY(${leader.translateY})` : undefined,
                    transformOrigin: 'center center',
                    transition: 'filter 0.25s',
                  }}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0)',
                  transition: 'background 0.25s',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  paddingBottom: 12,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
                >
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#fff',
                    background: 'rgba(0,0,0,0.45)', borderRadius: 4,
                    padding: '2px 9px', opacity: 0, transition: 'opacity 0.2s',
                  }}
                    className="hover-hint"
                  >
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Church Council Board */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#e65100', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
                COUNCIL DOCKETS
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                Church Council Board
              </h2>
              <p style={{ fontSize: 13, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
                Dedicated council members who coordinate and serve across the various dockets of RPC Nyamira.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {boardPhotos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setLightbox({ src: photo.image, alt: photo.caption })}
                  title="Click to view"
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    background: '#f3f4f6',
                    cursor: 'zoom-in',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                    border: '1px solid rgba(0,0,0,0.07)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    loading="lazy"
                    decoding="async"
                    onMouseEnter={e => { (e.currentTarget).style.transform = 'scale(1.03)'; }}
                    onMouseLeave={e => { (e.currentTarget).style.transform = 'scale(1)'; }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .group:hover .hover-hint { opacity: 1 !important; }
      `}</style>
    </>
  );
};

export default Leadership;
