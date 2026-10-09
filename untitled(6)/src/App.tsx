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
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CustomizerModal } from './components/CustomizerModal';
import { ToriiGateIcon } from './components/Icons';
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
    customization,
    openCustomizer
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
      {/* Ambient Monochromatic Top Fade with custom toggle */}
      {customization.ambientFade && (
        <div 
          className="ambient-top-fade" 
          style={{ opacity: customization.ambientFadeOpacity * 10 }}
        />
      )}

      {/* 35mm Analog Film Grain Texture (if enabled in Customizer) */}
      {customization.filmGrain && (
        <div 
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-screen bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

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
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-800">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Results for <span className="text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">"{searchQuery}"</span>
              </h2>
              <span className="text-xs text-neutral-400">
                {isSearching ? 'Searching...' : `${sortedSearchResults.length} titles`}
              </span>
            </div>

            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3 text-xs">
                <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <p className="text-neutral-400">Querying global databases...</p>
              </div>
            ) : sortedSearchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400 space-y-4">
                <p className="text-sm font-semibold text-white">No matching titles found for "{searchQuery}"</p>
                <p className="text-xs max-w-sm text-neutral-500">
                  Try checking your spelling, or enter direct IDs like <code className="text-white bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">tmdb:693134</code> or <code className="text-white bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">anilist:154587</code>.
                </p>
                <button
                  onClick={() => openAICurator(searchQuery)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
                    <div className="flex items-center space-x-1.5 overflow-x-auto max-w-xs sm:max-w-md pb-1 scrollbar-none text-xs">
                      <button
                        onClick={() => setSelectedWatchlistGroup('All')}
                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer border ${
                          selectedWatchlistGroup === 'All'
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
                        }`}
                      >
                        All
                      </button>
                      {customGroups.map(grp => (
                        <button
                          key={grp}
                          onClick={() => setSelectedWatchlistGroup(grp)}
                          className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer border ${
                            selectedWatchlistGroup === grp
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
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
                      icon={<Flame className="w-4 h-4 text-amber-500" />}
                      items={trendingMovies.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="In Theatres &amp; Now Playing"
                      icon={<Video className="w-4 h-4 text-blue-400" />}
                      items={nowPlayingMovies.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Top Rated Movies"
                      icon={<Award className="w-4 h-4 text-amber-400" />}
                      items={topRatedMovies.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 2. All or TV Shows View */}
                {(activeCategory === 'all' || activeCategory === 'shows') && (
                  <>
                    <MediaCarousel
                      title="Popular TV Series"
                      icon={<Tv className="w-4 h-4 text-purple-400" />}
                      items={popularShows.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="On The Air"
                      icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                      items={onTheAirShows.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Top Rated Shows"
                      icon={<Award className="w-4 h-4 text-amber-400" />}
                      items={topRatedShows.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 3. All or Anime View */}
                {(activeCategory === 'all' || activeCategory === 'anime') && (
                  <>
                    <MediaCarousel
                      title="Trending Anime"
                      icon={<ToriiGateIcon className="w-4 h-4 text-rose-400" />}
                      items={trendingAnime.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Popular Anime"
                      icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                      items={popularAnime.map(m => ({ media: m }))}
                    />

                    <MediaCarousel
                      title="Highest Rated Anime"
                      icon={<Award className="w-4 h-4 text-amber-400" />}
                      items={topAnime.map(m => ({ media: m }))}
                    />
                  </>
                )}

                {/* 4. Popular on Streaming Providers */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Film className="w-4 h-4 text-white" />
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        Streaming Network Releases
                      </h2>
                    </div>

                    {/* Providers Tabs */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full sm:max-w-md pb-1 scrollbar-none text-xs">
                      {STREAMING_PROVIDERS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleProviderSelect(p.id)}
                          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer border ${
                            selectedProvider === p.id
                              ? 'bg-white text-black border-white font-semibold shadow-sm'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
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
      <GoogleAuthModal />
      <CustomizerModal />

      {/* Clean Modern Footer (No discord, no codeberg, no monochrome edition) */}
      <footer className="mt-auto border-t border-neutral-800 py-8 bg-neutral-950 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="font-bold text-white tracking-wide text-sm">Kerasoni</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400">Cinematic Streaming Experience</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-neutral-400">
            <button onClick={openAbout} className="hover:text-white transition-colors cursor-pointer">
              About &amp; FAQ
            </button>
            <button onClick={openCustomizer} className="hover:text-white transition-colors cursor-pointer">
              Theme &amp; Customization
            </button>
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
