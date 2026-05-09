# MogScore.wiki (omoggle-it.com)

## Setup

### 1. Add Environment Variable in Vercel
Settings → Environment Variables:
- Name: `GPTSAPI_KEY`
- Value: your key from gptsapi.net
- Environment: Production + Preview + Development

### 2. Push to GitHub
```bash
git add .
git commit -m "Full site v7 with backend API"
git push
```

### 3. Vercel auto-deploys

## How the AI Tool Works
User uploads photo → browser sends to /api/analyze →
server calls gptsapi.net with hidden key → returns score →
browser shows result. User never sees the API key.

## File Structure
- `api/analyze.js` — serverless backend (key hidden here)
- `tools.html` — no API key input needed
- `css/style.css` — global styles
- `js/components.js` — FAQ toggle
- `images/` — put your images here
- `sitemap.xml` — 36 URLs for Google
- `robots.txt` — search engine rules
- `vercel.json` — Vercel function config
