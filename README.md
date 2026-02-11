# Vocab Learner Frontend

## Setup

```bash
npm install
```

### Environment

Create a `.env.local` file in the project root (recommended for dev overrides):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

For production builds, use `.env.production`:

```bash
VITE_API_BASE_URL=https://vocab-backend-219277558905.us-central1.run.app
```

## Run

```bash
npm run dev
```

## Local Network Access

- The Vite dev server is configured to bind on `0.0.0.0`, so it can be reached from other devices on your LAN.
- Find your machine's LAN IP (for example `192.168.1.10`) and open `http://<LAN_IP>:5173`.
- If your backend runs on the same machine, set `VITE_API_BASE_URL` to `http://<LAN_IP>:8000` so devices can reach it.

## Basic Flow

1. Register or log in at `/register` or `/login`.
2. From the home menu, start the feed at `/feed`.
3. For quiz cards, choose an answer and submit to see the result.
4. For sentence cards, write a sentence and submit for feedback.
5. Visit `/settings` to update timezone, daily goals, and SMS opt-in/out.
6. Visit `/stats` to review the summary dashboard.

## Notes

- All API calls are sent to `${VITE_API_BASE_URL}/api/v1`.
- Profile endpoints: `GET/PATCH /users/me`, `POST /users/me/sms/opt-in`, `POST /users/me/sms/opt-out`.
- Stats endpoint: `GET /stats/summary`.
- Feed endpoints: `/feed/start`, `/feed/resume`, `/feed/{feed_session_id}/next`, `/feed/mark_viewed`, `/feed/mark_skipped`, `/feed/end`.
- Auth endpoints: `/auth/register`, `/auth/login`, `/auth/me` with `Authorization: Bearer <access_token>`.
- Access tokens are stored in `localStorage` for this MVP.
- Client logging always writes to the browser console in all environments.
- To enable the dev-only diagnostics button on login/register errors, set `VITE_TRACE_UI=true`.
