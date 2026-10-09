import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAISuggestions, AISuggestionResult } from '../services/aiCurator';
import { 
  Sparkles, 
  X, 
  Play, 
  Info, 
  Bookmark as BookmarkIcon, 
  Star, 
  ArrowRight,
  Flame,
  Film,
  Tv
} from 'lucide-react';

const PRESET_VIBES = [
  { label: 'Psychological Thriller', prompt: 'Dark psychological thrillers with intense paranoia, high tension, and gripping mind games like Severance or Shutter Island.' },
  { label: 'Cosmic Sci-Fi', prompt: 'Epic, mind-bending cosmic science fiction dealing with deep space, time dilation, and existential stakes like Interstellar or Dune.' },
  { label: 'Philosophical Anime', prompt: 'Bittersweet, emotional and philosophical anime with deep world-building and poignant journeys like Frieren or Cyberpunk: Edgerunners.' },
  { label: 'Witty Dark Drama', prompt: 'Sharp, fast-paced corporate or family dramas with razor-sharp dialogue, ambition, and moral ambiguity like Succession or The Bear.' },
  { label: 'Neo-Noir Mystery', prompt: 'Moody, rain-soaked detective mysteries with cynical protagonists, corruption, and brooding atmosphere like The Batman or Blade Runner.' },
  { label: 'Cozy Escapism', prompt: 'Warm, beautiful, comforting stories filled with wonder and heartfelt characters for a quiet night in.' },
];

export const AICuratorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}> = ({ isOpen, onClose, initialPrompt = '' }) => {
  const { openPlayer, openDetails, isBookmarked, addBookmark, removeBookmark } = useApp();
  
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState<'all' | 'movies' | 'shows' | 'anime'>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AISuggestionResult[]>([]);
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    if (isOpen && initialPrompt) {
      setPrompt(initialPrompt);
      handleSubmit(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const handleSubmit = async (queryText?: string) => {
    const q = (queryText || prompt).trim();
    if (!q) return;

    setLoading(true);
    setHasQueried(true);
    try {
      const suggestions = await getAISuggestions(q, category);
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in font-mono"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-none bg-black border border-white/20 shadow-2xl p-6 sm:p-8 text-white my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/15">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              AI Cinema Curator
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-none text-neutral-400 hover:text-white border border-transparent hover:border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input & Controls Section */}
        <div className="space-y-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 text-xs">
            {(['all', 'movies', 'shows', 'anime'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-none uppercase tracking-wider transition-colors cursor-pointer border ${
                  category === cat
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-black text-neutral-400 hover:text-white border-white/15'
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
                className="w-full bg-neutral-950 border border-white/20 px-4 py-3 rounded-none text-xs text-white placeholder-neutral-600 outline-none focus:border-white transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-3 rounded-none bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 disabled:opacity-40 transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{loading ? 'Curating...' : 'Suggest'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Preset Vibes */}
          {!hasQueried && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Explore Themes &amp; Vibes:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_VIBES.map((pv) => (
                  <button
                    key={pv.label}
                    onClick={() => handlePresetClick(pv.prompt)}
                    className="px-2.5 py-1 text-[11px] rounded-none bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-white/10 hover:border-white/40 transition-colors cursor-pointer"
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
              <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin" />
              <p className="text-xs uppercase tracking-widest">Consulting intelligence &amp; matching databases...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px] text-neutral-500 pb-1 border-b border-white/10 uppercase tracking-wider">
                <span>Recommended Selections</span>
                <span>{results.length} Matches</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(({ media, reason, vibeTag }, idx) => {
                  const bookmarked = isBookmarked(media.id);
                  return (
                    <div 
                      key={media.id || idx}
                      className="group flex gap-3 p-3 rounded-none bg-neutral-950 border border-white/15 hover:border-white/60 transition-all duration-300"
                    >
                      {/* Poster */}
                      <div 
                        onClick={() => {
                          onClose();
                          openDetails(media);
                        }}
                        className="relative w-24 aspect-[2/3] shrink-0 bg-neutral-900 border border-white/10 cursor-pointer overflow-hidden"
                      >
                        <img 
                          src={media.poster} 
                          alt={media.title} 
                          className="w-full h-full object-cover filter grayscale group-hover:filter-none transition-all duration-500"
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
                            <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-neutral-900 px-1.5 py-0.5 border border-white/20 truncate">
                              {vibeTag}
                            </span>
                            {media.rating && (
                              <span className="flex items-center text-[10px] text-white space-x-0.5 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-white text-white" />
                                <span>{media.rating.toFixed(1)}</span>
                              </span>
                            )}
                          </div>

                          <h3 
                            onClick={() => {
                              onClose();
                              openDetails(media);
                            }}
                            className="font-bold text-sm text-white uppercase tracking-wider truncate cursor-pointer hover:underline"
                          >
                            {media.title}
                          </h3>

                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">
                            {media.type === 'movie' ? 'Movie' : media.anime ? 'Anime' : 'Series'} {media.year ? `· ${media.year}` : ''}
                          </p>

                          {/* AI Explanation */}
                          <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-3">
                            {reason}
                          </p>
                        </div>

                        {/* Card actions */}
                        <div className="flex items-center space-x-2 pt-2 mt-2 border-t border-white/10">
                          <button
                            onClick={() => {
                              onClose();
                              openPlayer(media);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded-none bg-white text-black font-bold text-[10px] uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              openDetails(media);
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-none bg-black text-neutral-300 hover:text-white border border-white/20 hover:border-white text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => {
                              if (bookmarked) removeBookmark(media.id);
                              else addBookmark(media);
                            }}
                            className={`p-1 rounded-none border text-[10px] transition-colors ml-auto cursor-pointer ${
                              bookmarked 
                                ? 'bg-white text-black border-white' 
                                : 'bg-black text-neutral-400 hover:text-white border-white/20 hover:border-white'
                            }`}
                            title={bookmarked ? 'Remove' : 'Save'}
                          >
                            <BookmarkIcon className={`w-3 h-3 ${bookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : hasQueried ? (
            <div className="text-center py-16 text-neutral-500 text-xs uppercase tracking-wider">
              No matching recommendations found. Try another query or broader theme.
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-600 text-xs uppercase tracking-wider space-y-1">
              <p>Type your query above or choose a curated aesthetic theme.</p>
              <p className="text-[11px] text-neutral-700">Powered by Gemini 3.8 Flash &amp; P-Stream Index.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
