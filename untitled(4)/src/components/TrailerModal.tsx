import React from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export const TrailerModal: React.FC = () => {
  const { trailerKey, closeTrailer } = useApp();

  if (!trailerKey) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={closeTrailer}
    >
      <div 
        className="relative w-full max-w-4xl aspect-video rounded-none overflow-hidden bg-black shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeTrailer}
          className="absolute top-3 right-3 z-30 p-2 rounded-none bg-black/80 hover:bg-white text-white hover:text-black transition-colors border border-white/20 cursor-pointer"
          title="Close Trailer"
        >
          <X className="w-4 h-4" />
        </button>

        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
          title="Official Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
