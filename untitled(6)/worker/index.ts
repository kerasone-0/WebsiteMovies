export interface Fetcher {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export interface ExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

export interface Env {
  ASSETS?: Fetcher;
  GEMINI_API_KEY?: string;
  NODE_ENV?: string;
}

export interface RawAISuggestion {
  title: string;
  type: 'movie' | 'show';
  year: number;
  isAnime: boolean;
  reason: string;
  vibeTag: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 2. Health Check Endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'Kerasoni Cloudflare Worker',
          timestamp: new Date().toISOString(),
          hasGeminiKey: Boolean(env.GEMINI_API_KEY),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 3. AI Recommendations API Endpoint
    if (url.pathname === '/api/ai/suggest') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      return handleAiSuggest(request, env);
    }

    // 4. Unknown /api/ routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'API route not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 5. Serve Static Assets & SPA Routing via Cloudflare Assets Binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Kerasoni Cloudflare Worker running. Dist assets not found.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};

/**
 * Handles /api/ai/suggest requests using Google's Gemini API directly from Cloudflare Worker edge isolates.
 */
async function handleAiSuggest(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { prompt, category = 'all' } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const apiKey = env.GEMINI_API_KEY || "AQ.Ab8RN6J5D8c7KRI8sHV1B8tmbD0lkpJLti9J5s95TDCSXQMznQ";

    let categoryInstruction = '';
    if (category === 'movies') {
      categoryInstruction = 'Only recommend feature films (movies).';
    } else if (category === 'shows') {
      categoryInstruction = 'Only recommend TV series / episodic shows.';
    } else if (category === 'anime') {
      categoryInstruction = 'Only recommend anime titles (Japanese animation series or films).';
    }

    const systemInstruction = `You are a world-class film critic, cinema historian, and TV/anime curator for Kerasoni.
Analyze the user prompt, requested mood, plot hook, or vibe, and recommend 5 to 7 exceptional titles.
${categoryInstruction}
Ensure titles are real, famous or hidden-gem films, series, or anime. Provide accurate release years.`;

    // Standard Gemini 2.5 Flash / 1.5 Flash endpoint using native fetch on the Edge
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const geminiPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt.trim() }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: {
                type: 'STRING',
                description: 'The exact official title of the movie, TV series, or anime.',
              },
              type: {
                type: 'STRING',
                description: "Must be either 'movie' or 'show'.",
              },
              year: {
                type: 'INTEGER',
                description: 'The release year of the title.',
              },
              isAnime: {
                type: 'BOOLEAN',
                description: 'True if this is an anime.',
              },
              reason: {
                type: 'STRING',
                description: 'A compelling 1-2 sentence pitch explaining why this matches the requested vibe.',
              },
              vibeTag: {
                type: 'STRING',
                description: 'A 2-4 word stylistic tag (e.g. Neo-Noir Psychological, Mind-Bending Sci-Fi).',
              },
            },
            required: ['title', 'type', 'year', 'isAnime', 'reason', 'vibeTag'],
          },
        },
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const geminiRes = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'kerasoni-cloudflare-worker',
      },
      body: JSON.stringify(geminiPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API call returned non-200:', geminiRes.status, errText);
      return new Response(
        JSON.stringify({
          error: 'Failed to generate recommendations from AI service',
          status: geminiRes.status,
          suggestions: [],
        }),
        {
          status: 502,
          headers: corsHeaders,
        }
      );
    }

    const geminiData: any = await geminiRes.json();
    const textOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const suggestions: RawAISuggestion[] = JSON.parse(textOutput.trim());

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Worker AI suggestion error:', err);
    return new Response(
      JSON.stringify({
        error: 'Failed to process AI recommendations',
        details: err?.message || String(err),
        suggestions: [],
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
