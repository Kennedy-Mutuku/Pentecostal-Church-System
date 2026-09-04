import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '../../config/environment';

import churchOutside from '../../assets/church outside.jpg';

interface ChurchEvent {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  category: string;
  isPermanent?: boolean;
}

const getNextSunday = () => {
  const now = new Date();
  const nextSunday = new Date();
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  nextSunday.setHours(9, 0, 0, 0);
  if (now > nextSunday) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }
  return nextSunday;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const target = getNextSunday().getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        setCountdown('Live Now');
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      if (days > 0) {
        setCountdown(`${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
      } else {
        setCountdown(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[750px] flex flex-col overflow-visible bg-black select-none font-sans mt-0 md:mt-0 mb-[550px] sm:mb-[580px] md:mb-0">
      
      {/* Background Image with slow zoom animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={churchOutside}
          alt="Church Outside"
          className="w-full h-full object-cover transform scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Tint Overlay to match the reddish-brown warm look */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3a1a15]/90 via-[#4f201d]/60 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center pb-16 md:pb-24 pt-16">
        
        <div className="max-w-3xl space-y-5">


          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white block">Come expecting.</span>
            <span className="text-[#f58b44] block mt-1">Leave transformed.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed mt-6 font-medium drop-shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            A house of prayer for all nations. Join us this Sunday at our sanctuary in Nyamira, or watch online from wherever you are.
          </p>

          {/* Buttons */}
          <div className="pt-6 flex flex-row gap-4 items-center">
            <a href="#about" className="px-8 py-3.5 bg-[#b25712] hover:bg-[#9a4a0f] text-white text-sm font-bold rounded shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer text-center">
              Plan your visit
            </a>
            <button onClick={() => navigate('/media')} className="px-8 py-3.5 bg-white/80 hover:bg-white text-black text-sm font-bold rounded shadow-lg transition-all hover:scale-105 cursor-pointer text-center">
              Watch sermons
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Info Cards (Wrapped in a cream container to match screenshot) */}
      <div className="absolute top-[100%] -mt-4 left-0 right-0 z-30 block md:hidden">
        <div className="bg-[#f8f6f0] mx-4 rounded-3xl p-6 sm:p-8 pt-8 sm:pt-10 shadow-2xl border border-[#e8e4db]">
          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">When we gather</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Service Times</h3>
                <p className="text-gray-600 text-[13px]">Sunday, Wednesday, Friday</p>
                <button onClick={() => navigate('/news')} className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline text-left">Open &rarr;</button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Worship with us</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Our Choirs</h3>
                <p className="text-gray-600 text-[13px]">Praise, worship & adoration</p>
                <button onClick={() => navigate('/choirs')} className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline text-left">Open &rarr;</button>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Word of God</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Sermons</h3>
                <p className="text-gray-600 text-[13px]">Watch our latest messages</p>
                <button onClick={() => navigate('/media')} className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline text-left">Open &rarr;</button>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Next Service</span>
                <h3 className="text-gray-900 font-bold text-lg tabular-nums tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {countdown || 'Loading...'}
                </h3>
                <p className="text-gray-600 text-[13px]">Sunday at 9:00 AM</p>
                <button onClick={() => navigate('/news')} className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline text-left">Open &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Floating Info Cards (Overlapping bottom edge) */}
      <div className="absolute -bottom-16 left-0 right-0 z-30 hidden md:block px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-[#f8f6f0] rounded-2xl shadow-2xl p-6 md:p-8 flex items-center justify-between gap-8 md:gap-16 border border-[#e8e4db] w-auto">
            
            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">When we gather</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Service Times</h3>
              <p className="text-gray-600 text-xs">Sunday, Wednesday, Friday</p>
              <button onClick={() => navigate('/news')} className="text-red-900 text-xs font-bold mt-1 hover:underline text-left">Open &rarr;</button>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Worship with us</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Our Choirs</h3>
              <p className="text-gray-600 text-xs">Praise, worship & adoration</p>
              <button onClick={() => navigate('/choirs')} className="text-red-900 text-xs font-bold mt-1 hover:underline text-left">Open &rarr;</button>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Word of God</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Sermons</h3>
              <p className="text-gray-600 text-xs">Watch our latest messages</p>
              <button onClick={() => navigate('/media')} className="text-red-900 text-xs font-bold mt-1 hover:underline text-left">Open &rarr;</button>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1 min-w-[140px]">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Next Service</span>
              <h3 className="text-gray-900 font-bold text-lg tabular-nums tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                {countdown || 'Loading...'}
              </h3>
              <p className="text-gray-600 text-xs">Sunday at 9:00 AM</p>
              <button onClick={() => navigate('/news')} className="text-red-900 text-xs font-bold mt-1 hover:underline text-left">Open &rarr;</button>
            </div>

          </div>
        </div>
      </div>




      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.15) translate(-1%, -1%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
