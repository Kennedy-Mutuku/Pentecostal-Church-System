import React, { useState } from 'react';

const VideoPlayer = ({ videoUrl, title }: { videoUrl: string, title: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = videoUrl.split('/').pop()?.split('?')[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl bg-gray-900 shadow-inner group cursor-pointer" 
      style={{ paddingTop: '56.25%' }} 
      onClick={() => setIsLoaded(true)}
    >
      {!isLoaded ? (
        <>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
            loading="lazy"
          />
          {/* Title Overlay imitating YouTube */}
          <div className="absolute top-0 left-0 w-full p-2 md:p-4 pt-1.5 md:pt-3 flex items-start space-x-2 md:space-x-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Channel Avatar */}
            <div className="hidden sm:flex w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 overflow-hidden shadow-md">
              <img 
                src="https://yt3.googleusercontent.com/C2V7opZbuTsjDNXMKpxtNLN1JUnpiey7AqV4nIy3rj1wy4sGCejSbILMkkzQPRJBSQSMYe0WwA=s900-c-k-c0x00ffffff-no-rj" 
                alt="Channel Avatar" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 mt-0 md:mt-0.5">
              <h3 className="text-white text-[10px] sm:text-xs md:text-[17px] leading-tight md:leading-snug font-medium drop-shadow-md line-clamp-2">
                {title}
              </h3>
            </div>
          </div>
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
            <div className="w-8 h-8 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 md:w-8 md:h-8 text-white ml-0.5 md:ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={`${videoUrl}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;
