import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { SearchBar } from './components/SearchBar';
import { MediaCard } from './components/MediaCard';
import { MediaCarousel } from './components/MediaCarousel';
import { DetailsModal } from './components/DetailsModal';
import { TrailerModal } from './components/TrailerModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { WatchPartyModal } from './components/WatchPartyModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { AICuratorModal } from './components/AICuratorModal';
import { STREAMING_PROVIDERS } from './data/mediaData';
import { 
  Bookmark as BookmarkIcon, 
  Clock, 
  TrendingUp, 
  Film, 
  Tv, 
  Sparkles,
  Flame,
  Award,
  Video
} from 'lucide-react';

const PROVIDER_TMDB_MAP: Record<string, number> = {
  netflix: 8,
  apple: 350,
  prime: 9,
  disney: 337,
  max: 1899,
  paramount: 531,
  crunchyroll: 283,
  hulu: 15,
};

const MainContent: React.FC = () => {
  const { 
    searchQuery, 
    searchResults,
    isSearching,
    activeCategory, 
    watchHistory, 
    bookmarks, 
    customGroups,
    removeFromHistory, 
    preferences,
    openAbout,
    isAICuratorOpen,
    openAICurator,
    closeAICurator,
    aiCuratorInitialPrompt,
    trendingMovies,
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    trendingShows,
    popularShows,
    onTheAirShows,
    topRatedShows,
    trendingAnime,
    popularAnime,
    topAnime,
    providerMedia,
    setActiveProviderId,
  } = useApp();

  const [sortBy, setSortBy] = useState('relevance');
  const [selectedWatchlistGroup, setSelectedWatchlistGroup] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState('netflix');

  // Filtered & Sorted Search Results
  const sortedSearchResults = useMemo(() => {
    let list = searchResults;

    if (activeCategory === 'movies') {
      list = list.filter(item => item.type === 'movie');
    } else if (activeCategory === 'shows') {
      list = list.filter(item => item.type === 'show' && !item.anime);
    } else if (activeCategory === 'anime') {
      list = list.filter(item => item.anime);
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'oldest') return (a.year || 0) - (b.year || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchResults, activeCategory, sortBy]);

  // Continue Watching Carousel Items
  const continueWatchingItems = useMemo(() => {
    return watchHistory.map(hist => {
      const allKnown = [...trendingMovies, ...popularMovies, ...trendingShows, ...popularShows, ...trendingAnime];
      const media = allKnown.find(m => String(m.id) === String(hist.mediaId) || String(m.tmdbId) === String(hist.mediaId));
      if (!media) return null;
      return {
        media,
        progressPercent: hist.percentage,
        seasonNumber: hist.seasonNumber,
        episodeNumber: hist.episodeNumber,
        onRemove: () => removeFromHistory(hist.mediaId),
      };
    }).filter(Boolean) as Array<{
      media: any;
      progressPercent?: number;
      seasonNumber?: number;
      episodeNumber?: number;
      onRemove?: () => void;
    }>;
  }, [watchHistory, removeFromHistory, trendingMovies, popularMovies, trendingShows, popularShows, trendingAnime]);

  // Bookmarks / Watchlist Items
  const filteredBookmarkItems = useMemo(() => {
    let list = bookmarks;
    if (selectedWatchlistGroup !== 'All') {
      list = list.filter(b => b.groups?.includes(selectedWatchlistGroup));
    }
    return list.map(b => ({
      media: b.media,
    }));
  }, [bookmarks, selectedWatchlistGroup]);

  // Handle Provider selection change
  const handleProviderSelect = (providerIdStr: string) => {
    setSelectedProvider(providerIdStr);
    const tmdbProvId = PROVIDER_TMDB_MAP[providerIdStr] || 8;
    setActiveProviderId(tmdbProvId);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative selection:bg-white selection:text-black">
      {/* Ambient Monochromatic Top Fade */}
      <div className="ambient-top-fade" />

      {/* Main Header */}
      <Header />

      {/* Main Page Area */}
      <main className="flex-1 pb-20">
        {/* Featured Hero Banner */}
        {!searchQuery && preferences.showFeatured && (
          <HeroCarousel />
        )}

        {/* Global Search Bar */}
        <div className={!searchQuery && !preferences.showFeatured ? 'pt-28' : 'pt-2'}>
          <SearchBar sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* Search Results Display */}
        {searchQuery ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/15">
              <h2 className="text-sm sm:text-base font-bold font-mono tracking-wider uppercase text-white">
                Results for <span className="text-white bg-neutral-900 px-2 py-0.5 border border-white/20">"{searchQuery}"</span>
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {isSearching ? 'SEARCHING...' : `${sortedSearchResults.length} TITLES`}
              </span>
            </div>

            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3 font-mono text-xs">
                <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin" />
                <p className="text-neutral-400">Querying global databases...</p>
              </div>
            ) : sortedSearchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400 space-y-4 font-mono">
                <p className="text-sm font-bold text-white uppercase tracking-wider">No matching titles found for "{searchQuery}"</p>
                <p className="text-xs max-w-sm text-neutral-500">
                  Try checking your spelling, or enter direct IDs like <code className="text-white bg-neutral-900 px-1 py-0.5 border border-white/20">tmdb:693134</code> or <code className="text-white bg-neutral-900 px-1 py-0.5 border border-white/20">anilist:154587</code>.
                </p>
                <button
                  onClick={() => openAICurator(searchQuery)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-none bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI for titles like "{searchQuery}"</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
                {sortedSearchResults.map(media => (
                  <MediaCard key={media.id} media={media} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal Home Browsing Sections */
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
            {/* Continue Watching Section */}
            {continueWatchingItems.length > 0 && (
              <MediaCarousel
                title="Continue Watching"
                icon={<Clock className="w-4 h-4" />}
                items={continueWatchingItems}
                showRemove
              />
            )}

            {/* Watchlist Section with Folder Chips */}
            {bookmarks.length > 0 && (
              <div>
                <MediaCarousel
                  title="Watchlist"
                  icon={<BookmarkIcon className="w-4 h-4" />}
                  items={filteredBookmarkItems}
                  rightAction={
                    <div className="flex items-center space-x-1 overflow-x-auto max-w-xs sm:max-w-md pb-1 scrollbar-none font-mono text-xs">
                      <button
                        onClick={() => setSelectedWatchlistGroup('All')}
                        className={`px-3 py-1 rounded-none uppercase tracking-wider transition-colors cursor-pointer border ${
                          selectedWatchlistGroup === 'All'
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-black text-neutral-400 hover:text-white border-white/20'
                        }`}
                      >
                        All
                      </button>
                      {customGroups.map(grp => (
                        <button
                          key={grp}
                          onClick={() => setSelectedWatchlistGroup(grp)}
                          className={`px-3 py-1 rounded-none uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer border ${
                            selectedWatchlistGroup === grp
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-black text-neutral-400 hover:text-white border-white/20'
                          }`}
                        >
                          {grp}
                        </button>
                      ))}
                    </div>
                  }
                />
              </div>
            )}

            {/* Discover & Catalog Carousels */}
            {preferences.showDiscover && (
              <>
                {/* 1. All or Movies View */}
                {(activeCategory === 'all' || activeCategory === 'movies') && (
                  <>
                    <MediaCarousel
                      title="Trending Movies"
                      icon={<Flame className="w-4 h-4" />}
                      items={trendingMovies.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="In Theatres &amp; Now Playing"
                      icon={<Video className="w-4 h-4" />}
                      items={nowPlayingMovies.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Top Rated Movies"
                      icon={<Award className="w-4 h-4" />}
                      items={topRatedMovies.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 2. All or TV Shows View */}
                {(activeCategory === 'all' || activeCategory === 'shows') && (
                  <>
                    <MediaCarousel
                      title="Popular TV Series"
                      icon={<Tv className="w-4 h-4" />}
                      items={popularShows.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="On The Air"
                      icon={<TrendingUp className="w-4 h-4" />}
                      items={onTheAirShows.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Top Rated Shows"
                      icon={<Award className="w-4 h-4" />}
                      items={topRatedShows.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 3. All or Anime View */}
                {(activeCategory === 'all' || activeCategory === 'anime') && (
                  <>
                    <MediaCarousel
                      title="Trending Anime"
                      icon={<span className="text-sm">⛩️</span>}
                      items={trendingAnime.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Popular Anime"
                      icon={<Sparkles className="w-4 h-4" />}
                      items={popularAnime.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Highest Rated Anime"
                      icon={<Award className="w-4 h-4" />}
                      items={topAnime.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 4. Popular on Streaming Providers */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Film className="w-4 h-4 text-white" />
                      <h2 className="text-sm sm:text-base font-bold font-mono tracking-widest uppercase text-white">
                        Streaming Network Releases
                      </h2>
                    </div>

                    {/* Providers Square Tabs */}
                    <div className="flex items-center space-x-1 overflow-x-auto max-w-full sm:max-w-md pb-1 scrollbar-none font-mono text-xs">
                      {STREAMING_PROVIDERS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleProviderSelect(p.id)}
                          className={`px-3 py-1.5 rounded-none uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer border ${
                            selectedProvider === p.id
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-black text-neutral-400 hover:text-white border-white/20'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <MediaCarousel
                    title=""
                    items={(providerMedia.length > 0 ? providerMedia : popularMovies).map(m => ({ media: m }))}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <DetailsModal />
      <TrailerModal />
      <VideoPlayerModal />
      <WatchPartyModal />
      <SettingsModal />
      <AboutModal />
      <AICuratorModal isOpen={isAICuratorOpen} onClose={closeAICurator} initialPrompt={aiCuratorInitialPrompt} />

      {/* Minimal Monochrome Clean Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 bg-black text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="font-bold text-white tracking-widest uppercase">P-STREAM</span>
            <span>·</span>
            <span>MONOCHROME EDITION</span>
          </div>

          <div className="flex items-center space-x-6 uppercase tracking-wider">
            <button onClick={openAbout} className="hover:text-white transition-colors cursor-pointer">
              About &amp; FAQ
            </button>
            <a href="https://discord.gg/pstream" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="https://codeberg.org/pee" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Codeberg
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
