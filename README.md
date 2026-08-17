# greatestpmever-agents-api

Minimal Node.js API for the A.G.E.N.T.S. Production Readiness Analyzer.

## Setup and commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

The local server listens on port `3001` by default.

## Routes

- `GET /` — returns the API service status.
- `GET /health` — returns the health status and API version.

Unknown routes return HTTP 404 with `{ "error": "not_found" }`.

## Environment variables

- `PORT` — HTTP port; defaults to `3001`.
- `NODE_ENV` — runtime environment, such as `development` or `production`.
- `ALLOWED_ORIGINS` — comma-separated list of permitted CORS origins. Local development defaults to `http://localhost:3000`.
API for GPME
