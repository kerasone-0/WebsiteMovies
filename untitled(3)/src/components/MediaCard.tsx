import React from 'react';
import { MediaItem } from '../types/media';
import { useApp } from '../context/AppContext';
import { Play, Bookmark as BookmarkIcon, Star, X, Info } from 'lucide-react';

interface MediaCardProps {
  media: MediaItem;
  progressPercent?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  progressPercent,
  seasonNumber,
  episodeNumber,
  onRemove,
  showRemove = false,
}) => {
  const { openPlayer, openDetails, isBookmarked, addBookmark, removeBookmark, preferences } = useApp();
  const bookmarked = isBookmarked(media.id);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(media.id);
    } else {
      addBookmark(media);
    }
  };

  return (
    <div
      onClick={() => {
        if (preferences.minimalCards) {
          openPlayer(media, seasonNumber, episodeNumber);
        } else {
          openDetails(media);
        }
      }}
      className="group relative flex-shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer select-none transition-all duration-300"
    >
      {/* Sharp Square Poster Frame */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-none bg-neutral-950 border border-white/15 group-hover:border-white/70 transition-all duration-300 shadow-md">
        <img
          src={media.poster}
          alt={media.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-85"
        />

        {/* Clean Fade Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5">
          {/* Top row actions (Square) */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleBookmarkToggle}
              title={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-1.5 rounded-none border transition-all duration-200 cursor-pointer ${
                bookmarked
                  ? 'bg-white text-black border-white'
                  : 'bg-black/80 text-white border-white/20 hover:border-white'
              }`}
            >
              <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            {showRemove && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                title="Remove item"
                className="p-1.5 rounded-none bg-black text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center Square Play Icon */}
          <div className="flex justify-center items-center my-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPlayer(media, seasonNumber, episodeNumber);
              }}
              className="w-10 h-10 rounded-none bg-white text-black flex items-center justify-center border border-white hover:bg-neutral-200 transition-all duration-300 shadow-xl"
              title="Play Now"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>

          {/* Bottom row: Info */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDetails(media);
              }}
              className="p-1.5 rounded-none bg-black/80 text-white border border-white/20 hover:border-white transition-colors"
              title="Details & Episodes"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Season & Episode Tag (Square & Monospaced) */}
        {seasonNumber !== undefined && episodeNumber !== undefined && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-none bg-black/90 text-[10px] font-mono tracking-wider text-white border border-white/20">
            S{seasonNumber}·E{episodeNumber}
          </div>
        )}

        {/* Rating Badge (Square) */}
        {media.rating && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-none bg-black/85 text-[10px] font-mono text-white flex items-center space-x-1 border border-white/10 group-hover:opacity-0 transition-opacity duration-200">
            <Star className="w-2.5 h-2.5 fill-white text-white" />
            <span>{media.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Square Progress Bar */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-900 border-t border-white/10">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Title & Metadata (Clean Monochromatic Typography) */}
      {!preferences.minimalCards && (
        <div className="mt-2 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider text-white truncate leading-snug group-hover:text-neutral-300 transition-colors">
            {media.title}
          </h3>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 mt-0.5 uppercase tracking-wider">
            <span>{media.type === 'movie' ? 'Movie' : media.anime ? 'Anime' : 'Series'}</span>
            {media.year && <span>· {media.year}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
