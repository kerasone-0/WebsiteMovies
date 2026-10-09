# Deploying Kerasoni to Cloudflare Workers

This guide will walk you through deploying **Kerasoni** to **Cloudflare Workers** (with Static Assets) or **Cloudflare Pages**.

---

## Architecture Overview

Kerasoni is built with a modern edge architecture:
- **Frontend**: High-performance React + Tailwind CSS single-page application served from Cloudflare's global edge network via Cloudflare Assets.
- **Backend Edge Worker (`worker/index.ts`)**: Serverless function handling the AI film recommendation API (`/api/ai/suggest`), health checks (`/api/health`), and client routing fallbacks without cold starts.
- **Pages Functions fallback (`functions/api/*`)**: Automatically works if you deploy using Cloudflare Pages Git integration.

---

## Method 1: Deploy with Wrangler CLI (Recommended)

This is the fastest method (takes less than 2 minutes).

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 2: Log into Cloudflare
Authenticate your computer with your Cloudflare account:
```bash
npx wrangler login
```
*A browser window will open asking you to authorize Wrangler. Click **Allow**.*

### Step 3: (Optional) Set your Gemini API Key
If you want the AI movie curator feature enabled on your custom deployment, set your Google Gemini API key as an encrypted secret:
```bash
npx wrangler secret put GEMINI_API_KEY
```
*Paste your API key when prompted and press Enter.*

*(If you skip this step, Kerasoni will use its built-in fallback curator key).*

### Step 4: Build and Deploy
Run the deployment command:
```bash
npm run deploy
```
*(Or `npm run worker:deploy`)*

Wrangler will:
1. Build the Vite production bundle into `./dist`
2. Bundle the edge worker in `./worker/index.ts`
3. Upload static assets to Cloudflare's edge cache
4. Output your live URL, for example:
   ```
   https://kerasoni.<your-subdomain>.workers.dev
   ```

---

## Method 2: Deploy with Cloudflare Dashboard (GitHub Integration)

If you prefer deploying automatically on every `git push`:

1. Push your code to a **GitHub** or **GitLab** repository.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
4. Select your repository and configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Environment variables (advanced)**, click **Add variable**:
   - Variable name: `GEMINI_API_KEY`
   - Value: *(Your Gemini API key)*
6. Click **Save and Deploy**. Cloudflare Pages will build the site and deploy your functions automatically.

---

## Local Development with Cloudflare Worker Simulator

To test how your app runs locally inside Cloudflare's edge runtime before deploying:

```bash
# 1. Build the frontend
npm run build

# 2. Start Wrangler local edge preview
npm run worker:dev
```
Your worker will start at `http://localhost:8787`.

---

## Verifying Your Deployment

Once deployed, you can verify your service:
1. **Health Check**:
   Open `https://<your-worker-url>/api/health` in your browser. You should see:
   ```json
   {
     "status": "ok",
     "service": "Kerasoni Cloudflare Worker",
     "timestamp": "2026-10-09T...",
     "hasGeminiKey": true
   }
   ```
2. **Main Application**:
   Open `https://<your-worker-url>` to watch movies, anime, and shows.
3. **AI Curator**:
   Try searching with natural language (e.g. *"dark 90s thriller with a twist"*).

---

## Adding a Custom Domain

1. In the Cloudflare Dashboard, go to **Workers & Pages**.
2. Select your `kerasoni` worker.
3. Click the **Settings** tab > **Domains & Routes**.
4. Click **Add** > **Custom Domain** (e.g., `watch.yourdomain.com`).
5. Cloudflare will automatically configure DNS records and issue a free SSL certificate.

---

## File Reference

- `wrangler.jsonc` & `wrangler.toml`: Cloudflare Worker configuration with Assets binding.
- `worker/index.ts`: Worker entry point for edge API routing and asset resolution.
- `functions/api/`: Cloudflare Pages Functions compatible endpoints.
- `public/_redirects`: SPA routing rule (`/* /index.html 200`).
- `public/_headers`: Edge cache and security headers.
