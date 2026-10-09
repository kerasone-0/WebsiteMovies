interface Env {
  GEMINI_API_KEY?: string;
}

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'Kerasoni Cloudflare Pages Function',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(context.env.GEMINI_API_KEY),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
