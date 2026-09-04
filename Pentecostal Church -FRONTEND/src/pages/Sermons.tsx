import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

const SermonsPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Sermons | RPC Nyamira";
    
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const sermonCategories = [
    {
      id: 'rpc-nyamira-sermons',
      title: 'Sermons in RPC Nyamira',
      description: 'Faith comes by hearing, and hearing by the word of God. Be blessed as you listen to the unadulterated word from our pulpit.',
      videos: [
        { url: 'https://www.youtube.com/embed/xQxqNKt_gow?start=433', title: 'Rev. Kepher Omondi | I LEFT CHURCH NOT GOD' },
        { url: 'https://www.youtube.com/embed/p3-_7igwsCE', title: '12th Anniversary ~ FRIDAY MID DAY SERVICE ~ REV MAKORI' },
        { url: 'https://www.youtube.com/embed/yDz6R-Q-_nE?start=25', title: 'PASTORS TRAINING | DR. Rhone | 9TH MARCH 2026' },
        { url: 'https://www.youtube.com/embed/SzMMUxUle6Q', title: 'DO NOT SETTLE FOR LESS | Sunday Service | RPC Nyamira' },
        { url: 'https://www.youtube.com/embed/jYek5YmHPnU', title: '12TH ANNIVERSARY ¦¦ REV KEN OMONDI ~Evening Crusade' },
        { url: 'https://www.youtube.com/embed/LqvIokem76s?start=7', title: 'REV JUDAH GOSHEN | NOW LET US POSSES THE LAND' },
        { url: 'https://www.youtube.com/embed/ZjDJI1A3tK0?start=43', title: 'SACRIFICIAL GIVING | Sunday Service | RPC Nyamira' },
        { url: 'https://www.youtube.com/embed/PZ5pRRfsr_A?start=44', title: 'MOTHERS DAY | Sunday Service | RPC Nyamira' },
        { url: 'https://www.youtube.com/embed/a3gSgAQ2fHg', title: 'SUNDAY SERVICE SERMON | 26/4/2026 | RPC Nyamira' },
        { url: 'https://www.youtube.com/embed/rC8nNj4ciak', title: 'JESUS THE ULTIMATE MODEL OF COMPASSION' },
        { url: 'https://www.youtube.com/embed/jEZ6PBRNfWI', title: 'REV LUCY | 11th ANNIVERSARY | RPC Nyamira' }
      ],
      color: 'from-[#3b1a62] to-[#602796]',
      bgColor: 'bg-[#faf8fc]'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-12 lg:pt-16 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 text-center">
        <span className="text-xs font-bold tracking-[0.2em] text-[#e65100] uppercase mb-2 block">
          Word of God
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3b1a62] mb-4">
          Sermons & Messages
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Faith comes by hearing, and hearing by the word of God. Watch and be blessed by the latest messages from the pulpit of Rikuruma Pentecostal Church.
        </p>
      </div>

      {/* Sermons Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-4">
        {sermonCategories.map((category) => (
          <section id={category.id} key={category.id} className={`rounded-[2rem] border border-black/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${category.bgColor} scroll-mt-24`}>
            <div className="p-3 sm:p-6 md:p-10 lg:p-14">
              
              <div className="text-center max-w-4xl mx-auto mb-6">
                <h2 className={`text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${category.color} mb-4`}>
                  {category.title}
                </h2>
                <div className={`w-16 h-1 mx-auto rounded-full bg-gradient-to-r ${category.color} mb-6 opacity-70`}></div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {category.videos.map((video, vIndex) => (
                  <div key={vIndex} className="bg-white rounded-2xl p-2 shadow-sm border border-black/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <VideoPlayer videoUrl={video.url} title={video.title} />
                  </div>
                ))}
              </div>

            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SermonsPage;
