import { MediaItem, Season, Episode, CastMember } from '../types/media';
import { CURATED_MEDIA, SAMPLE_STREAMS } from '../data/mediaData';

const TMDB_API_KEY = 'db55323b8d3e4154498498a75642b381';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// In-memory cache to prevent redundant fetches
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

async function fetchFromTMDB(endpoint: string, params: Record<string, string | number> = {}) {
  const query = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  }).toString();

  const url = `${BASE_URL}${endpoint}?${query}`;
  const now = Date.now();
  const cached = cache.get(url);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    const data = await res.json();
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (err) {
    console.warn(`Fetch to TMDB failed: ${url}`, err);
    throw err;
  }
}

export function formatTMDBItem(item: any, forceType?: 'movie' | 'show'): MediaItem {
  const isMovie = forceType === 'movie' || item.media_type === 'movie' || (!item.media_type && !!item.title);
  const type = isMovie ? 'movie' : 'show';
  const title = item.title || item.name || 'Untitled';
  const year = item.release_date || item.first_air_date
    ? new Date(item.release_date || item.first_air_date).getFullYear()
    : undefined;

  const poster = item.poster_path 
    ? `${IMAGE_BASE}/w500${item.poster_path}`
    : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop';
  const backdrop = item.backdrop_path
    ? `${IMAGE_BASE}/original${item.backdrop_path}`
    : poster;

  return {
    id: `tmdb-${type}-${item.id}`,
    tmdbId: item.id,
    title,
    originalTitle: item.original_title || item.original_name,
    type,
    year,
    releaseDate: item.release_date || item.first_air_date,
    poster,
    backdrop,
    overview: item.overview || 'No description available.',
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : undefined,
    votes: item.vote_count,
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : undefined),
    genres: item.genres?.map((g: any) => g.name) || [],
    ageRating: item.adult ? '18+' : undefined,
    status: item.status,
    tagline: item.tagline,
    streamUrl: SAMPLE_STREAMS[Math.abs(item.id % SAMPLE_STREAMS.length)],
  };
}

export async function getTrendingMovies(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/trending/movie/week', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'movie'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'movie');
  }
}

export async function getPopularMovies(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/movie/popular', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'movie'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'movie');
  }
}

export async function getNowPlayingMovies(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/movie/now_playing', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'movie'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'movie');
  }
}

export async function getTopRatedMovies(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/movie/top_rated', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'movie'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'movie');
  }
}

export async function getTrendingShows(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/trending/tv/week', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'show'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime);
  }
}

export async function getPopularShows(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/tv/popular', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'show'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime);
  }
}

export async function getOnTheAirShows(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/tv/on_the_air', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'show'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime);
  }
}

export async function getTopRatedShows(page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/tv/top_rated', { page });
    return res.results.map((item: any) => formatTMDBItem(item, 'show'));
  } catch {
    return CURATED_MEDIA.filter(m => m.type === 'show' && !m.anime);
  }
}

export async function getMediaByGenre(genreId: number, type: 'movie' | 'tv', page = 1): Promise<MediaItem[]> {
  try {
    const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
    const res = await fetchFromTMDB(endpoint, {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page
    });
    return res.results.map((item: any) => formatTMDBItem(item, type === 'movie' ? 'movie' : 'show'));
  } catch {
    return [];
  }
}

export async function getMediaByProvider(providerId: number, type: 'movie' | 'tv', page = 1): Promise<MediaItem[]> {
  try {
    const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
    const res = await fetchFromTMDB(endpoint, {
      with_watch_providers: providerId,
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page
    });
    return res.results.map((item: any) => formatTMDBItem(item, type === 'movie' ? 'movie' : 'show'));
  } catch {
    return [];
  }
}

export async function searchTMDB(query: string, page = 1): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB('/search/multi', { query, page, include_adult: 'false' });
    return res.results
      .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((item: any) => formatTMDBItem(item));
  } catch {
    return [];
  }
}

export async function getMovieDetails(id: number | string): Promise<MediaItem | null> {
  try {
    const numericId = typeof id === 'string' && id.startsWith('tmdb-movie-') ? id.replace('tmdb-movie-', '') : id;
    const res = await fetchFromTMDB(`/movie/${numericId}`, {
      append_to_response: 'credits,videos,recommendations,similar'
    });

    const item = formatTMDBItem(res, 'movie');
    if (res.credits?.cast) {
      item.cast = res.credits.cast.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `${IMAGE_BASE}/w185${c.profile_path}` : undefined,
      }));
    }

    const trailer = res.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    if (trailer) {
      item.trailerKey = trailer.key;
    }

    return item;
  } catch {
    return CURATED_MEDIA.find(m => String(m.id) === String(id) || String(m.tmdbId) === String(id)) || null;
  }
}

export async function getShowDetails(id: number | string): Promise<MediaItem | null> {
  try {
    const numericId = typeof id === 'string' && id.startsWith('tmdb-show-') ? id.replace('tmdb-show-', '') : id;
    const res = await fetchFromTMDB(`/tv/${numericId}`, {
      append_to_response: 'credits,videos,recommendations,similar'
    });

    const item = formatTMDBItem(res, 'show');
    if (res.credits?.cast) {
      item.cast = res.credits.cast.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `${IMAGE_BASE}/w185${c.profile_path}` : undefined,
      }));
    }

    const trailer = res.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    if (trailer) {
      item.trailerKey = trailer.key;
    }

    // Process seasons structure
    if (res.seasons) {
      item.seasons = res.seasons
        .filter((s: any) => s.season_number > 0)
        .map((s: any) => ({
          id: s.id,
          number: s.season_number,
          title: s.name,
          episodes: [] // loaded on demand
        }));
    }

    return item;
  } catch {
    return CURATED_MEDIA.find(m => String(m.id) === String(id) || String(m.tmdbId) === String(id)) || null;
  }
}

export async function getShowSeasonEpisodes(showId: number | string, seasonNumber: number): Promise<Episode[]> {
  try {
    const numericId = typeof showId === 'string' && showId.startsWith('tmdb-show-') 
      ? showId.replace('tmdb-show-', '') 
      : showId;
    const res = await fetchFromTMDB(`/tv/${numericId}/season/${seasonNumber}`);
    
    return res.episodes.map((ep: any) => ({
      id: `ep-${numericId}-s${seasonNumber}-e${ep.episode_number}`,
      number: ep.episode_number,
      seasonNumber,
      title: ep.name,
      overview: ep.overview,
      stillPath: ep.still_path ? `${IMAGE_BASE}/w500${ep.still_path}` : undefined,
      airDate: ep.air_date,
      duration: ep.runtime || 45,
      streamUrl: SAMPLE_STREAMS[Math.abs((ep.id || ep.episode_number) % SAMPLE_STREAMS.length)]
    }));
  } catch {
    return [];
  }
}
