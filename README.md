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

## Practice lessons and mock tests

Open **Practice → Practice Problems** (`/practice`) for eight guided lessons per grade, across Algebra, Measurement, Problem Solving and Statistics. Grades 1–6 have 48 grade-specific lessons and 288 questions in total. Lessons include a worked example, learning steps, a six-question quiz, hints and a full explanation review.

Open **Practice → Mock Tests** (`/practice/tests`) for 12-question/12-minute or 20-question/20-minute tests with equal subject coverage. Answers and flags can resume within the same browser tab; refreshing does not reset the deadline. Tests auto-submit when time runs out. A 30-second network grace period applies; submissions after that are rejected. Practice sessions expire after two hours. A running backend and database are required to start and save a quiz.

Grading runs on the server, using signed attempts bound to the authenticated account and grade. Correct answers are returned after submission. Best scores and attempt counts use the existing curriculum/progress tables and appear in the dashboard’s **Practice & mock test progress** section. Full lesson practice at 70% or higher marks that lesson as mastered; a short mock-test sample does not. Lessons are added to the existing curriculum when a result is saved; no schema migration or extra dependency is required.

This is a learning tool, not a proctored examination system. In-flight duplicate-submission protection is scoped to one server process; production deployment across multiple processes needs persistent attempt/idempotency storage. Detailed answer reviews are shown for the current result, while the database stores lesson summaries rather than a complete attempt history. Automated tests use database fixtures; they do not connect to the live database.

main color

#f15e24=secandary
#f8fae2=primary