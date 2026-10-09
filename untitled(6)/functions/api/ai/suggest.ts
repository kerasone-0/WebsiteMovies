interface Env {
  GEMINI_API_KEY?: string;
}

export async function onRequestOptions(): Promise<Response> {
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

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
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
              title: { type: 'STRING' },
              type: { type: 'STRING' },
              year: { type: 'INTEGER' },
              isAnime: { type: 'BOOLEAN' },
              reason: { type: 'STRING' },
              vibeTag: { type: 'STRING' },
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
        'User-Agent': 'kerasoni-cloudflare-pages',
      },
      body: JSON.stringify(geminiPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini Pages API error:', geminiRes.status, errText);
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
    const suggestions = JSON.parse(textOutput.trim());

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Pages AI suggestion error:', err);
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
