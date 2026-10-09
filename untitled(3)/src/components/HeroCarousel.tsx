import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CURATED_MEDIA } from '../data/mediaData';
import { Play, Info, ChevronLeft, ChevronRight, Dices, Star, Sparkles } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { openPlayer, openDetails, getRandomMedia, openAICurator } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCountdown, setRandomCountdown] = useState<number | null>(null);
  const randomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingRandomMedia, setPendingRandomMedia] = useState<any>(null);

  // Time of day greeting
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) {
      setGreeting('Still up? What are we watching?');
    } else if (hour < 12) {
      setGreeting('What would you like to watch this morning?');
    } else if (hour < 18) {
      setGreeting('What would you like to watch this afternoon?');
    } else {
      setGreeting('What would you like to watch tonight?');
    }
  }, []);

  const featuredList = CURATED_MEDIA.slice(0, 5);
  const currentItem = featuredList[currentIndex];

  // Auto rotation with smooth fade
  useEffect(() => {
    if (randomCountdown !== null) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredList.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredList.length, randomCountdown]);

  // Handle Random Media Countdown
  const triggerRandom = () => {
    if (randomCountdown !== null) {
      if (randomTimerRef.current) clearInterval(randomTimerRef.current);
      setRandomCountdown(null);
      setPendingRandomMedia(null);
      return;
    }

    const picked = getRandomMedia();
    setPendingRandomMedia(picked);
    setRandomCountdown(4);

    let count = 4;
    randomTimerRef.current = setInterval(() => {
      count -= 1;
      setRandomCountdown(count);
      if (count <= 0) {
        if (randomTimerRef.current) clearInterval(randomTimerRef.current);
        setRandomCountdown(null);
        openPlayer(picked);
      }
    }, 1000);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredList.length);
  };

  if (!currentItem) return null;

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden mb-6 bg-black">
      {/* Background Image Carousel with Pure Fade */}
      {featuredList.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={item.backdrop}
            alt={item.title}
            className="w-full h-full object-cover object-top filter grayscale contrast-125 brightness-[0.55]"
          />
          {/* Pure Black Fade Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black to-transparent" />
        </div>
      ))}

      {/* Floating Square Nav Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-none bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-none bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 h-full flex flex-col justify-end pb-14 sm:pb-16">
        {/* Editorial Greeting Header */}
        <div className="mb-auto pt-24 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            {greeting}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-mono tracking-widest uppercase">
            No ads · No signup · Pure Cinema
          </p>
        </div>

        {/* Featured Content Banner */}
        <div className="max-w-2xl animate-fade-in" key={currentItem.id}>
          {/* Metadata Square Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono text-neutral-300">
            <span className="px-2 py-0.5 rounded-none bg-white text-black font-bold uppercase tracking-wider text-[11px]">
              {currentItem.type === 'movie' ? 'Movie' : currentItem.anime ? 'Anime' : 'Series'}
            </span>

            {currentItem.rating && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-none bg-black border border-white/20 text-white font-bold">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>{currentItem.rating.toFixed(1)}</span>
              </span>
            )}

            {currentItem.year && (
              <span className="px-2 py-0.5 border border-white/10 text-neutral-400">
                {currentItem.year}
              </span>
            )}

            {currentItem.runtime && (
              <span className="px-2 py-0.5 border border-white/10 text-neutral-400">
                {currentItem.runtime} MIN
              </span>
            )}

            {currentItem.ageRating && (
              <span className="px-1.5 py-0.5 border border-white/20 text-neutral-400 text-[10px]">
                {currentItem.ageRating}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3 leading-none">
            {currentItem.title}
          </h2>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 mb-6 font-normal leading-relaxed">
            {currentItem.overview}
          </p>

          {/* Action buttons (Clean, Sharp Square) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openPlayer(currentItem)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-none bg-white text-black font-bold tracking-wider uppercase text-xs sm:text-sm transition-all duration-300 hover:bg-neutral-200 active:scale-95 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play Now</span>
            </button>

            <button
              onClick={() => openDetails(currentItem)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-none bg-black hover:bg-neutral-900 text-white font-semibold tracking-wider uppercase text-xs sm:text-sm border border-white/20 hover:border-white transition-all duration-300 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>

            {/* Random Media Button */}
            <button
              onClick={triggerRandom}
              title="Pick something random to watch"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-none border text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                randomCountdown !== null
                  ? 'bg-white text-black border-white animate-pulse'
                  : 'bg-black text-neutral-300 border-white/20 hover:border-white hover:text-white'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>
                {randomCountdown !== null
                  ? `PLAYING IN ${randomCountdown}S (CANCEL)`
                  : 'RANDOM'}
              </span>
            </button>

            {/* Ask AI Curator button */}
            <button
              onClick={() => openAICurator()}
              title="Get personalized recommendations from AI"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-none bg-black hover:bg-neutral-900 text-white font-mono text-xs sm:text-sm border border-white/20 hover:border-white transition-all duration-300 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Square Slide Indicator Ticks */}
        <div className="flex items-center space-x-2 mt-8">
          {featuredList.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1 transition-all duration-300 cursor-pointer ${
                dotIdx === currentIndex ? 'w-8 bg-white' : 'w-3 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
