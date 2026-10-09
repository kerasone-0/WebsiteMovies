import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { curateMediaByVibe } from '../services/aiCurator';
import { MediaItem } from '../types/media';
import { 
  Sparkles, 
  X, 
  Play, 
  Bookmark as BookmarkIcon, 
  Info, 
  Star,
  ArrowRight
} from 'lucide-react';

interface AICuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const PRESET_VIBES = [
  { label: 'Mind-Bending Sci-Fi', prompt: 'Complex reality-bending sci-fi with philosophical themes and incredible visuals' },
  { label: 'Atmospheric Rainy Noir', prompt: 'Dark detective mystery in a neon-lit, moody, raining cyberpunk city' },
  { label: 'High Stakes Mastermind Heist', prompt: 'Clever protagonists executing an impossible high stakes heist with sharp dialogue' },
  { label: 'Quiet Emotional Journey', prompt: 'Contemplative, beautiful, and emotionally profound story about connection and passing time' },
  { label: 'Gritty Tactical Revenge', prompt: 'Relentless action thriller featuring intense tactical combat and anti-heroes' },
  { label: 'Studio Ghibli Whimsy', prompt: 'Wonder-filled, cozy, and magical animated adventure with gorgeous music' }
];

export const AICuratorModal: React.FC<AICuratorModalProps> = ({ isOpen, onClose, initialPrompt = '' }) => {
  const { openPlayer, openDetails, isBookmarked, addBookmark, removeBookmark } = useApp();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState<'all' | 'movies' | 'shows' | 'anime'>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ media: MediaItem; reason: string; vibeTag: string }>>([]);
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleSubmit(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = async (queryToUse?: string) => {
    const q = queryToUse || prompt;
    if (!q.trim()) return;

    setLoading(true);
    setHasQueried(true);
    try {
      const suggestions = await curateMediaByVibe(q, category);
      setResults(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    handleSubmit(presetPrompt);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 sm:p-7 text-white my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              AI Cinema Curator
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input & Controls Section */}
        <div className="space-y-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 text-xs">
            {(['all', 'movies', 'shows', 'anime'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer border font-medium ${
                  category === cat
                    ? 'bg-white text-black border-white font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All Formats' : cat === 'movies' ? 'Movies' : cat === 'shows' ? 'Series' : 'Anime'}
              </button>
            ))}
          </div>

          {/* Prompt Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} 
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a plot hook, emotional mood, aesthetic, or list titles you love..."
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-3 rounded-lg bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 disabled:opacity-40 transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <span>{loading ? 'Curating...' : 'Suggest'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Preset Vibes */}
          {!hasQueried && (
            <div className="space-y-2 pt-1">
              <span className="text-xs text-neutral-400 font-medium block">Explore Themes &amp; Vibes:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_VIBES.map((pv) => (
                  <button
                    key={pv.label}
                    onClick={() => handlePresetClick(pv.prompt)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
                  >
                    + {pv.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-neutral-400">
              <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
              <p className="text-xs text-neutral-300">Consulting intelligence &amp; matching databases...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-neutral-400 pb-1.5 border-b border-neutral-800">
                <span className="font-medium text-white">Recommended Selections</span>
                <span>{results.length} Matches</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(({ media, reason, vibeTag }, idx) => {
                  const bookmarked = isBookmarked(media.id);
                  return (
                    <div 
                      key={media.id || idx}
                      className="group flex gap-3.5 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all duration-200"
                    >
                      {/* Poster */}
                      <div 
                        onClick={() => {
                          onClose();
                          openDetails(media);
                        }}
                        className="relative w-24 aspect-[2/3] shrink-0 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer overflow-hidden"
                      >
                        <img 
                          src={media.poster} 
                          alt={media.title} 
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-current" />
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                        <div>
                          {/* Vibe Tag Header */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[11px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 truncate">
                              {vibeTag}
                            </span>
                            {media.rating && (
                              <span className="flex items-center text-xs text-white space-x-1 shrink-0">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{media.rating.toFixed(1)}</span>
                              </span>
                            )}
                          </div>

                          <h3 
                            onClick={() => {
                              onClose();
                              openDetails(media);
                            }}
                            className="font-semibold text-sm text-white truncate cursor-pointer hover:underline"
                          >
                            {media.title}
                          </h3>

                          <p className="text-xs text-neutral-400 mb-1.5">
                            {media.type === 'movie' ? 'Movie' : media.anime ? 'Anime' : 'Series'} {media.year ? `· ${media.year}` : ''}
                          </p>

                          {/* AI Explanation */}
                          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                            {reason}
                          </p>
                        </div>

                        {/* Card actions */}
                        <div className="flex items-center space-x-2 pt-2.5 mt-2 border-t border-neutral-800">
                          <button
                            onClick={() => {
                              onClose();
                              openPlayer(media);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              openDetails(media);
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs transition-colors cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            <span>Insights</span>
                          </button>

                          <button
                            onClick={() => {
                              if (bookmarked) {
                                removeBookmark(media.id);
                              } else {
                                addBookmark(media);
                              }
                            }}
                            className={`p-1 rounded border transition-colors cursor-pointer ml-auto ${
                              bookmarked 
                                ? 'bg-amber-400 text-black border-amber-400' 
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                            }`}
                            title={bookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                          >
                            <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : hasQueried ? (
            <div className="text-center py-16 text-neutral-400 text-xs">
              No matching recommendations found for this specific query. Try a different mood or description.
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500 text-xs space-y-1">
              <p>Type any phrase, scene, or favorite plot hook above,</p>
              <p>or select a preset theme to let AI curate the optimal film or series for you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
