import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

const ChoirsPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Our Choirs | RPC Nyamira";
    
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

  const choirs = [
    {
      id: 'trumpet',
      name: 'Trumpet of Yahweh Choir',
      description: 'Lifting up a sound of praise and adoration, the Trumpet of Yahweh Choir ministers with power, leading the congregation into deep worship experiences through vibrant and spirit-filled melodies.',
      videos: [
        { url: 'https://www.youtube.com/embed/dCYImKcZTjk', title: 'MWANADAMU ll TRUMPET OF YAWEH CHOIR ll RPC NYAMIRA' },
        { url: 'https://www.youtube.com/embed/zgMlS4T75Lo', title: 'MBONA UNAUZUNIKA ll TRUMPET OF YAWEH CHOIR ll RPC NYAMIRA' },
        { url: 'https://www.youtube.com/embed/2DCMYtGVGQ8', title: 'TAZAMA JINSI || TRUMPET OF YAWEH || RPC NYAMIRA' },
        { url: 'https://www.youtube.com/embed/AaiI4I7-Bmw', title: 'UMETUTENGENEZA || TRUMPET OF YAWEH || RPC NYAMIRA' }
      ],
      color: 'from-[#3b1a62] to-[#602796]',
      bgColor: 'bg-[#faf8fc]'
    },
    {
      id: 'agape',
      name: 'Agape Voice Choir (Agape Hearts)',
      description: 'With hearts overflowing with God\'s unconditional love, Agape Voice Choir ministers through songs that heal, encourage, and uplift. Their harmonies echo the beauty of God\'s grace.',
      videos: [
        { url: 'https://www.youtube.com/embed/yym9Xi0o5Uw', title: 'YESU ALIWAMBIA ll TRUMPET OF YAWEH CHOIR ll RPC NYAMIRA' },
        { url: 'https://www.youtube.com/embed/y7yKev9NPYI', title: 'APANDAYE HABA -- TRUMPET OF YAWEH CHOIR -- Rikuruma Pentecostal Church - Nyamira' }
      ],
      color: 'from-[#e65100] to-[#ff7b00]',
      bgColor: 'bg-[#fff9f5]'
    },
    {
      id: 'born-to-worship',
      name: 'Born to Worship Ministers',
      description: 'Dedicated to living a lifestyle of worship, the Born to Worship Ministers inspire the church to connect intimately with the Father. Their ministry is marked by reverence and passion for God\'s presence.',
      videos: [
        { url: 'https://www.youtube.com/embed/byQVtcrxDRs', title: 'ENYANGI, TRUMPET OF YAWEH CHOIR, R.P.C  NYAMRA' },
        { url: 'https://www.youtube.com/embed/O9QnigyLpKY', title: 'LEO KUNA NINI || TRUMPET OF YAWEH || RPC NYAMIRA' }
      ],
      color: 'from-[#8B0000] to-[#B22222]',
      bgColor: 'bg-[#fff5f5]'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-12 lg:pt-16 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 text-center">
        <span className="text-xs font-bold tracking-[0.2em] text-[#e65100] uppercase mb-2 block">
          Worship & Praise
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3b1a62] mb-4">
          Our Church Choirs
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          RPC Nyamira is truly a singing church. Experience the powerful ministry of our choirs as they lead the congregation in vibrant, spirit-filled worship.
        </p>
      </div>

      {/* Choirs Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {choirs.map((choir, index) => (
          <section id={choir.id} key={choir.id} className={`rounded-[2rem] border border-black/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${choir.bgColor} scroll-mt-24`}>
            <div className="p-3 sm:p-6 md:p-10 lg:p-14">
              
              <div className="text-center max-w-4xl mx-auto mb-10">
                <h2 className={`text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${choir.color} mb-4`}>
                  {choir.name}
                </h2>
                <div className={`w-16 h-1 mx-auto rounded-full bg-gradient-to-r ${choir.color} mb-6 opacity-70`}></div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {choir.description}
                </p>
              </div>

              {/* Videos Grid */}
              <div className={`grid gap-3 md:gap-8 ${choir.videos.length > 2 ? 'grid-cols-2 md:grid-cols-2' : 'grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto'}`}>
                {choir.videos.map((video, vIndex) => (
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

export default ChoirsPage;
