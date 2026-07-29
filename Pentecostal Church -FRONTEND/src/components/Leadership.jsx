import React from 'react';

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
  const teamLeaders = [
    {
      id: 1,
      image: leader1Img,
      name: 'Rev. Kephar Omondi',
      role: 'Senior Pastor & Patron',
      position: 'center 15%',
      zoom: 1.38,
      translateY: '-4%',
    },
    {
      id: 2,
      image: leader2Img,
      name: 'Fancy Megiri',
      role: 'General Manager',
      position: 'center 15%',
      zoom: 1.0,
      translateY: '0%',
    },
    {
      id: 3,
      image: leader3Img,
      name: 'Lewis Muriu',
      role: 'Secretary General',
      position: 'center 15%',
      zoom: 1.0,
      translateY: '0%',
    },
    {
      id: 4,
      image: leader4Img,
      name: 'Ruchuu Joyce',
      role: 'Accounts & Finance Officer',
      position: 'center 15%',
      zoom: 1.0,
      translateY: '0%',
    },
    {
      id: 5,
      image: leader5Img,
      name: 'Kennedy Mutuku',
      role: 'Executive IT & Media Lead',
      position: 'center 25%',
      zoom: 1.25,
      translateY: '0%',
    },
  ];

  const boardPhotos = [
    { image: board1Img, caption: 'Board members in fellowship' },
    { image: board2Img, caption: 'Board members in fellowship' },
    { image: board3Img, caption: 'Board members in fellowship' },
    { image: board4Img, caption: 'Board members in fellowship' },
  ];

  return (
    <div className="leadership-page min-h-screen bg-[#faf8f4]/60 pt-4 sm:pt-6 pb-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <span className="text-[#e65100] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] block">
            RPC NYAMIRA LEADERSHIP
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Our Leadership Team
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal pt-1">
            Servant leaders and council members serving the congregation of Rikuruma Pentecostal Church Nyamira.
          </p>
        </div>

        {/* Our Leadership Team Grid: Single column on Mobile, Grid on Tablet/Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 lg:gap-8 max-w-[340px] sm:max-w-none mx-auto">
          {teamLeaders.map((leader) => (
            <div
              key={leader.id}
              className="group flex flex-col items-center w-full"
            >
              {/* Photo Frame Container with 24px Rounded Corners */}
              <div className="w-full aspect-[3/4] rounded-[24px] overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/70 relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{
                    objectPosition: leader.position,
                    transform: leader.zoom > 1
                      ? `scale(${leader.zoom}) translateY(${leader.translateY})`
                      : undefined,
                    transformOrigin: 'center center',
                  }}
                  loading="lazy"
                />
              </div>


            </div>
          ))}
        </div>

        {/* Church Council Board Section */}
        <div className="space-y-6 pt-10 border-t border-gray-200/80">
          <div className="text-center space-y-1">
            <span className="text-[#e65100] font-bold text-xs uppercase tracking-[0.2em] block">
              COUNCIL DOCKETS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Church Council Board
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
              Dedicated church council members who coordinate and serve across the various dockets of RPC Nyamira.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {boardPhotos.map((photo, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200/70 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leadership;




