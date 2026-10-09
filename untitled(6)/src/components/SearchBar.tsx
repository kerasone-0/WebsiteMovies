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
      {/* Category Filter Tabs (Natural Case) */}
      <div className="flex items-center justify-center space-x-2 mb-4 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer font-medium ${
            activeCategory === 'all'
              ? 'bg-white text-neutral-950 border-white font-semibold shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveCategory('movies')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer font-medium ${
            activeCategory === 'movies'
              ? 'bg-white text-neutral-950 border-white font-semibold shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
          }`}
        >
          Movies
        </button>

        <button
          onClick={() => setActiveCategory('shows')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer font-medium ${
            activeCategory === 'shows'
              ? 'bg-white text-neutral-950 border-white font-semibold shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
          }`}
        >
          TV Shows
        </button>

        <button
          onClick={() => setActiveCategory('anime')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer font-medium ${
            activeCategory === 'anime'
              ? 'bg-white text-neutral-950 border-white font-semibold shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
          }`}
        >
          Anime
        </button>

        <button
          onClick={() => openAICurator(searchQuery)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-800 group"
          title="Ask AI to recommend titles by vibe or plot"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Ask AI Curator</span>
        </button>
      </div>

      {/* Main Search Input */}
      <div className="relative group">
        <div className="flex items-center w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus-within:border-neutral-600 shadow-xl transition-all duration-200">
          <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, directors, Rotten Tomatoes favorites, or enter tmdb:123..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm outline-none pr-3"
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick ID Search Helper button */}
          <button
            onClick={() => setShowIdHelp(!showIdHelp)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mr-2 cursor-pointer"
            title="Search tips & direct IDs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sort Selector Dropdown */}
          <div className="relative border-l border-neutral-800 pl-3 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mr-2 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-neutral-300 hover:text-white outline-none cursor-pointer pr-1"
            >
              <option value="relevance" className="bg-neutral-950 text-white">Relevance</option>
              <option value="rating" className="bg-neutral-950 text-white">Top Rated</option>
              <option value="newest" className="bg-neutral-950 text-white">Newest</option>
              <option value="oldest" className="bg-neutral-950 text-white">Oldest</option>
              <option value="title" className="bg-neutral-950 text-white">A-Z</option>
            </select>
          </div>
        </div>

        {/* Search ID Tips Dropdown */}
        {showIdHelp && (
          <div className="absolute top-full mt-2 left-0 right-0 p-4 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl z-40 text-xs text-neutral-300 animate-fade-in font-sans">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-neutral-800">
              <span className="font-semibold text-white">Direct ID Lookup:</span>
              <button onClick={() => setShowIdHelp(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li><code className="text-white bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">tmdb:693134</code> — Jump directly to Dune 2</li>
              <li><code className="text-white bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">tmdb:94605:tv</code> — Jump directly to Arcane</li>
              <li><code className="text-white bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">anilist:154587</code> — Jump directly to Frieren</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
