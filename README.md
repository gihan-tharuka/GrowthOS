# GrowthOS

GrowthOS is a personal success operating system for planning intentional work, tracking focused time, measuring consistency, and building momentum across career, business, health, and personal growth goals.

This repository currently contains the Phase 4 projects, tasks, and task timer foundation. Analytics, logs metrics, Pomodoro flows, habits, journals, workouts, payments, and dashboard metrics are intentionally not implemented yet.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui structure
- Backend: NestJS, TypeScript, Prisma
- Database: PostgreSQL via Docker Compose
- Monorepo layout: `frontend/` and `backend/`

## Local Setup

Start PostgreSQL:

```bash
docker compose up -d
```

Set up backend environment:

```bash
cp backend/.env.example backend/.env
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run start:dev
```

The backend runs on `http://localhost:4000`.

Check health:

```bash
curl http://localhost:4000/health
```

Auth endpoints:

- `POST /auth/register` with `name`, `email`, and `password`
- `POST /auth/login` with `email` and `password`
- `GET /auth/me` with `Authorization: Bearer <accessToken>`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`
- `PATCH /projects/:id/archive`
- `GET /tasks?date=YYYY-MM-DD&projectId=<id>&status=<status>`
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/complete`
- `POST /tasks/:taskId/timer/start`
- `POST /tasks/:taskId/timer/pause`
- `POST /tasks/:taskId/timer/resume`
- `POST /tasks/:taskId/timer/stop`
- `GET /timer/active`
- `GET /tasks/:taskId/sessions`

Set up frontend environment:

```bash
cp frontend/.env.example frontend/.env.local
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Deployment

### PostgreSQL

1. Provision your production PostgreSQL database.
2. Copy the runtime connection string and store it as `DATABASE_URL` for the backend service.
3. Keep the same `DATABASE_URL` available when you run Prisma production migrations.

### Backend on Cloud Run

1. Build the backend container from `backend/Dockerfile`.
2. Push the image to Artifact Registry or another registry Cloud Run can pull from.
3. Deploy the image to Cloud Run and inject runtime environment variables.
4. Use `/health` as the health check endpoint. It returns `{ status, service, timestamp }`.

Sample deploy command:

```bash
gcloud run deploy growthos-backend \
  --image=REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/growthos-backend:TAG \
  --region=REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,DATABASE_URL=YOUR_DATABASE_URL,JWT_SECRET=YOUR_JWT_SECRET,CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend on Vercel

1. Import this repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Keep the framework preset as Next.js.
4. Add `NEXT_PUBLIC_API_URL` pointing at your Cloud Run backend URL, for example `https://growthos-backend-xxxxx.a.run.app`.
5. Deploy, then redeploy after any environment variable changes.

### Required environment variables

Backend on Cloud Run:

- `PORT`: provided by Cloud Run automatically
- `NODE_ENV`: `production`
- `DATABASE_URL`: production PostgreSQL connection string
- `JWT_SECRET`: long random secret for signing access tokens
- `CORS_ORIGIN`: comma-separated allowed frontend origins, for example `http://localhost:3000,https://your-app.vercel.app`

Frontend on Vercel:

- `NEXT_PUBLIC_API_URL`: public Cloud Run backend URL, for example `https://growthos-backend-xxxxx.a.run.app`

### Production migration command

Use Prisma's production-safe migration command against the production database:

```bash
cd backend
DATABASE_URL="YOUR_DATABASE_URL" npm run prisma:migrate:deploy
```

### Production smoke test checklist

- Open the Vercel frontend and confirm the landing page loads.
- Register a new account.
- Log in and confirm `/dashboard` loads after refresh.
- Create a project.
- Create a planner task for today.
- Mark the task complete.
- Hit `https://YOUR_CLOUD_RUN_URL/health` and confirm it returns JSON with `status`, `service`, and `timestamp`.

Auth pages:

- Register: `http://localhost:3000/auth/register`
- Login: `http://localhost:3000/auth/login`
- Protected app pages: `/dashboard`, `/planner`, `/projects`, `/logs`, `/settings`

For this MVP phase, the frontend stores the JWT access token in `localStorage` through centralized helpers in `frontend/src/lib/auth-token.ts`.

Playwright e2e:

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

Headed browser mode:

```bash
cd frontend
npm run test:e2e:headed
```

Optional UI mode:

```bash
cd frontend
npm run test:e2e:ui
```

E2E notes:

- Docker PostgreSQL should be running before the tests.
- `backend/.env` must exist with `DATABASE_URL`, `PORT`, `NODE_ENV`, `JWT_SECRET`, and `CORS_ORIGIN`.
- Local Docker PostgreSQL is mapped to `localhost:5433` to avoid collisions with other Postgres instances that may already be using `5432`.
- Playwright starts the backend on `http://localhost:4000` and the frontend on `http://localhost:3000`.
- `npm run test:e2e:headed` runs the same Chromium test flow in a visible browser window.
- The e2e tests create unique users, projects, and tasks on every run to avoid collisions.
- Timer e2e covers start, pause, resume, and stop without asserting exact elapsed seconds.

Projects and tasks notes:

- Every project and task is scoped to the authenticated user.
- Tasks must belong to a project owned by the same authenticated user.
- Planner tasks are filtered by selected date using `YYYY-MM-DD`.
- Scheduled task dates are stored as UTC midnight dates to keep planner filtering consistent.
- Timer sessions are scoped to the authenticated user and task.
- Only one running or paused timer is allowed per user.
- Stopping a timer completes the time session but leaves the task open.

## Phase 1 Checklist

- [x] Monorepo structure with `frontend/`, `backend/`, `docker-compose.yml`, `README.md`, and `.gitignore`
- [x] Next.js TypeScript frontend
- [x] Tailwind CSS configured
- [x] shadcn/ui-compatible structure initialized
- [x] Landing page at `/`
- [x] Placeholder pages for `/dashboard`, `/planner`, `/projects`, `/logs`, and `/settings`
- [x] NestJS TypeScript backend
- [x] Prisma configured for PostgreSQL with `DATABASE_URL`
- [x] Health endpoint at `GET /health`
- [x] Local PostgreSQL Docker Compose service
- [x] Environment examples for frontend and backend

## Phase 2 Checklist

- [x] Prisma `User` model with unique email and password hash
- [x] Register, login, and current-user auth endpoints
- [x] Password hashing with bcrypt
- [x] JWT login response and protected `GET /auth/me`
- [x] DTO validation with global Nest validation pipe
- [x] Frontend register and login pages
- [x] Centralized API client and token storage helpers
- [x] Protected frontend app shell with navigation, user identity, and logout
- [x] Placeholder app pages remain protected

## Phase 3 Checklist

- [x] Prisma `Project` and `Task` models with enums and ownership relations
- [x] Guarded projects CRUD endpoints with archive support
- [x] Guarded tasks CRUD endpoints with completion support
- [x] Task filters by date, project, and status
- [x] User ownership checks with `404` for non-owned resources
- [x] Frontend project management page with create, edit, archive, and delete
- [x] Frontend planner page with date-based tasks, daily summary, and task actions
- [x] Reusable project and planner UI components

## Phase 3.5 Checklist

- [x] Playwright installed in `frontend/`
- [x] Local Playwright config for frontend and backend web servers
- [x] E2E scripts for headless and UI mode
- [x] End-to-end flow covering register, login, project creation, task creation, and task completion

## Phase 4 Checklist

- [x] Prisma `TimeSession` model and `TimeSessionStatus` enum
- [x] Guarded timer endpoints for start, pause, resume, stop, active timer, and task sessions
- [x] Single active timer enforcement per user
- [x] Timer actions update task status without auto-completing tasks
- [x] Active timer bar in the protected app shell
- [x] Planner task cards with timer controls
- [x] Playwright timer flow for start, pause, resume, and stop
