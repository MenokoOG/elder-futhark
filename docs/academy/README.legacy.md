# Elder Futhark Academy (Pure MERN)



This repo is intentionally **not** a monorepo. It has two folders:

- `server/` – Node + Express + MongoDB (Mongoose) API
- `client/` – React + Vite (JSX) web app

## Quick start (local)

### 1) Server
```bash
cd server
cp .env.example .env
# fill MONGODB_URI + JWT_SECRET
pnpm i
pnpm dev
pnpm seed   # first time only (loads runes)
```

Server runs on `http://localhost:4000` by default.

### 2) Client
```bash
cd client
cp .env.example .env
# set VITE_API_BASE_URL=http://localhost:4000/api
pnpm i
pnpm dev
```

Client runs on `http://localhost:5173`.

## Render deployment

Deploy **two** services:
- Node web service for `server/`
- Static site for `client/`

Use the included `render.yaml` Blueprint.

