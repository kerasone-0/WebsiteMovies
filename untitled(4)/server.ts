import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server
  const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6J5D8c7KRI8sHV1B8tmbD0lkpJLti9J5s95TDCSXQMznQ";
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Recommendation Endpoint
  app.post('/api/ai/suggest', async (req, res) => {
    try {
      const { prompt, category = 'all' } = req.body;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      let categoryInstruction = '';
      if (category === 'movies') {
        categoryInstruction = 'Only recommend feature films (movies).';
      } else if (category === 'shows') {
        categoryInstruction = 'Only recommend TV series / episodic shows.';
      } else if (category === 'anime') {
        categoryInstruction = 'Only recommend anime titles (Japanese animation series or films).';
      }

      const systemInstruction = `You are a world-class film critic, cinema historian, and TV/anime curator for Kerasoni.
Analyze the user's taste, requested mood, plot hook, or vibe, and recommend 5 to 7 exceptional titles.
${categoryInstruction}
Ensure titles are real, famous or hidden-gem films, series, or anime. Provide accurate release years.`;

      const response = await ai.models.generateContent({
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
                title: {
                  type: Type.STRING,
                  description: 'The exact official title of the movie, TV series, or anime.',
                },
                type: {
                  type: Type.STRING,
                  description: "Must be either 'movie' or 'show'.",
                },
                year: {
                  type: Type.INTEGER,
                  description: 'The release year of the title.',
                },
                isAnime: {
                  type: Type.BOOLEAN,
                  description: 'True if this is an anime.',
                },
                reason: {
                  type: Type.STRING,
                  description: 'A compelling 1-2 sentence pitch explaining why this matches the requested vibe.',
                },
                vibeTag: {
                  type: Type.STRING,
                  description: 'A 2-4 word stylistic tag (e.g. Neo-Noir Psychological, Mind-Bending Sci-Fi).',
                },
              },
              required: ['title', 'type', 'year', 'isAnime', 'reason', 'vibeTag'],
            },
          },
        },
      });

      const responseText = response.text || '[]';
      const parsed = JSON.parse(responseText.trim());
      res.json({ suggestions: parsed });
    } catch (err: any) {
      console.error('Gemini suggestion API error:', err);
      res.status(500).json({ 
        error: 'Failed to generate recommendations', 
        details: err?.message || String(err) 
      });
    }
  });

  // Setup Vite in development or static serving in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
