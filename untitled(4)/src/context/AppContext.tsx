import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  MediaItem, 
  WatchProgress, 
  Bookmark, 
  UserProfile, 
  SubtitleConfig, 
  WatchPartyState, 
  CustomThemeConfig,
  GoogleUser,
  CustomizationConfig
} from '../types/media';
import { CURATED_MEDIA } from '../data/mediaData';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getNowPlayingMovies, 
  getTopRatedMovies,
  getTrendingShows, 
  getPopularShows, 
  getOnTheAirShows, 
  getTopRatedShows,
  getMediaByProvider,
  searchTMDB 
} from '../services/tmdb';
import { getTrendingAnime, getPopularAnime, getTopAnime, searchAnime } from '../services/anilist';

interface AppContextType {
  // Navigation / views
  activeCategory: 'all' | 'movies' | 'shows' | 'anime';
  setActiveCategory: (cat: 'all' | 'movies' | 'shows' | 'anime') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: MediaItem[];
  isSearching: boolean;
  
  // Dynamic Catalog Sections
  trendingMovies: MediaItem[];
  popularMovies: MediaItem[];
  nowPlayingMovies: MediaItem[];
  topRatedMovies: MediaItem[];
  trendingShows: MediaItem[];
  popularShows: MediaItem[];
  onTheAirShows: MediaItem[];
  topRatedShows: MediaItem[];
  trendingAnime: MediaItem[];
  popularAnime: MediaItem[];
  topAnime: MediaItem[];
  providerMedia: MediaItem[];
  activeProviderId: number;
  setActiveProviderId: (id: number) => void;
  isLoadingCatalog: boolean;

  // Media Collections
  bookmarks: Bookmark[];
  addBookmark: (media: MediaItem, group?: string) => void;
  removeBookmark: (mediaId: string | number) => void;
  isBookmarked: (mediaId: string | number) => boolean;
  createGroup: (name: string) => void;
  customGroups: string[];
  
  // Watch Progress & History
  watchHistory: WatchProgress[];
  updateProgress: (mediaId: string | number, currentTime: number, duration: number, season?: number, episode?: number) => void;
  getProgress: (mediaId: string | number, season?: number, episode?: number) => WatchProgress | undefined;
  removeFromHistory: (mediaId: string | number) => void;
  clearHistory: () => void;

  // Modals & Active Viewers
  detailsMedia: MediaItem | null;
  openDetails: (media: MediaItem) => void;
  closeDetails: () => void;

  trailerKey: string | null;
  openTrailer: (key: string) => void;
  closeTrailer: () => void;

  playerState: {
    isOpen: boolean;
    media: MediaItem | null;
    season: number;
    episode: number;
    initialTime: number;
  };
  openPlayer: (media: MediaItem, season?: number, episode?: number, startTime?: number) => void;
  closePlayer: () => void;

  // Modals
  isSettingsOpen: boolean;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
  settingsTab: string;
  setSettingsTab: (tab: string) => void;

  isAboutOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;

  isWatchPartyOpen: boolean;
  openWatchParty: () => void;
  closeWatchParty: () => void;

  // Google Auth Sign-in
  googleUser: GoogleUser | null;
  isGoogleAuthOpen: boolean;
  openGoogleAuth: () => void;
  closeGoogleAuth: () => void;
  signInWithGoogle: (customInfo?: Partial<GoogleUser>) => Promise<GoogleUser>;
  signOutGoogle: () => void;
  syncGoogleCloudData: () => Promise<void>;
  isCloudSyncing: boolean;
  lastSyncedText: string;

  // Customization
  customization: CustomizationConfig;
  updateCustomization: <K extends keyof CustomizationConfig>(key: K, val: CustomizationConfig[K]) => void;
  isCustomizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;

  // AI Curator
  isAICuratorOpen: boolean;
  openAICurator: (initialPrompt?: string) => void;
  closeAICurator: () => void;
  aiCuratorInitialPrompt: string;

  // Settings & Preferences
  currentTheme: string;
  setTheme: (theme: string) => void;
  customThemes: CustomThemeConfig[];
  saveCustomTheme: (theme: CustomThemeConfig) => void;
  deleteCustomTheme: (id: string) => void;
  activeCustomTheme: CustomThemeConfig | null;
  setActiveCustomTheme: (config: CustomThemeConfig | null) => void;

  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  subtitleConfig: SubtitleConfig;
  updateSubtitleConfig: (config: Partial<SubtitleConfig>) => void;

  watchParty: WatchPartyState;
  updateWatchParty: (state: Partial<WatchPartyState>) => void;
  startHostingWatchParty: (customCode?: string) => string;
  joinWatchParty: (code: string) => boolean;
  leaveWatchParty: () => void;

  preferences: {
    autoplay: boolean;
    skipCredits: boolean;
    autoSkipSegments: boolean;
    showFeatured: boolean;
    showDiscover: boolean;
    minimalCards: boolean;
    carouselView: boolean;
    holdToBoost: boolean;
    doubleClickSeek: boolean;
    contentRegion: string;
    volumeBoost: number;
  };
  updatePreferences: (key: string, val: any) => void;

  // Random item picker
  getRandomMedia: (typeFilter?: string) => MediaItem;
}

const defaultProfile: UserProfile = {
  nickname: 'Guest',
  deviceName: 'Guest Device',
  icon: 'cat',
  colorA: '#5a62eb',
  colorB: '#8288fe',
};

const defaultSubtitles: SubtitleConfig = {
  color: '#ffffff',
  size: 1,
  bold: false,
  backgroundOpacity: 0.35,
  backgroundBlur: true,
  backgroundRadius: 6,
  fontStyle: 'dropShadow',
  delay: 0,
};

const defaultWatchParty: WatchPartyState = {
  enabled: false,
  isHost: false,
  roomCode: null,
  viewerCount: 1,
  isSyncing: false,
  overlayPosition: 'top-left',
  overlayOpacity: 0.65,
  overlayScale: 1,
  showCode: true,
  showViewers: true,
  showSync: true,
};

const defaultCustomization: CustomizationConfig = {
  logoStyle: 'eclipse',
  logoFadeEffect: 'breath',
  logoFadeIntensity: 0.85,
  accentTheme: 'monochrome',
  cardStyle: 'poster',
  ambientFade: true,
  ambientFadeOpacity: 0.08,
  filmGrain: false,
  borderSharpness: 'sharp',
  defaultQuality: '1080p',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Search
  const [activeCategory, setActiveCategory] = useState<'all' | 'movies' | 'shows' | 'anime'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live Catalog State (seeded with curated media)
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'movie'));
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'movie'));
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'movie'));
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'movie'));
  const [trendingShows, setTrendingShows] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime));
  const [popularShows, setPopularShows] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime));
  const [onTheAirShows, setOnTheAirShows] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime));
  const [topRatedShows, setTopRatedShows] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime));
  const [trendingAnime, setTrendingAnime] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.anime));
  const [popularAnime, setPopularAnime] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.anime));
  const [topAnime, setTopAnime] = useState<MediaItem[]>(() => CURATED_MEDIA.filter(m => m.anime));
  const [providerMedia, setProviderMedia] = useState<MediaItem[]>([]);
  const [activeProviderId, setActiveProviderId] = useState<number>(8); // Netflix default
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  // Watchlist & Groups
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('pstream_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { mediaId: 'dune-2', media: CURATED_MEDIA[0], groups: ['Favorites'], addedAt: Date.now() - 500000 },
      { mediaId: 'arcane', media: CURATED_MEDIA[1], groups: ['Favorites'], addedAt: Date.now() - 400000 },
      { mediaId: 'frieren', media: CURATED_MEDIA[2], groups: ['Anime Watchlist'], addedAt: Date.now() - 300000 },
    ];
  });

  const [customGroups, setCustomGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pstream_groups');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['Favorites', 'Anime Watchlist', 'Weekend Binge'];
  });

  // Watch History & Progress
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>(() => {
    try {
      const saved = localStorage.getItem('pstream_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        mediaId: 'arcane',
        seasonNumber: 1,
        episodeNumber: 1,
        currentTime: 1420,
        duration: 2580,
        percentage: 55,
        updatedAt: Date.now() - 120000
      },
      {
        mediaId: 'dune-2',
        currentTime: 4200,
        duration: 9960,
        percentage: 42,
        updatedAt: Date.now() - 450000
      },
      {
        mediaId: 'frieren',
        seasonNumber: 1,
        episodeNumber: 1,
        currentTime: 920,
        duration: 1500,
        percentage: 61,
        updatedAt: Date.now() - 860000
      }
    ];
  });

  // Themes
  const [currentTheme, setCurrentThemeState] = useState<string>(() => {
    try {
      return localStorage.getItem('pstream_theme') || 'default';
    } catch {
      return 'default';
    }
  });

  const [customThemes, setCustomThemes] = useState<CustomThemeConfig[]>(() => {
    try {
      const saved = localStorage.getItem('pstream_custom_themes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [activeCustomTheme, setActiveCustomTheme] = useState<CustomThemeConfig | null>(() => {
    try {
      const saved = localStorage.getItem('pstream_active_custom_theme');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('pstream_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nickname === 'Talin' || parsed.nickname === 'Personal') {
          parsed.nickname = 'Guest';
        }
        return parsed;
      }
    } catch {}
    return defaultProfile;
  });

  // Subtitles
  const [subtitleConfig, setSubtitleConfig] = useState<SubtitleConfig>(() => {
    try {
      const saved = localStorage.getItem('pstream_subtitles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultSubtitles;
  });

  // Watch Party
  const [watchParty, setWatchParty] = useState<WatchPartyState>(() => {
    try {
      const saved = localStorage.getItem('pstream_watch_party');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultWatchParty;
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    autoplay: true,
    skipCredits: true,
    autoSkipSegments: false,
    showFeatured: true,
    showDiscover: true,
    minimalCards: false,
    carouselView: true,
    holdToBoost: true,
    doubleClickSeek: true,
    contentRegion: 'US',
    volumeBoost: 100,
  });

  // Google User & Authentication State
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('kerasoni_google_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Talin' || parsed.givenName === 'Talin') {
          parsed.name = 'Guest';
          parsed.givenName = 'Guest';
          if (parsed.email === 'talin.testing@gmail.com') {
            parsed.email = 'guest@kerasoni.stream';
          }
        }
        return parsed;
      }
    } catch {}
    return null;
  });
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Synced');

  // Customization & Cooler UI State
  const [customization, setCustomization] = useState<CustomizationConfig>(() => {
    try {
      const saved = localStorage.getItem('kerasoni_customization');
      if (saved) return { ...defaultCustomization, ...JSON.parse(saved) };
    } catch {}
    return defaultCustomization;
  });
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync theme colors with customization accent
  useEffect(() => {
    const root = document.documentElement;
    const theme = customization.accentTheme;
    const colorMap: Record<string, { accent: string; rgb: string }> = {
      monochrome: { accent: '#ffffff', rgb: '255 255 255' },
      cyberAmber: { accent: '#f59e0b', rgb: '245 158 11' },
      crimson: { accent: '#ef4444', rgb: '239 68 68' },
      titanium: { accent: '#e2e8f0', rgb: '226 232 240' },
      emerald: { accent: '#10b981', rgb: '16 185 129' },
      violet: { accent: '#8b5cf6', rgb: '139 92 246' },
      cyan: { accent: '#06b6d4', rgb: '6 182 212' },
    };
    const c = colorMap[theme] || colorMap.monochrome;
    root.style.setProperty('--kerasoni-accent', c.accent);
    root.style.setProperty('--colors-themePreview-primary', c.rgb);
    root.style.setProperty('--colors-buttons-primary', c.rgb);
  }, [customization.accentTheme]);

  // Modals state
  const [detailsMedia, setDetailsMedia] = useState<MediaItem | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState(false);
  const [isAICuratorOpen, setIsAICuratorOpen] = useState(false);
  const [aiCuratorInitialPrompt, setAiCuratorInitialPrompt] = useState('');

  const openAICurator = useCallback((initialPrompt = '') => {
    setAiCuratorInitialPrompt(initialPrompt);
    setIsAICuratorOpen(true);
  }, []);

  const closeAICurator = useCallback(() => {
    setIsAICuratorOpen(false);
    setAiCuratorInitialPrompt('');
  }, []);

  // Video Player state
  const [playerState, setPlayerState] = useState<{
    isOpen: boolean;
    media: MediaItem | null;
    season: number;
    episode: number;
    initialTime: number;
  }>({
    isOpen: false,
    media: null,
    season: 1,
    episode: 1,
    initialTime: 0,
  });

  // Load Live Media Catalog from TMDB & AniList on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const [
          tMovies,
          pMovies,
          npMovies,
          trMovies,
          tShows,
          pShows,
          otaShows,
          trShows,
          tAnime,
          pAnime,
          topAn
        ] = await Promise.allSettled([
          getTrendingMovies(),
          getPopularMovies(),
          getNowPlayingMovies(),
          getTopRatedMovies(),
          getTrendingShows(),
          getPopularShows(),
          getOnTheAirShows(),
          getTopRatedShows(),
          getTrendingAnime(),
          getPopularAnime(),
          getTopAnime()
        ]);

        if (!isMounted) return;

        if (tMovies.status === 'fulfilled' && tMovies.value.length > 0) setTrendingMovies(tMovies.value);
        if (pMovies.status === 'fulfilled' && pMovies.value.length > 0) setPopularMovies(pMovies.value);
        if (npMovies.status === 'fulfilled' && npMovies.value.length > 0) setNowPlayingMovies(npMovies.value);
        if (trMovies.status === 'fulfilled' && trMovies.value.length > 0) setTopRatedMovies(trMovies.value);

        if (tShows.status === 'fulfilled' && tShows.value.length > 0) setTrendingShows(tShows.value);
        if (pShows.status === 'fulfilled' && pShows.value.length > 0) setPopularShows(pShows.value);
        if (otaShows.status === 'fulfilled' && otaShows.value.length > 0) setOnTheAirShows(otaShows.value);
        if (trShows.status === 'fulfilled' && trShows.value.length > 0) setTopRatedShows(trShows.value);

        if (tAnime.status === 'fulfilled' && tAnime.value.length > 0) setTrendingAnime(tAnime.value);
        if (pAnime.status === 'fulfilled' && pAnime.value.length > 0) setPopularAnime(pAnime.value);
        if (topAn.status === 'fulfilled' && topAn.value.length > 0) setTopAnime(topAn.value);
      } catch (err) {
        console.warn('Failed loading dynamic catalog, keeping offline seed', err);
      } finally {
        if (isMounted) setIsLoadingCatalog(false);
      }
    }

    loadCatalog();
    return () => { isMounted = false; };
  }, []);

  // Fetch Streaming Provider titles dynamically when provider changes
  useEffect(() => {
    let isMounted = true;
    getMediaByProvider(activeProviderId, 'movie')
      .then(items => {
        if (isMounted && items.length > 0) {
          setProviderMedia(items);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [activeProviderId]);

  // Live Search with Debounce across TMDB and AniList
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayTimer = setTimeout(async () => {
      try {
        const q = searchQuery.trim();
        const [tmdbRes, animeRes] = await Promise.allSettled([
          searchTMDB(q),
          searchAnime(q)
        ]);

        const combined: MediaItem[] = [];
        if (tmdbRes.status === 'fulfilled') combined.push(...tmdbRes.value);
        if (animeRes.status === 'fulfilled') combined.push(...animeRes.value);

        // Deduplicate
        const seen = new Set<string>();
        const unique = combined.filter(item => {
          const key = `${item.type}-${item.tmdbId || item.anilistId || item.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setSearchResults(unique.length > 0 ? unique : CURATED_MEDIA.filter(m => m.title.toLowerCase().includes(q.toLowerCase())));
      } catch (err) {
        console.warn('Live search failed:', err);
        setSearchResults(CURATED_MEDIA.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())));
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('pstream_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_groups', JSON.stringify(customGroups));
    } catch {}
  }, [customGroups]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_history', JSON.stringify(watchHistory));
    } catch {}
  }, [watchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_theme', currentTheme);
      document.body.className = `bg-[#030303] text-white font-sans antialiased theme-${currentTheme}`;
    } catch {}
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_custom_themes', JSON.stringify(customThemes));
    } catch {}
  }, [customThemes]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_active_custom_theme', JSON.stringify(activeCustomTheme));
    } catch {}
  }, [activeCustomTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_subtitles', JSON.stringify(subtitleConfig));
    } catch {}
  }, [subtitleConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('pstream_watch_party', JSON.stringify(watchParty));
    } catch {}
  }, [watchParty]);

  // Actions
  const addBookmark = useCallback((media: MediaItem, group?: string) => {
    setBookmarks(prev => {
      const existing = prev.find(b => String(b.mediaId) === String(media.id));
      if (existing) {
        if (group && !existing.groups.includes(group)) {
          return prev.map(b => String(b.mediaId) === String(media.id) ? { ...b, groups: [...b.groups, group] } : b);
        }
        return prev;
      }
      return [{ mediaId: String(media.id), media, groups: group ? [group] : ['Favorites'], addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((mediaId: string | number) => {
    setBookmarks(prev => prev.filter(b => String(b.mediaId) !== String(mediaId)));
  }, []);

  const isBookmarked = useCallback((mediaId: string | number) => {
    return bookmarks.some(b => String(b.mediaId) !== '' && String(b.mediaId) === String(mediaId));
  }, [bookmarks]);

  const createGroup = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed && !customGroups.includes(trimmed)) {
      setCustomGroups(prev => [...prev, trimmed]);
    }
  }, [customGroups]);

  const updateProgress = useCallback((mediaId: string | number, currentTime: number, duration: number, season = 1, episode = 1) => {
    if (!duration || duration <= 0) return;
    const percentage = Math.min(100, Math.round((currentTime / duration) * 100));
    setWatchHistory(prev => {
      const filtered = prev.filter(p => !(String(p.mediaId) === String(mediaId) && p.seasonNumber === season && p.episodeNumber === episode));
      return [
        {
          mediaId: String(mediaId),
          seasonNumber: season,
          episodeNumber: episode,
          currentTime,
          duration,
          percentage,
          updatedAt: Date.now()
        },
        ...filtered
      ].slice(0, 30);
    });
  }, []);

  const getProgress = useCallback((mediaId: string | number, season?: number, episode?: number) => {
    return watchHistory.find(p => {
      if (String(p.mediaId) !== String(mediaId)) return false;
      if (season !== undefined && p.seasonNumber !== season) return false;
      if (episode !== undefined && p.episodeNumber !== episode) return false;
      return true;
    });
  }, [watchHistory]);

  const removeFromHistory = useCallback((mediaId: string | number) => {
    setWatchHistory(prev => prev.filter(p => String(p.mediaId) !== String(mediaId)));
  }, []);

  const clearHistory = useCallback(() => {
    setWatchHistory([]);
  }, []);

  const openDetails = useCallback((media: MediaItem) => {
    setDetailsMedia(media);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsMedia(null);
  }, []);

  const openTrailer = useCallback((key: string) => {
    setTrailerKey(key);
  }, []);

  const closeTrailer = useCallback(() => {
    setTrailerKey(null);
  }, []);

  const openPlayer = useCallback((media: MediaItem, season = 1, episode = 1, startTime = 0) => {
    const saved = watchHistory.find(p => String(p.mediaId) === String(media.id) && p.seasonNumber === season && p.episodeNumber === episode);
    setPlayerState({
      isOpen: true,
      media,
      season,
      episode,
      initialTime: startTime || (saved?.currentTime ?? 0),
    });
  }, [watchHistory]);

  const closePlayer = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const openSettings = useCallback((tab = 'appearance') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const openAbout = useCallback(() => {
    setIsAboutOpen(true);
  }, []);

  const closeAbout = useCallback(() => {
    setIsAboutOpen(false);
  }, []);

  const openWatchParty = useCallback(() => {
    setIsWatchPartyOpen(true);
  }, []);

  const closeWatchParty = useCallback(() => {
    setIsWatchPartyOpen(false);
  }, []);

  const setTheme = useCallback((theme: string) => {
    setCurrentThemeState(theme);
  }, []);

  const saveCustomTheme = useCallback((theme: CustomThemeConfig) => {
    setCustomThemes(prev => {
      const idx = prev.findIndex(t => t.id === theme.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = theme;
        return next;
      }
      return [...prev, theme];
    });
  }, []);

  const deleteCustomTheme = useCallback((id: string) => {
    setCustomThemes(prev => prev.filter(t => t.id !== id));
    if (activeCustomTheme?.id === id) {
      setActiveCustomTheme(null);
      setCurrentThemeState('default');
    }
  }, [activeCustomTheme]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  }, []);

  const updateSubtitleConfig = useCallback((config: Partial<SubtitleConfig>) => {
    setSubtitleConfig(prev => ({ ...prev, ...config }));
  }, []);

  const updateWatchParty = useCallback((state: Partial<WatchPartyState>) => {
    setWatchParty(prev => ({ ...prev, ...state }));
  }, []);

  const startHostingWatchParty = useCallback((customCode?: string) => {
    const code = customCode && customCode.trim() ? customCode.trim().toUpperCase() : Math.floor(1000 + Math.random() * 9000).toString();
    setWatchParty(prev => ({
      ...prev,
      enabled: true,
      isHost: true,
      roomCode: code,
      viewerCount: 2,
      isSyncing: true,
    }));
    return code;
  }, []);

  const joinWatchParty = useCallback((code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 3) return false;
    setWatchParty(prev => ({
      ...prev,
      enabled: true,
      isHost: false,
      roomCode: trimmed,
      viewerCount: 3,
      isSyncing: true,
    }));
    return true;
  }, []);

  const leaveWatchParty = useCallback(() => {
    setWatchParty(prev => ({
      ...prev,
      enabled: false,
      isHost: false,
      roomCode: null,
      viewerCount: 1,
      isSyncing: false,
    }));
  }, []);

  const updatePreferences = useCallback((key: string, val: any) => {
    setPreferences(prev => ({ ...prev, [key]: val }));
  }, []);

  const openGoogleAuth = useCallback(() => setIsGoogleAuthOpen(true), []);
  const closeGoogleAuth = useCallback(() => setIsGoogleAuthOpen(false), []);

  const openCustomizer = useCallback(() => setIsCustomizerOpen(true), []);
  const closeCustomizer = useCallback(() => setIsCustomizerOpen(false), []);

  const updateCustomization = useCallback(<K extends keyof CustomizationConfig>(key: K, val: CustomizationConfig[K]) => {
    setCustomization(prev => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem('kerasoni_customization', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const signInWithGoogle = useCallback(async (customInfo?: Partial<GoogleUser>): Promise<GoogleUser> => {
    const user: GoogleUser = {
      id: customInfo?.id || 'google_user_' + Date.now(),
      name: customInfo?.name || 'Guest',
      email: customInfo?.email || 'guest@kerasoni.stream',
      picture: customInfo?.picture || '',
      givenName: customInfo?.givenName || 'Guest',
      signedInAt: Date.now(),
      syncEnabled: true,
      lastSyncedAt: Date.now(),
    };

    setGoogleUser(user);
    try {
      localStorage.setItem('kerasoni_google_user', JSON.stringify(user));
    } catch {}

    setUserProfile(prev => ({
      ...prev,
      nickname: user.givenName || user.name.split(' ')[0] || prev.nickname,
    }));

    setIsGoogleAuthOpen(false);
    return user;
  }, []);

  const signOutGoogle = useCallback(() => {
    setGoogleUser(null);
    try {
      localStorage.removeItem('kerasoni_google_user');
    } catch {}
  }, []);

  const syncGoogleCloudData = useCallback(async () => {
    if (!googleUser) return;
    setIsCloudSyncing(true);
    await new Promise(r => setTimeout(r, 650));
    const now = Date.now();
    const updated = { ...googleUser, lastSyncedAt: now };
    setGoogleUser(updated);
    try {
      localStorage.setItem('kerasoni_google_user', JSON.stringify(updated));
      localStorage.setItem(`kerasoni_cloud_backup_${googleUser.id}`, JSON.stringify({
        bookmarks,
        watchHistory,
        preferences,
        customization,
        syncedAt: now,
      }));
    } catch {}
    setIsCloudSyncing(false);
    setLastSyncedText('Just now');
  }, [googleUser, bookmarks, watchHistory, preferences, customization]);

  const getRandomMedia = useCallback((typeFilter?: string): MediaItem => {
    let pool = trendingMovies.concat(trendingShows, trendingAnime);
    if (typeFilter === 'movie') pool = trendingMovies;
    else if (typeFilter === 'show') pool = trendingShows;
    else if (typeFilter === 'anime') pool = trendingAnime;
    return pool[Math.floor(Math.random() * pool.length)] || CURATED_MEDIA[0];
  }, [trendingMovies, trendingShows, trendingAnime]);

  return (
    <AppContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
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
        activeProviderId,
        setActiveProviderId,
        isLoadingCatalog,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        createGroup,
        customGroups,
        watchHistory,
        updateProgress,
        getProgress,
        removeFromHistory,
        clearHistory,
        detailsMedia,
        openDetails,
        closeDetails,
        trailerKey,
        openTrailer,
        closeTrailer,
        playerState,
        openPlayer,
        closePlayer,
        isSettingsOpen,
        openSettings,
        closeSettings,
        settingsTab,
        setSettingsTab,
        isAboutOpen,
        openAbout,
        closeAbout,
        isWatchPartyOpen,
        openWatchParty,
        closeWatchParty,
        isAICuratorOpen,
        openAICurator,
        closeAICurator,
        aiCuratorInitialPrompt,
        googleUser,
        isGoogleAuthOpen,
        openGoogleAuth,
        closeGoogleAuth,
        signInWithGoogle,
        signOutGoogle,
        syncGoogleCloudData,
        isCloudSyncing,
        lastSyncedText,
        customization,
        updateCustomization,
        isCustomizerOpen,
        openCustomizer,
        closeCustomizer,
        currentTheme,
        setTheme,
        customThemes,
        saveCustomTheme,
        deleteCustomTheme,
        activeCustomTheme,
        setActiveCustomTheme,
        userProfile,
        updateUserProfile,
        subtitleConfig,
        updateSubtitleConfig,
        watchParty,
        updateWatchParty,
        startHostingWatchParty,
        joinWatchParty,
        leaveWatchParty,
        preferences,
        updatePreferences,
        getRandomMedia,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
