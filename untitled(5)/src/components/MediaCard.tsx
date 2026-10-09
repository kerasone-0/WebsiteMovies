import React from 'react';
import { MediaItem } from '../types/media';
import { useApp } from '../context/AppContext';
import { TomatoIcon, PopcornIcon } from './Icons';
import { Play, Bookmark as BookmarkIcon, Star, X, Info, Sparkles } from 'lucide-react';

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
  const { 
    openPlayer, 
    openDetails, 
    isBookmarked, 
    addBookmark, 
    removeBookmark, 
    preferences,
    customization,
    openAICurator
  } = useApp();

  const bookmarked = isBookmarked(media.id);
  const isWidescreen = customization.cardStyle === 'widescreen';
  const isMinimal = customization.cardStyle === 'minimal' || preferences.minimalCards;
  const isSoftBorder = customization.borderSharpness === 'soft';

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(media.id);
    } else {
      addBookmark(media);
    }
  };

  const imageSrc = isWidescreen && media.backdrop ? media.backdrop : media.poster;
  const rt = media.rottenTomatoes;

  return (
    <div
      onClick={() => {
        if (isMinimal) {
          openPlayer(media, seasonNumber, episodeNumber);
        } else {
          openDetails(media);
        }
      }}
      className={`group relative flex-shrink-0 cursor-pointer select-none transition-all duration-300 ${
        isWidescreen ? 'w-56 sm:w-64 md:w-72' : 'w-36 sm:w-44 md:w-48'
      }`}
    >
      {/* Frame with clean subtle border */}
      <div 
        className={`relative w-full overflow-hidden bg-neutral-900 border border-neutral-800/80 group-hover:border-neutral-500 transition-all duration-300 shadow-md ${
          isSoftBorder ? 'rounded-lg' : 'rounded-none'
        } ${isWidescreen ? 'aspect-[16/9]' : 'aspect-[2/3]'}`}
      >
        <img
          src={imageSrc}
          alt={media.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
        />

        {/* Clean Fade Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5">
          {/* Top row actions */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleBookmarkToggle}
              title={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-1.5 rounded transition-all duration-200 cursor-pointer shadow ${
                bookmarked
                  ? 'bg-amber-400 text-black'
                  : 'bg-black/70 text-white hover:bg-white hover:text-black'
              }`}
            >
              <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openAICurator(`Find movies and shows similar to "${media.title}" (${media.year || ''})`);
                }}
                title="Curate similar with AI"
                className="p-1.5 rounded bg-black/70 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              {showRemove && onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  title="Remove item"
                  className="p-1.5 rounded bg-black text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Center Play Icon */}
          <div className="flex justify-center items-center my-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPlayer(media, seasonNumber, episodeNumber);
              }}
              className="w-11 h-11 rounded-full bg-white text-neutral-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer"
              title="Play Now"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>

          {/* Bottom row: Info & Resolution */}
          <div className="flex justify-between items-center text-[10px] font-sans">
            <span className="px-1.5 py-0.5 bg-black/80 rounded text-neutral-200 font-medium">
              {customization.defaultQuality.toUpperCase()}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openDetails(media);
              }}
              className="p-1.5 rounded bg-black/70 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              title="Details & Insights"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Season & Episode Tag */}
        {seasonNumber !== undefined && episodeNumber !== undefined && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
            S{seasonNumber}·E{episodeNumber}
          </div>
        )}

        {/* Rotten Tomatoes & Rating Badges (Bottom Left / Top Left) */}
        <div className="absolute top-2 left-2 flex items-center space-x-1 group-hover:opacity-0 transition-opacity duration-200">
          {rt ? (
            <div 
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] text-white border border-neutral-800 shadow-sm"
              title={`Rotten Tomatoes: ${rt.tomatometer}% Tomatometer`}
            >
              <TomatoIcon 
                status={rt.certifiedFresh ? 'certified' : rt.tomatometer >= 60 ? 'fresh' : 'rotten'} 
                className="w-3.5 h-3.5 flex-shrink-0" 
              />
              <span className="font-bold text-[10px]">{rt.tomatometer}%</span>
            </div>
          ) : media.rating ? (
            <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white shadow-sm">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{media.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        {/* Progress Bar */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-900">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Title & Metadata (Clean Natural Casing) */}
      {!isMinimal && (
        <div className="mt-2 text-left">
          <h3 className="font-semibold text-xs sm:text-sm text-neutral-100 truncate leading-snug group-hover:text-white transition-colors">
            {media.title}
          </h3>
          <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400 mt-0.5">
            <span>{media.type === 'movie' ? 'Movie' : media.anime ? 'Anime' : 'Series'}</span>
            {media.year && <span>· {media.year}</span>}
            {rt && (
              <span className="text-amber-400 font-medium ml-auto flex items-center space-x-1 text-[10px]">
                <PopcornIcon className="w-3 h-3 flex-shrink-0" />
                <span>{rt.audienceScore}%</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
