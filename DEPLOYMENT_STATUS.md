# Blossom Market — Railway Deployment Guide

## Services

| Service | Description | Railway |
|---|---|---|
| Recipe Generator Client | React/Vite frontend | Frontend service |
| Recipe Generator Server | Express API backend | Backend service |

---

## Backend Service Environment Variables

Set these in the Railway dashboard under **Recipe Generator Server → Variables**:

| Variable | Required | Example / Notes |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key |
| `OPENAI_BASE_URL` | Optional | Default: `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Optional | Default: `gpt-4o-mini` |
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `ALLOWED_ORIGIN` | ✅ Yes | Your frontend Railway URL, e.g. `https://recipe-generator-client.up.railway.app` |
| `PORT` | Auto | Railway sets this automatically — do not override |

---

## Frontend Service Environment Variables

Set these in the Railway dashboard under **Recipe Generator Client → Variables**:

| Variable | Required | Example / Notes |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Your backend Railway URL, e.g. `https://recipe-generator-server.up.railway.app` |

> **Important:** `VITE_API_URL` must be set at **build time** (not just runtime) because Vite bakes it into the static bundle. Set it in Railway's variable settings before triggering a deploy.

---

## Build Commands

**Frontend (Client):**
- Build command: `npm run build --workspace=client`
- Output directory: `client/dist`
- Start command: serve static files (use `npx serve -s dist` or Railway's static site feature)

**Backend (Server):**
- Build command: `npm run build --workspace=server`
- Start command: `node server/dist/index.js`

---

## Local Development

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env          # fill in OPENAI_API_KEY
cp client/.env.example client/.env.local   # leave VITE_API_URL empty for dev (proxy handles it)

# Start both servers
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001  
Health check: http://localhost:3001/health

In development, Vite proxies all `/api/*` requests to `localhost:3001` automatically — `VITE_API_URL` is not needed locally.

---

## How the API URL Works

| Environment | `VITE_API_URL` | How requests reach the backend |
|---|---|---|
| Development | Not set (empty) | Vite dev-server proxy: `/api/*` → `localhost:3001` |
| Production (Railway) | `https://your-server.up.railway.app` | Direct HTTP: `VITE_API_URL + /api/recipe/generate` |

---

## Known Issues / Checklist

- [ ] Set `OPENAI_API_KEY` in backend service variables
- [ ] Set `NODE_ENV=production` in backend service variables
- [ ] Set `ALLOWED_ORIGIN` to your **frontend** Railway URL in backend variables
- [ ] Set `VITE_API_URL` to your **backend** Railway URL in frontend variables
- [ ] Trigger a new frontend deploy after setting `VITE_API_URL` (Vite bakes it in at build time)
- [ ] Verify backend health: `GET https://your-server.up.railway.app/health`
