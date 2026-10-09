import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getMovieDetails, getShowDetails, getShowSeasonEpisodes } from '../services/tmdb';
import { MediaItem, Episode } from '../types/media';
import { RatingBadges } from './RatingBadges';
import { TomatoIcon } from './Icons';
import { 
  X, 
  Play, 
  Bookmark as BookmarkIcon, 
  Film, 
  Tv, 
  Clock, 
  Calendar, 
  Check, 
  Plus, 
  Share2,
  Sparkles,
  Award,
  DollarSign,
  Clapperboard,
  ShieldAlert,
  Lightbulb,
  Headphones,
  Maximize2
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
    bookmarks,
    openAICurator
  } = useApp();

  const [enrichedMedia, setEnrichedMedia] = useState<MediaItem | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'cast' | 'episodes'>('overview');

  useEffect(() => {
    if (!detailsMedia) {
      setEnrichedMedia(null);
      setSeasonEpisodes([]);
      return;
    }

    setEnrichedMedia(detailsMedia);
    setSelectedSeason(1);
    setActiveTab('overview');

    const mediaId = detailsMedia.tmdbId || detailsMedia.id;
    if (mediaId && (!detailsMedia.cast?.length || !detailsMedia.director)) {
      if (detailsMedia.type === 'movie') {
        getMovieDetails(mediaId).then(full => {
          if (full) {
            setEnrichedMedia(prev => ({ 
              ...prev!, 
              ...full,
              // Retain curated Rotten Tomatoes & trivia if already present
              rottenTomatoes: prev?.rottenTomatoes || full.rottenTomatoes,
              trivia: prev?.trivia || full.trivia,
              budget: prev?.budget || full.budget,
              boxOffice: prev?.boxOffice || full.boxOffice,
              awards: prev?.awards || full.awards,
            }));
          }
        }).catch(() => {});
      } else if (detailsMedia.type === 'show' && !detailsMedia.anime) {
        getShowDetails(mediaId).then(full => {
          if (full) {
            setEnrichedMedia(prev => ({ 
              ...prev!, 
              ...full,
              rottenTomatoes: prev?.rottenTomatoes || full.rottenTomatoes,
              trivia: prev?.trivia || full.trivia,
              awards: prev?.awards || full.awards,
            }));
          }
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

  const rt = activeMedia.rottenTomatoes;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={closeDetails}
    >
      <div 
        className="relative w-full max-w-4xl rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-white text-white hover:text-black transition-colors duration-200 border border-white/20 cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* Header Backdrop Banner */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-h-[380px] overflow-hidden bg-neutral-900">
            <img
              src={activeMedia.backdrop || activeMedia.poster}
              alt={activeMedia.title}
              className="w-full h-full object-cover object-center filter contrast-105 brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            
            {/* Quick Ratings Badge overlay on top left */}
            <div className="absolute top-4 left-4 z-20">
              <RatingBadges 
                rottenTomatoes={activeMedia.rottenTomatoes}
                imdbRating={activeMedia.imdbRating}
                metascore={activeMedia.metascore}
                tmdbRating={activeMedia.rating}
                size="sm"
              />
            </div>

            {/* Action buttons on banner bottom */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  closeDetails();
                  openPlayer(activeMedia, selectedSeason, 1);
                }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer shadow-xl"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Now</span>
              </button>

              {activeMedia.trailerKey && (
                <button
                  onClick={() => openTrailer(activeMedia.trailerKey!)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-white font-medium text-sm border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer"
                >
                  <Film className="w-4 h-4 text-neutral-300" />
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
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                    bookmarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  <span>{bookmarked ? 'Watchlisted' : 'Add to Watchlist'}</span>
                </button>

                {/* Folder Selection Popover */}
                {showGroupMenu && (
                  <div className="absolute bottom-full mb-2 left-0 w-64 rounded-xl bg-neutral-900 border border-neutral-700 p-3 shadow-2xl z-40 text-xs font-sans">
                    <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-neutral-800 text-neutral-400 font-semibold">
                      <span>Organize in Folders</span>
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
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 text-left text-neutral-300 hover:text-white cursor-pointer"
                          >
                            <span>{grp}</span>
                            {isInGroup && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={handleCreateGroup} className="flex gap-1.5 pt-1.5 border-t border-neutral-800">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="New folder name..."
                        className="w-full bg-neutral-950 border border-neutral-700 px-2 py-1 rounded text-xs text-white outline-none focus:border-neutral-500"
                      />
                      <button type="submit" className="px-2.5 py-1 bg-white text-black font-semibold rounded cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Ask AI to find similar */}
              <button
                onClick={() => {
                  closeDetails();
                  openAICurator(`Find movies and shows similar to "${activeMedia.title}" (${activeMedia.year || ''})`);
                }}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors text-xs font-medium cursor-pointer"
                title="Curate similar titles with AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Similar Vibe</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors text-xs font-medium cursor-pointer ml-auto"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Title & Core Metadata */}
          <div className="p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  {activeMedia.title}
                </h1>
                {activeMedia.originalTitle && activeMedia.originalTitle !== activeMedia.title && (
                  <span className="text-xs text-neutral-400 italic">
                    Original: {activeMedia.originalTitle}
                  </span>
                )}
              </div>

              {activeMedia.tagline && (
                <p className="text-sm text-neutral-400 italic mb-3">
                  "{activeMedia.tagline}"
                </p>
              )}

              {/* Clean Chips Row (Natural Case) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-medium">
                  {activeMedia.type === 'movie' ? 'Movie' : activeMedia.anime ? 'Anime' : 'Series'}
                </span>

                {activeMedia.year && (
                  <span className="flex items-center space-x-1 text-neutral-400">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{activeMedia.year}</span>
                  </span>
                )}

                {activeMedia.runtime && (
                  <span className="flex items-center space-x-1 text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{activeMedia.runtime} min</span>
                  </span>
                )}

                {activeMedia.ageRating && (
                  <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px] font-mono">
                    {activeMedia.ageRating}
                  </span>
                )}

                {activeMedia.genres && activeMedia.genres.length > 0 && (
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span>·</span>
                    {activeMedia.genres.map((g, i) => (
                      <React.Fragment key={g}>
                        {i > 0 && <span className="text-neutral-600">·</span>}
                        <span className="hover:text-white transition-colors">{g}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rotten Tomatoes & Ratings Showcase Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-inner">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">Scores & Critical Reception</span>
                  <span className="text-[11px] text-neutral-400 font-normal">Verified Tomatometer & Audience</span>
                </div>
                <RatingBadges 
                  rottenTomatoes={activeMedia.rottenTomatoes}
                  imdbRating={activeMedia.imdbRating}
                  metascore={activeMedia.metascore}
                  tmdbRating={activeMedia.rating}
                  size="md"
                />
              </div>

              {/* Critics Consensus Quote */}
              {rt?.consensus && (
                <div className="mt-3.5 flex items-start space-x-3 text-xs sm:text-sm text-neutral-300">
                  <TomatoIcon 
                    status={rt.certifiedFresh ? 'certified' : rt.tomatometer >= 60 ? 'fresh' : 'rotten'} 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                  />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-white">Rotten Tomatoes Critics Consensus: </span>
                    <span className="text-neutral-300 italic">"{rt.consensus}"</span>
                    {rt.totalReviews && (
                      <span className="block text-[11px] text-neutral-500 mt-1 not-italic">
                        Based on {rt.totalReviews} reviews curated across certified critics.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs (Natural clean case) */}
            <div className="flex items-center space-x-2 border-b border-neutral-800 text-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Overview & Story
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'insights'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Movie Insights</span>
              </button>

              {activeMedia.cast && activeMedia.cast.length > 0 && (
                <button
                  onClick={() => setActiveTab('cast')}
                  className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'cast'
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Cast & Characters
                </button>
              )}

              {activeMedia.type === 'show' && (seasons.length > 0 || seasonEpisodes.length > 0) && (
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 flex items-center space-x-1.5 ${
                    activeTab === 'episodes'
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Episodes</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Synopsis</h3>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                    {activeMedia.overview}
                  </p>
                </div>

                {/* Director & Writers Quick Row */}
                {(activeMedia.director || activeMedia.writers?.length) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs">
                    {activeMedia.director && (
                      <div>
                        <span className="text-neutral-400 block mb-0.5">Director</span>
                        <span className="font-semibold text-white text-sm">{activeMedia.director}</span>
                      </div>
                    )}
                    {activeMedia.writers && activeMedia.writers.length > 0 && (
                      <div>
                        <span className="text-neutral-400 block mb-0.5">Writers & Screenplay</span>
                        <span className="font-semibold text-white text-sm">{activeMedia.writers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Technology Specs Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-neutral-500 font-medium">Stream Formats:</span>
                  {(activeMedia.audioSpecs || ['4K Ultra HD', 'Dolby Vision', 'Dolby Atmos', 'HDR10']).map((spec) => (
                    <span 
                      key={spec} 
                      className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px] font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Deep Movie Insights */}
            {activeTab === 'insights' && (
              <div className="space-y-6 animate-fade-in">
                {/* Insights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Director / Creator */}
                  {activeMedia.director && (
                    <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                        <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Director / Creators</span>
                      </div>
                      <p className="text-sm font-semibold text-white">{activeMedia.director}</p>
                    </div>
                  )}

                  {/* Box Office */}
                  {activeMedia.boxOffice && (
                    <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Box Office Gross</span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-300">{activeMedia.boxOffice}</p>
                      {activeMedia.budget && (
                        <span className="text-[11px] text-neutral-400">Budget: {activeMedia.budget}</span>
                      )}
                    </div>
                  )}

                  {/* Awards */}
                  {activeMedia.awards && (
                    <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Awards & Recognition</span>
                      </div>
                      <p className="text-sm font-medium text-amber-200">{activeMedia.awards}</p>
                    </div>
                  )}

                  {/* Aspect Ratio & Video Specs */}
                  <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                    <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Aspect Ratio & Camera</span>
                    </div>
                    <p className="text-sm font-medium text-white">{activeMedia.aspectRatio || '2.39:1 Anamorphic Widescreen'}</p>
                    <span className="text-[11px] text-neutral-400">Mastered for high-dynamic range displays</span>
                  </div>

                  {/* Audio Specifications */}
                  <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                    <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                      <Headphones className="w-3.5 h-3.5 text-purple-400" />
                      <span>Audio Engineering</span>
                    </div>
                    <p className="text-sm font-medium text-white">Dolby Atmos / 5.1 Surround</p>
                    <span className="text-[11px] text-neutral-400">Spatial multi-channel cinema mix</span>
                  </div>

                  {/* Country & Language */}
                  {(activeMedia.country || activeMedia.language) && (
                    <div className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800">
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Country & Language</span>
                      </div>
                      <p className="text-sm font-medium text-white">{activeMedia.country || 'Global'}</p>
                      <span className="text-[11px] text-neutral-400">{activeMedia.language || 'English'}</span>
                    </div>
                  )}
                </div>

                {/* Parental Guidance advisory */}
                {activeMedia.parentalGuidance && (
                  <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-start space-x-3 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block mb-0.5">Content Advisory & Rating Guide:</span>
                      <p className="text-neutral-300 leading-relaxed">{activeMedia.parentalGuidance}</p>
                    </div>
                  </div>
                )}

                {/* Behind the scenes Trivia */}
                {activeMedia.trivia && activeMedia.trivia.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide flex items-center space-x-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Behind the Scenes & Trivia</span>
                    </h4>
                    <div className="space-y-2">
                      {activeMedia.trivia.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 text-xs sm:text-sm text-neutral-300 leading-relaxed flex items-start space-x-2.5">
                          <span className="text-amber-400 font-bold font-mono text-xs mt-0.5">{idx + 1}.</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Cast & Characters */}
            {activeTab === 'cast' && activeMedia.cast && activeMedia.cast.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Key Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {activeMedia.cast.map(c => (
                    <div key={c.id} className="flex items-center space-x-3 p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
                      <img
                        src={c.profilePath || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'}
                        alt={c.name}
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white leading-tight block truncate">{c.name}</span>
                        <span className="text-[11px] text-neutral-400 leading-tight block truncate">{c.character}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Episodes Guide (For TV Series) */}
            {activeTab === 'episodes' && activeMedia.type === 'show' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Select Season</span>
                  {seasons.length > 1 && (
                    <div className="flex items-center space-x-1.5 bg-neutral-900 p-1 rounded-lg border border-neutral-800 overflow-x-auto scrollbar-none">
                      {seasons.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSeason(s.number)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                            selectedSeason === s.number
                              ? 'bg-white text-neutral-950 font-semibold shadow'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Season {s.number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {loadingEpisodes ? (
                  <div className="flex items-center justify-center py-12 space-x-2 text-neutral-400 text-xs font-mono">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
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
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer transition-all duration-200"
                      >
                        <div className="relative aspect-video w-full sm:w-36 rounded-md overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                          <img
                            src={ep.stillPath || activeMedia.backdrop || activeMedia.poster}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-current" />
                          </div>
                          <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[10px] text-white">
                            {ep.duration ? `${ep.duration}m` : '45m'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-amber-400">Episode {ep.number}</span>
                            <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                              {ep.title}
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                            {ep.overview || 'No episode description available.'}
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
