# Numora — AI Math Tutor

React/Vite client with an Express, Prisma/PostgreSQL backend and an OpenRouter tutor.

## Run locally

Use a recent Node.js version supported by Vite 8 and Prisma 7 (Node 22.12+ recommended).

1. In `server`, run `npm ci` and copy `.env.example` to `.env`. Configure PostgreSQL, a random JWT secret of at least 32 characters, and an OpenRouter API key.
2. Run `npm run db:generate`, `npm run db:migrate`, then `npm run db:seed`. Seeding creates grades, tutors, topics and lessons; migrations and seeding write to the configured database, so verify the URL first.
3. Run `npm run dev` in `server` (port 5000).
4. In `Client`, run `npm ci`, then `npm run dev` (port 5173).
5. Open `http://localhost:5173`, register with a grade, select a tutor, or open a subject from the navigation.

The client uses `/api`, proxied by Vite during development. For production, route `/api` to the backend or set `VITE_API_URL` to its full API URL before building. Configure `CLIENT_ORIGIN` with the frontend origin (comma-separated for multiple origins). For truly cross-site HTTPS deployments, set `COOKIE_SAME_SITE=none` and `NODE_ENV=production`. Secrets belong only in the server environment.

## Checks

- Client: `npm run lint` and `npm run build`.
- Server: `npm test` and `npm run db:validate`.

The backend tests mock PostgreSQL and OpenRouter. They cover validation, conversation ownership, grade access, malformed AI output, atomic persistence, retries and overlapping requests. They do not verify live provider availability, AI mathematical correctness, database connectivity or browser microphone permissions.

## Remaining product limitations

The dashboard still contains example courses, activities, achievements, tasks and notifications; these are not a complete persisted learning analytics system. Newsletter/contact submissions and external/social links need real product destinations or services. Browser voice input depends on browser support and microphone permission. AI replies depend on a valid API key and the provider's current capacity. No claim of 100% bug-free behavior is made.
