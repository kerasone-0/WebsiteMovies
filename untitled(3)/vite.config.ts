import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function aiSuggestPlugin(): Plugin {
  return {
    name: 'ai-suggest-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/ai/suggest', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsedBody = JSON.parse(body || '{}');
            const { prompt, category = 'all' } = parsedBody;

            if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Prompt is required' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6J5D8c7KRI8sHV1B8tmbD0lkpJLti9J5s95TDCSXQMznQ";
            const { GoogleGenAI, Type } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            let categoryInstruction = '';
            if (category === 'movies') {
              categoryInstruction = 'Only recommend feature films (movies).';
            } else if (category === 'shows') {
              categoryInstruction = 'Only recommend TV series / episodic shows.';
            } else if (category === 'anime') {
              categoryInstruction = 'Only recommend anime titles (Japanese animation series or films).';
            }

            const systemInstruction = `You are a world-class film critic, cinema historian, and TV/anime curator for P-Stream.
Analyze the user prompt, requested mood, plot hook, or vibe, and recommend 5 to 7 exceptional titles.
${categoryInstruction}
Ensure titles are real, famous or hidden-gem films, series, or anime. Provide accurate release years.`;

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('AI generation timeout')), 4500)
            );

            const aiPromise = ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt.trim(),
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: { type: Type.STRING },
                      year: { type: Type.INTEGER },
                      isAnime: { type: Type.BOOLEAN },
                      reason: { type: Type.STRING },
                      vibeTag: { type: Type.STRING }
                    },
                    required: ['title', 'type', 'year', 'isAnime', 'reason', 'vibeTag']
                  }
                }
              }
            });

            const response: any = await Promise.race([aiPromise, timeoutPromise]);

            const parsed = JSON.parse(response.text?.trim() || '[]');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ suggestions: parsed }));
          } catch (err: any) {
            console.warn('Vite AI endpoint error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to generate recommendations', details: String(err?.message || err) }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiSuggestPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
