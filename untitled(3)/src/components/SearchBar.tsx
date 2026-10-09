import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, SlidersHorizontal, HelpCircle, Sparkles } from 'lucide-react';

export const SearchBar: React.FC<{
  sortBy: string;
  setSortBy: (sort: string) => void;
}> = ({ sortBy, setSortBy }) => {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, openAICurator } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showIdHelp, setShowIdHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0 mb-8 relative z-30">
      {/* Category Filter Rectangles (Square & Clean) */}
      <div className="flex items-center justify-center space-x-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-none transition-all duration-300 border cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-white text-black border-white font-bold shadow-sm'
              : 'bg-black text-neutral-400 hover:text-white border-white/20 hover:border-white/50'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveCategory('movies')}
          className={`px-4 py-2 rounded-none transition-all duration-300 border cursor-pointer ${
            activeCategory === 'movies'
              ? 'bg-white text-black border-white font-bold shadow-sm'
              : 'bg-black text-neutral-400 hover:text-white border-white/20 hover:border-white/50'
          }`}
        >
          Movies
        </button>

        <button
          onClick={() => setActiveCategory('shows')}
          className={`px-4 py-2 rounded-none transition-all duration-300 border cursor-pointer ${
            activeCategory === 'shows'
              ? 'bg-white text-black border-white font-bold shadow-sm'
              : 'bg-black text-neutral-400 hover:text-white border-white/20 hover:border-white/50'
          }`}
        >
          TV Shows
        </button>

        <button
          onClick={() => setActiveCategory('anime')}
          className={`px-4 py-2 rounded-none transition-all duration-300 border cursor-pointer ${
            activeCategory === 'anime'
              ? 'bg-white text-black border-white font-bold shadow-sm'
              : 'bg-black text-neutral-400 hover:text-white border-white/20 hover:border-white/50'
          }`}
        >
          Anime
        </button>

        <button
          onClick={() => openAICurator(searchQuery)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-none transition-all duration-300 border cursor-pointer bg-black hover:bg-neutral-900 text-white border-white/20 hover:border-white group"
          title="Ask AI to recommend titles by vibe or plot"
        >
          <Sparkles className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
          <span className="font-bold">Ask AI</span>
        </button>
      </div>

      {/* Main Square Search Input */}
      <div className="relative group">
        <div className="flex items-center w-full px-4 py-3 rounded-none bg-black border border-white/20 focus-within:border-white shadow-xl transition-all duration-300">
          <Search className="w-4 h-4 text-white mr-3 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, directors, genres, or enter tmdb:123..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm outline-none pr-3"
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-none text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick ID Search Helper button */}
          <button
            onClick={() => setShowIdHelp(!showIdHelp)}
            className="p-1 rounded-none text-neutral-400 hover:text-white transition-colors mr-2 cursor-pointer"
            title="Search tips & direct IDs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sort Selector Dropdown */}
          <div className="relative border-l border-white/20 pl-3 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mr-2 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-wider font-mono text-neutral-300 hover:text-white outline-none cursor-pointer pr-1"
            >
              <option value="relevance" className="bg-black text-white">Relevance</option>
              <option value="rating" className="bg-black text-white">Top Rated</option>
              <option value="newest" className="bg-black text-white">Newest</option>
              <option value="oldest" className="bg-black text-white">Oldest</option>
              <option value="title" className="bg-black text-white">A-Z</option>
            </select>
          </div>
        </div>

        {/* Search ID Tips Dropdown */}
        {showIdHelp && (
          <div className="absolute top-full mt-2 left-0 right-0 p-4 rounded-none bg-black border border-white/20 shadow-2xl z-40 text-xs text-neutral-300 animate-fade-in font-mono">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/10">
              <span className="font-bold text-white uppercase tracking-wider">Direct ID Lookup:</span>
              <button onClick={() => setShowIdHelp(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li><code className="text-white bg-neutral-900 px-1 py-0.5 border border-white/20">tmdb:693134</code> — Jump to movie</li>
              <li><code className="text-white bg-neutral-900 px-1 py-0.5 border border-white/20">tmdb:94605:tv</code> — Jump to TV show</li>
              <li><code className="text-white bg-neutral-900 px-1 py-0.5 border border-white/20">anilist:154587</code> — Jump to anime</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
