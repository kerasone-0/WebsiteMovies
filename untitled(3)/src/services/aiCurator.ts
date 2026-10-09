import { MediaItem } from '../types/media';
import { searchTMDB } from './tmdb';
import { searchAnime } from './anilist';
import { CURATED_MEDIA } from '../data/mediaData';

export interface AISuggestionResult {
  media: MediaItem;
  reason: string;
  vibeTag: string;
}

export interface RawAISuggestion {
  title: string;
  type: 'movie' | 'show';
  year: number;
  isAnime: boolean;
  reason: string;
  vibeTag: string;
}

export async function getAISuggestions(
  prompt: string, 
  category: 'all' | 'movies' | 'shows' | 'anime' = 'all'
): Promise<AISuggestionResult[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, category }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    const suggestions: RawAISuggestion[] = data.suggestions || [];

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return await getSmartFallbackSuggestions(prompt, category);
    }

    // Concurrently resolve each suggested title to real TMDB / AniList media items
    const resolved = await Promise.allSettled(
      suggestions.map(async (sug) => {
        let matchedMedia: MediaItem | null = null;

        if (sug.isAnime) {
          try {
            const animeResults = await searchAnime(sug.title);
            if (animeResults.length > 0) {
              matchedMedia = animeResults[0];
            }
          } catch {}
        }

        if (!matchedMedia) {
          try {
            const tmdbResults = await searchTMDB(sug.title);
            if (tmdbResults.length > 0) {
              const filtered = tmdbResults.filter(item => item.type === (sug.type === 'movie' ? 'movie' : 'show'));
              matchedMedia = filtered[0] || tmdbResults[0];
            }
          } catch {}
        }

        // If not found in remote API, check local curated database or synthesize a clean item
        if (!matchedMedia) {
          matchedMedia = CURATED_MEDIA.find(m => m.title.toLowerCase().includes(sug.title.toLowerCase())) || {
            id: `ai-${sug.type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: sug.title,
            type: sug.type,
            year: sug.year,
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop',
            backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&auto=format&fit=crop',
            overview: sug.reason,
            genres: [sug.vibeTag],
            anime: sug.isAnime,
            rating: 8.5,
          };
        }

        return {
          media: matchedMedia,
          reason: sug.reason,
          vibeTag: sug.vibeTag,
        };
      })
    );

    const successful = resolved
      .filter((r): r is PromiseFulfilledResult<AISuggestionResult> => r.status === 'fulfilled')
      .map(r => r.value);

    return successful.length > 0 ? successful : await getSmartFallbackSuggestions(prompt, category);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('AI suggestions error, falling back to local curation:', err);
    return await getSmartFallbackSuggestions(prompt, category);
  }
}

async function getSmartFallbackSuggestions(prompt: string, category: string): Promise<AISuggestionResult[]> {
  const p = prompt.toLowerCase();
  
  // 1. Try a live search query if prompt contains specific title keywords
  try {
    const liveItems = await searchTMDB(prompt.slice(0, 40));
    if (liveItems && liveItems.length > 0) {
      let filtered = liveItems;
      if (category === 'movies') filtered = filtered.filter(m => m.type === 'movie');
      else if (category === 'shows') filtered = filtered.filter(m => m.type === 'show');

      if (filtered.length > 0) {
        return filtered.slice(0, 6).map((item, i) => ({
          media: item,
          reason: `Matches your interest in "${prompt}". Features standout pacing, atmospheric cinematography, and critical acclaim.`,
          vibeTag: item.genres?.[0] ? `${item.genres[0]} Spotlight` : (i % 2 === 0 ? 'Director Cut' : 'Curator Pick'),
        }));
      }
    }
  } catch {}

  // 2. Fall back to curated library pool
  let pool = CURATED_MEDIA;
  if (category === 'movies') pool = pool.filter(m => m.type === 'movie');
  else if (category === 'shows') pool = pool.filter(m => m.type === 'show');
  else if (category === 'anime') pool = pool.filter(m => m.anime);

  const matched = pool.filter(m => 
    m.title.toLowerCase().includes(p) || 
    m.overview.toLowerCase().includes(p) ||
    m.genres?.some(g => p.includes(g.toLowerCase()))
  );

  const picks = matched.length > 0 ? matched : pool.slice(0, 6);

  const vibeTags = [
    'Neo-Noir Psychological',
    'Mind-Bending Narrative',
    'Atmospheric Masterpiece',
    'Existential Depth',
    'Aesthetic Excellence',
    'Cult Classic',
  ];

  return picks.map((item, idx) => ({
    media: item,
    reason: `Selected for themes mirroring "${prompt}". Renowned for remarkable sound design, storytelling, and unforgettable sequences.`,
    vibeTag: item.genres?.[0] ? `${item.genres[0]} Highlight` : vibeTags[idx % vibeTags.length],
  }));
}
