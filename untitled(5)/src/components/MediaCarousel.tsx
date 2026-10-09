import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '../types/media';
import { MediaCard } from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaCarouselProps {
  title: string;
  icon?: React.ReactNode;
  items: Array<{
    media: MediaItem;
    progressPercent?: number;
    seasonNumber?: number;
    episodeNumber?: number;
    onRemove?: () => void;
  }>;
  rightAction?: React.ReactNode;
  emptyMessage?: string;
  showRemove?: boolean;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  icon,
  items,
  rightAction,
  emptyMessage = 'No items found in this category.',
  showRemove = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 w-full relative group/section">
      {/* Clean Section Header (Natural Case) */}
      <div className="flex items-center justify-between mb-3 px-4 sm:px-0">
        <div className="flex items-center space-x-2.5">
          {icon && <span className="text-neutral-400">{icon}</span>}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
            {items.length}
          </span>
        </div>

        {rightAction && (
          <div>{rightAction}</div>
        )}
      </div>

      {/* Carousel Track with smooth navigation buttons */}
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-200 hidden md:flex cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-200 hidden md:flex cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-none py-2 px-4 sm:px-0 scroll-smooth carousel-mask"
        >
          {items.map((item) => (
            <MediaCard
              key={`${item.media.id}-${item.seasonNumber || 0}-${item.episodeNumber || 0}`}
              media={item.media}
              progressPercent={item.progressPercent}
              seasonNumber={item.seasonNumber}
              episodeNumber={item.episodeNumber}
              showRemove={showRemove}
              onRemove={item.onRemove}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
