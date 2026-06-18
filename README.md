# My Day Dashboard

A monorepo with a production-ready frontend and backend for weather, timezone, and AI assistance.

## Structure

- `frontend/` — Next.js UI application
- `backend/` — Express-based API server and Ollama agent integration

## Quick start

1. Install dependencies from the repository root:

```bash
npm install
```

2. Start the backend:

```bash
npm run backend:dev
```

3. In another terminal, start the frontend:

```bash
npm run dev
```

4. Open http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run build` | Build frontend for production |
| `npm run start` | Start frontend production server |
| `npm run lint` | Run frontend ESLint |
| `npm run backend:dev` | Start backend development server |
| `npm run backend:build` | Build backend | 
| `npm run backend:start` | Start backend production server |

## Environment

Frontend environment variables are in `frontend/.env.example`.

Backend environment variables:

- `OLLAMA_BASE_URL` — Ollama server URL
- `OLLAMA_MODEL` — model name (default `mistral`)

## Notes

- Weather and timezone APIs use Open-Meteo public endpoints.
- The frontend calls the backend via `NEXT_PUBLIC_BACKEND_URL`.
- The backend proxies IP location lookups and runs the AI assistant via Ollama.

## License

MIT
