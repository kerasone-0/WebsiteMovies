import { MediaItem } from '../types/media';
import { CURATED_MEDIA, SAMPLE_STREAMS } from '../data/mediaData';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15;

const MEDIA_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  type
  format
  status
  description(asHtml: false)
  startDate {
    year
    month
    day
  }
  season
  seasonYear
  episodes
  duration
  genres
  averageScore
  popularity
  bannerImage
  coverImage {
    extraLarge
    large
    medium
  }
  trailer {
    id
    site
  }
`;

async function fetchAniList(query: string, variables: any = {}) {
  const cacheKey = JSON.stringify({ query, variables });
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) throw new Error(`AniList returned ${res.status}`);
    const json = await res.json();
    cache.set(cacheKey, { data: json.data, timestamp: now });
    return json.data;
  } catch (err) {
    console.warn('AniList fetch failed:', err);
    throw err;
  }
}

export function formatAniListItem(item: any): MediaItem {
  const title = item.title?.english || item.title?.userPreferred || item.title?.romaji || 'Untitled Anime';
  const isMovie = item.format === 'MOVIE';
  const poster = item.coverImage?.extraLarge || item.coverImage?.large || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&fit=crop';
  const backdrop = item.bannerImage || poster;
  const rating = item.averageScore ? Number((item.averageScore / 10).toFixed(1)) : undefined;

  const episodeCount = item.episodes || 12;
  const episodesList = Array.from({ length: Math.min(episodeCount, 24) }, (_, i) => ({
    id: `anime-${item.id}-ep-${i + 1}`,
    number: i + 1,
    seasonNumber: 1,
    title: `Episode ${i + 1}`,
    overview: `Official episode ${i + 1} of ${title}.`,
    stillPath: backdrop,
    duration: item.duration || 24,
    streamUrl: SAMPLE_STREAMS[Math.abs((item.id + i) % SAMPLE_STREAMS.length)]
  }));

  return {
    id: `anilist-${item.id}`,
    anilistId: item.id,
    title,
    originalTitle: item.title?.romaji || item.title?.native,
    type: isMovie ? 'movie' : 'show',
    anime: true,
    year: item.seasonYear || item.startDate?.year,
    poster,
    backdrop,
    overview: item.description?.replace(/<[^>]*>/g, '') || 'No description available.',
    rating,
    votes: item.popularity,
    runtime: item.duration || 24,
    genres: item.genres || [],
    ageRating: 'PG-13',
    status: item.status,
    trailerKey: item.trailer?.site === 'youtube' ? item.trailer.id : undefined,
    streamUrl: SAMPLE_STREAMS[Math.abs(item.id % SAMPLE_STREAMS.length)],
    seasons: isMovie ? undefined : [
      {
        id: 1,
        number: 1,
        title: 'Season 1',
        episodes: episodesList
      }
    ]
  };
}

export async function getTrendingAnime(perPage = 20, page = 1): Promise<MediaItem[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, sort: TRENDING_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  try {
    const data = await fetchAniList(query, { page, perPage });
    return data.Page.media.map(formatAniListItem);
  } catch {
    return CURATED_MEDIA.filter(m => m.anime);
  }
}

export async function getPopularAnime(perPage = 20, page = 1): Promise<MediaItem[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, sort: POPULARITY_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  try {
    const data = await fetchAniList(query, { page, perPage });
    return data.Page.media.map(formatAniListItem);
  } catch {
    return CURATED_MEDIA.filter(m => m.anime);
  }
}

export async function getTopAnime(perPage = 20, page = 1): Promise<MediaItem[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, sort: SCORE_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  try {
    const data = await fetchAniList(query, { page, perPage });
    return data.Page.media.map(formatAniListItem);
  } catch {
    return CURATED_MEDIA.filter(m => m.anime);
  }
}

export async function getTopAnimeMovies(perPage = 20, page = 1): Promise<MediaItem[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, format: MOVIE, sort: SCORE_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  try {
    const data = await fetchAniList(query, { page, perPage });
    return data.Page.media.map(formatAniListItem);
  } catch {
    return [];
  }
}

export async function searchAnime(queryStr: string, perPage = 20): Promise<MediaItem[]> {
  const query = `
    query ($search: String, $perPage: Int) {
      Page (perPage: $perPage) {
        media (type: ANIME, search: $search, sort: SEARCH_MATCH) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  try {
    const data = await fetchAniList(query, { search: queryStr, perPage });
    return data.Page.media.map(formatAniListItem);
  } catch {
    return [];
  }
}
