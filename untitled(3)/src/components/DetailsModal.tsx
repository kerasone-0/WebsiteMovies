import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getMovieDetails, getShowDetails, getShowSeasonEpisodes } from '../services/tmdb';
import { MediaItem, Episode } from '../types/media';
import { 
  X, 
  Play, 
  Bookmark as BookmarkIcon, 
  Star, 
  Film, 
  Tv, 
  Clock, 
  Calendar, 
  Check, 
  Plus, 
  Share2 
} from 'lucide-react';

export const DetailsModal: React.FC = () => {
  const { 
    detailsMedia, 
    closeDetails, 
    openPlayer, 
    openTrailer, 
    isBookmarked, 
    addBookmark, 
    removeBookmark,
    customGroups,
    createGroup,
    bookmarks
  } = useApp();

  const [enrichedMedia, setEnrichedMedia] = useState<MediaItem | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!detailsMedia) {
      setEnrichedMedia(null);
      setSeasonEpisodes([]);
      return;
    }

    setEnrichedMedia(detailsMedia);
    setSelectedSeason(1);

    const mediaId = detailsMedia.tmdbId || detailsMedia.id;
    if (mediaId && !detailsMedia.cast?.length) {
      if (detailsMedia.type === 'movie') {
        getMovieDetails(mediaId).then(full => {
          if (full) setEnrichedMedia(prev => ({ ...prev!, ...full }));
        }).catch(() => {});
      } else if (detailsMedia.type === 'show' && !detailsMedia.anime) {
        getShowDetails(mediaId).then(full => {
          if (full) setEnrichedMedia(prev => ({ ...prev!, ...full }));
        }).catch(() => {});
      }
    }
  }, [detailsMedia]);

  const activeMedia = enrichedMedia || detailsMedia;
  const seasons = activeMedia?.seasons || [];

  useEffect(() => {
    if (!activeMedia || activeMedia.type !== 'show') return;

    const foundSeason = seasons.find(s => s.number === selectedSeason);
    if (foundSeason?.episodes && foundSeason.episodes.length > 0) {
      setSeasonEpisodes(foundSeason.episodes);
      return;
    }

    const mediaId = activeMedia.tmdbId || activeMedia.id;
    if (mediaId && !activeMedia.anime) {
      setLoadingEpisodes(true);
      getShowSeasonEpisodes(mediaId, selectedSeason)
        .then(eps => {
          setSeasonEpisodes(eps);
        })
        .finally(() => setLoadingEpisodes(false));
    }
  }, [activeMedia, selectedSeason, seasons]);

  if (!detailsMedia || !activeMedia) return null;

  const bookmarked = isBookmarked(activeMedia.id);
  const currentBookmark = bookmarks.find(b => String(b.mediaId) === String(activeMedia.id));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `?media=${activeMedia.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createGroup(newGroupName.trim());
      addBookmark(activeMedia, newGroupName.trim());
      setNewGroupName('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={closeDetails}
    >
      <div 
        className="relative w-full max-w-4xl rounded-none bg-black border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Square Button */}
        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 z-20 p-2 rounded-none bg-black/80 hover:bg-white text-white hover:text-black transition-colors duration-200 border border-white/20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* Header Banner */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-h-[400px] overflow-hidden bg-black">
            <img
              src={activeMedia.backdrop || activeMedia.poster}
              alt={activeMedia.title}
              className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-[0.6]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Action buttons on banner */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  closeDetails();
                  openPlayer(activeMedia, selectedSeason, 1);
                }}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-none bg-white text-black font-bold tracking-wider uppercase text-xs sm:text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Now</span>
              </button>

              {activeMedia.trailerKey && (
                <button
                  onClick={() => openTrailer(activeMedia.trailerKey!)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-none bg-black/80 hover:bg-neutral-900 text-white font-semibold tracking-wider uppercase text-xs sm:text-sm border border-white/20 hover:border-white transition-all cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>Trailer</span>
                </button>
              )}

              {/* Bookmark Toggle */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (bookmarked) {
                      removeBookmark(activeMedia.id);
                    } else {
                      setShowGroupMenu(prev => !prev);
                      addBookmark(activeMedia);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-none border text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    bookmarked
                      ? 'bg-white text-black border-white'
                      : 'bg-black/80 hover:bg-neutral-900 text-white border-white/20 hover:border-white'
                  }`}
                >
                  <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  <span>{bookmarked ? 'Watchlisted' : 'Add to Watchlist'}</span>
                </button>

                {/* Folder Selection Popover (Square) */}
                {showGroupMenu && (
                  <div className="absolute bottom-full mb-2 left-0 w-60 rounded-none bg-black border border-white/20 p-3 shadow-2xl z-30 text-xs font-mono">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider">
                      <span>Organize Folders</span>
                      <button onClick={() => setShowGroupMenu(false)} className="hover:text-white cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 mb-2 max-h-36 overflow-y-auto">
                      {customGroups.map(grp => {
                        const isInGroup = currentBookmark?.groups?.includes(grp);
                        return (
                          <button
                            key={grp}
                            onClick={() => addBookmark(activeMedia, grp)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-none hover:bg-neutral-900 text-left text-neutral-300 hover:text-white cursor-pointer"
                          >
                            <span>{grp}</span>
                            {isInGroup && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={handleCreateGroup} className="flex gap-1.5 pt-1.5 border-t border-white/10">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="New folder..."
                        className="w-full bg-neutral-950 border border-white/20 px-2 py-1 rounded-none text-xs text-white outline-none"
                      />
                      <button type="submit" className="px-2 py-1 bg-white text-black font-bold cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Share Button (Square) */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-none bg-black/80 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-white/20 hover:border-white transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Details Content Info */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mb-2">
                {activeMedia.title}
              </h1>

              {activeMedia.tagline && (
                <p className="text-xs sm:text-sm text-neutral-400 mb-3 font-mono italic">
                  "{activeMedia.tagline}"
                </p>
              )}

              {/* Meta Stats row (Clean unboxed text) */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                {activeMedia.rating && (
                  <span className="flex items-center space-x-1 font-bold text-white bg-black px-2 py-0.5 border border-white/20">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{activeMedia.rating.toFixed(1)}</span>
                    {activeMedia.votes && (
                      <span className="text-neutral-500 text-[10px] font-normal">({activeMedia.votes.toLocaleString()})</span>
                    )}
                  </span>
                )}

                {activeMedia.year && (
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{activeMedia.year}</span>
                  </span>
                )}

                {activeMedia.runtime && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{activeMedia.runtime} MIN</span>
                  </span>
                )}

                {activeMedia.ageRating && (
                  <span className="px-1.5 py-0.5 border border-white/20 text-neutral-300 text-[10px]">
                    {activeMedia.ageRating}
                  </span>
                )}

                {activeMedia.genres && activeMedia.genres.length > 0 && (
                  <div className="flex items-center gap-2">
                    {activeMedia.genres.map((g, i) => (
                      <React.Fragment key={g}>
                        {i > 0 && <span className="text-neutral-600">·</span>}
                        <span className="text-neutral-300">{g}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overview / Story */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white font-mono font-bold mb-2">Synopsis</h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {activeMedia.overview}
              </p>
            </div>

            {/* Cast Member Avatars (Square frames) */}
            {activeMedia.cast && activeMedia.cast.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white font-mono font-bold mb-3">Cast &amp; Characters</h3>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {activeMedia.cast.map(c => (
                    <div key={c.id} className="flex flex-col items-center flex-shrink-0 text-center w-20">
                      <img
                        src={c.profilePath || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'}
                        alt={c.name}
                        className="w-14 h-14 rounded-none object-cover border border-white/20 mb-1.5 filter grayscale"
                      />
                      <span className="text-xs font-semibold text-white leading-tight truncate w-full">{c.name}</span>
                      <span className="text-[10px] text-neutral-500 truncate w-full">{c.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Episode Guide */}
            {activeMedia.type === 'show' && (seasons.length > 0 || seasonEpisodes.length > 0) && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-white flex items-center space-x-2">
                    <Tv className="w-3.5 h-3.5 text-white" />
                    <span>Episodes</span>
                  </h3>

                  {seasons.length > 1 && (
                    <div className="flex items-center space-x-1.5 bg-black p-1 rounded-none border border-white/20 overflow-x-auto scrollbar-none font-mono">
                      {seasons.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSeason(s.number)}
                          className={`px-3 py-1 rounded-none text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            selectedSeason === s.number
                              ? 'bg-white text-black'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          S{s.number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {loadingEpisodes ? (
                  <div className="flex items-center justify-center py-12 space-x-2 text-neutral-400 text-xs font-mono">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                    <span>Loading episodes...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {seasonEpisodes.map(ep => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          closeDetails();
                          openPlayer(activeMedia, ep.seasonNumber, ep.number);
                        }}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2.5 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/10 hover:border-white/40 cursor-pointer transition-all duration-200"
                      >
                        <div className="relative aspect-video w-full sm:w-36 rounded-none overflow-hidden bg-black shrink-0 border border-white/10">
                          <img
                            src={ep.stillPath || activeMedia.backdrop || activeMedia.poster}
                            alt={ep.title}
                            className="w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-current" />
                          </div>
                          <span className="absolute bottom-1 right-1.5 px-1 py-0.5 bg-black text-[9px] font-mono text-white border border-white/20">
                            {ep.duration ? `${ep.duration}m` : '45m'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-white">EP {ep.number}</span>
                            <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                              {ep.title}
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-normal leading-relaxed">
                            {ep.overview || 'No description available for this episode.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
