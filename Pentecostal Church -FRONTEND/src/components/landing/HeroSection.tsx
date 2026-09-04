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

const HeroSection = () => {
  const navigate = useNavigate();

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
                <a href="#" className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline">Open &rarr;</a>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Find your home</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Our Centres</h3>
                <p className="text-gray-600 text-[13px]">Mombasa, Nairobi and the US</p>
                <a href="#" className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline">Open &rarr;</a>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Set apart</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Prayer & Fasting</h3>
                <p className="text-gray-600 text-[13px]">Our weekly rhythms</p>
                <a href="#" className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline">Open &rarr;</a>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">This week</span>
                <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Latest News</h3>
                <p className="text-gray-600 text-[13px]">From the pulpit and around RPC</p>
                <a href="#" className="text-[#7c2d12] text-xs font-bold mt-2 hover:underline">Open &rarr;</a>
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
              <a href="#" className="text-red-900 text-xs font-bold mt-1 hover:underline">Open &rarr;</a>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Find your home</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Our Centres</h3>
              <p className="text-gray-600 text-xs">Nyamira and beyond</p>
              <a href="#" className="text-red-900 text-xs font-bold mt-1 hover:underline">Open &rarr;</a>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">Set apart</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Prayer & Fasting</h3>
              <p className="text-gray-600 text-xs">Our weekly rhythms</p>
              <a href="#" className="text-red-900 text-xs font-bold mt-1 hover:underline">Open &rarr;</a>
            </div>

            <div className="w-[1px] h-16 bg-gray-200"></div>

            <div className="flex flex-col space-y-1">
              <span className="text-[#b25712] text-[10px] font-bold uppercase tracking-widest">This week</span>
              <h3 className="text-gray-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Latest News</h3>
              <p className="text-gray-600 text-xs">From the pulpit and around RPC</p>
              <a href="#" className="text-red-900 text-xs font-bold mt-1 hover:underline">Open &rarr;</a>
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
