import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CURATED_MEDIA } from '../data/mediaData';
import { RatingBadges } from './RatingBadges';
import { Play, Info, ChevronLeft, ChevronRight, Dices, Sparkles, Clock, Calendar } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { openPlayer, openDetails, getRandomMedia, openAICurator } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCountdown, setRandomCountdown] = useState<number | null>(null);
  const randomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingRandomMedia, setPendingRandomMedia] = useState<any>(null);

  // Time of day greeting (natural, friendly sentence case)
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) {
      setGreeting('Still up? What are we watching?');
    } else if (hour < 12) {
      setGreeting('Good morning! What would you like to watch?');
    } else if (hour < 18) {
      setGreeting('Good afternoon. Ready for a great film?');
    } else {
      setGreeting('Good evening. What are you in the mood for?');
    }
  }, []);

  const featuredList = CURATED_MEDIA.slice(0, 5);
  const currentItem = featuredList[currentIndex];

  // Auto rotation with smooth fade
  useEffect(() => {
    if (randomCountdown !== null) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredList.length);
    }, 7500);
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
    <div className="relative w-full h-[75vh] min-h-[500px] max-h-[750px] overflow-hidden mb-8 bg-neutral-950">
      {/* Background Image Carousel with Pure Cinematic Fade */}
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
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-105"
          />
          {/* Natural Vignette and Bottom Fade Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/30 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-neutral-950/70 to-transparent" />
        </div>
      ))}

      {/* Nav Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-200 cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-200 cursor-pointer shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 h-full flex flex-col justify-end pb-12 sm:pb-14">
        {/* Editorial Greeting Header */}
        <div className="mb-auto pt-20 max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-medium text-neutral-300 tracking-tight">
            {greeting}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Ad-free cinema · Direct playback · Curated catalog
          </p>
        </div>

        {/* Featured Content Banner */}
        <div className="max-w-2xl animate-fade-in" key={currentItem.id}>
          {/* Metadata Chips & Rotten Tomatoes Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="px-2.5 py-0.5 rounded bg-white text-black font-semibold text-xs shadow-sm">
              Featured {currentItem.type === 'movie' ? 'Movie' : currentItem.anime ? 'Anime' : 'Series'}
            </span>

            {/* Rotten Tomatoes & IMDb Badges */}
            <RatingBadges 
              rottenTomatoes={currentItem.rottenTomatoes}
              imdbRating={currentItem.imdbRating}
              metascore={currentItem.metascore}
              tmdbRating={currentItem.rating}
              size="sm"
            />

            {currentItem.year && (
              <span className="flex items-center space-x-1 text-xs text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentItem.year}</span>
              </span>
            )}

            {currentItem.runtime && (
              <span className="flex items-center space-x-1 text-xs text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentItem.runtime} min</span>
              </span>
            )}

            {currentItem.ageRating && (
              <span className="px-1.5 py-0.5 rounded bg-black/80 border border-neutral-700 text-neutral-300 text-[11px] font-mono">
                {currentItem.ageRating}
              </span>
            )}
          </div>

          {/* Title (Natural, Elegant, Cinematic font) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-2.5 leading-tight">
            {currentItem.title}
          </h1>

          {/* Director & Tagline */}
          {currentItem.director && (
            <p className="text-xs sm:text-sm text-neutral-300 font-medium mb-2">
              Directed by {currentItem.director}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 mb-6 font-normal leading-relaxed">
            {currentItem.overview}
          </p>

          {/* Action buttons (Clean, comfortable, non-screaming) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openPlayer(currentItem)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-white text-neutral-950 font-semibold text-sm transition-all duration-200 hover:bg-neutral-200 active:scale-95 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play Now</span>
            </button>

            <button
              onClick={() => openDetails(currentItem)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-white font-medium text-sm border border-neutral-700 hover:border-neutral-500 transition-all duration-200 cursor-pointer"
            >
              <Info className="w-4 h-4 text-neutral-300" />
              <span>More Info & Insights</span>
            </button>

            {/* Random Media Button */}
            <button
              onClick={triggerRandom}
              title="Pick something random to watch"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                randomCountdown !== null
                  ? 'bg-amber-400 text-black border-amber-400 animate-pulse font-semibold'
                  : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>
                {randomCountdown !== null
                  ? `Playing in ${randomCountdown}s (Cancel)`
                  : 'Surprise Me'}
              </span>
            </button>

            {/* Ask AI Curator button */}
            <button
              onClick={() => openAICurator()}
              title="Get personalized recommendations from AI"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-white text-sm border border-neutral-700 hover:border-neutral-500 transition-all duration-200 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Ask AI Curator</span>
            </button>
          </div>
        </div>

        {/* Slide Indicator Ticks */}
        <div className="flex items-center space-x-2 mt-8">
          {featuredList.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                dotIdx === currentIndex ? 'w-8 bg-white' : 'w-3 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
