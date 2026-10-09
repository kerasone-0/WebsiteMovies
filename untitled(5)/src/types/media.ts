export interface RottenTomatoesInsight {
  tomatometer: number; // percentage 0-100
  audienceScore: number; // percentage 0-100
  certifiedFresh?: boolean;
  totalReviews?: number;
  consensus?: string;
}

export interface MediaItem {
  id: string | number;
  tmdbId?: string | number;
  anilistId?: number;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'show';
  anime?: boolean;
  year?: number;
  releaseDate?: string;
  poster: string;
  backdrop: string;
  overview: string;
  rating?: number;
  votes?: number;
  runtime?: number; // in minutes
  genres?: string[];
  ageRating?: string;
  status?: string;
  tagline?: string;
  cast?: CastMember[];
  seasons?: Season[];
  episodesCount?: number;
  trailerKey?: string; // YouTube video ID
  streamUrl?: string; // playable sample stream
  // Enriched Movie Insights & Rotten Tomatoes
  rottenTomatoes?: RottenTomatoesInsight;
  imdbRating?: number;
  imdbVotes?: number;
  metascore?: number;
  director?: string;
  directors?: string[];
  writers?: string[];
  budget?: string;
  boxOffice?: string;
  awards?: string;
  audioSpecs?: string[];
  aspectRatio?: string;
  trivia?: string[];
  parentalGuidance?: string;
  country?: string;
  language?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Season {
  id: number | string;
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  seasonNumber: number;
  title: string;
  overview: string;
  stillPath?: string;
  airDate?: string;
  duration?: number;
  streamUrl?: string;
}

export interface WatchProgress {
  mediaId: string;
  seasonNumber?: number;
  episodeNumber?: number;
  currentTime: number;
  duration: number;
  percentage: number;
  updatedAt: number;
}

export interface Bookmark {
  mediaId: string;
  media: MediaItem;
  groups: string[];
  addedAt: number;
}

export interface CustomThemeConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface UserProfile {
  nickname: string;
  deviceName: string;
  icon: string;
  colorA: string;
  colorB: string;
}

export interface SubtitleConfig {
  color: string;
  size: number; // 0.75 - 1.5
  bold: boolean;
  backgroundOpacity: number; // 0 - 1
  backgroundBlur: boolean;
  backgroundRadius: number; // 0 - 16
  fontStyle: 'default' | 'dropShadow' | 'border' | 'raised' | 'depressed';
  delay: number; // seconds
}

export interface WatchPartyState {
  enabled: boolean;
  isHost: boolean;
  roomCode: string | null;
  viewerCount: number;
  isSyncing: boolean;
  overlayPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayOpacity: number;
  overlayScale: number;
  showCode: boolean;
  showViewers: boolean;
  showSync: boolean;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  givenName?: string;
  signedInAt: number;
  syncEnabled: boolean;
  lastSyncedAt?: number;
}

export interface CustomizationConfig {
  logoStyle: 'eclipse' | 'horizon' | 'monolith' | 'prism';
  logoFadeEffect: 'breath' | 'shimmer' | 'radiant' | 'clean';
  logoFadeIntensity: number; // 0.2 - 1.0
  accentTheme: 'monochrome' | 'cyberAmber' | 'crimson' | 'titanium' | 'emerald' | 'violet' | 'cyan';
  cardStyle: 'poster' | 'widescreen' | 'minimal';
  ambientFade: boolean;
  ambientFadeOpacity: number; // 0.02 - 0.2
  filmGrain: boolean;
  borderSharpness: 'sharp' | 'soft';
  defaultQuality: '1080p' | '720p' | '4k';
}
