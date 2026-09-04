import React, { useState } from 'react';
import Lightbox from './Lightbox';

import leader1Img from '../assets/Leader 1.jpeg';

import board1Img from '../assets/Board 1.jpeg';
import board2Img from '../assets/Board 2.jpeg';
import board3Img from '../assets/Board 3.jpeg';
import board4Img from '../assets/Board 4 best.jpeg';

const Leadership = () => {
  const [lightbox, setLightbox] = useState(null);

  const boardPhotos = [
    { image: board1Img, caption: 'Church Board and Leaders' },
    { image: board2Img, caption: 'Church Board and Leaders' },
    { image: board3Img, caption: 'Church Board and Leaders' },
    { image: board4Img, caption: 'Church Board and Leaders' },
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

      <div className="leadership-page min-h-[90vh] pt-8 md:pt-12 lg:pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f3eefe] to-[#f8f6f0]">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="block text-xs font-bold text-[#e65100] uppercase tracking-[0.2em] mb-2">
              Church Leadership
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3b1a62] mb-4 whitespace-normal break-words">
              Rev. Kepher Omondi
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Senior Pastor, Rikuruma Pentecostal Church Nyamira
            </p>
          </div>

          {/* Senior Pastor Hero Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-[#e2d5f8] flex flex-col md:flex-row mb-12 lg:mb-16 max-w-4xl mx-auto">
            {/* Image Side */}
            <div className="md:w-5/12 relative h-80 md:h-auto cursor-zoom-in group" onClick={() => setLightbox({ src: leader1Img, alt: 'Rev. Kepher Omondi' })}>
                <img 
                  src={leader1Img} 
                  alt="Rev. Kepher Omondi" 
                  className="w-full h-full object-cover object-[center_10%] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-sm font-semibold py-2 px-5 rounded-full transition-opacity duration-300 shadow-lg backdrop-blur-sm">
                        View Photo
                    </span>
                </div>
            </div>
            
            {/* Content Side */}
            <div className="md:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
               <h2 className="text-2xl md:text-3xl font-bold text-[#3b1a62] mb-3">Resident Pastor</h2>
               <div className="w-12 h-1 bg-[#e65100] rounded-full mb-6"></div>
               <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-4">
                 Since 2013, Rev. Kepher Omondi has served as the resident pastor of Rikuruma Pentecostal Church. His dedication and faith have provided consistent guidance for our congregation over the years.
               </p>
               <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                 Under his leadership, our church continues to experience steady spiritual and physical growth, transforming lives through the Gospel and establishing a lasting place of worship for the community.
               </p>
            </div>
          </div>

          {/* Church Council Board */}
          <div className="pt-10 border-t border-[#e2d5f8]">
            <div className="text-center mb-10">
              <span className="block text-xs font-bold text-[#e65100] uppercase tracking-[0.2em] mb-2">
                COUNCIL DOCKETS
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#3b1a62] mb-4">
                Church Board & Leaders
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our dedicated board members and leaders coordinate and serve across the various ministries of RPC Nyamira, ensuring the smooth operation and spiritual nourishment of our church community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {boardPhotos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setLightbox({ src: photo.image, alt: photo.caption })}
                  className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300 group relative border border-gray-100"
                >
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3b1a62]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <p className="text-white font-medium text-sm translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-sm">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Leadership;
