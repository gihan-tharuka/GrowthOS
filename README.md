# GrowthOS

GrowthOS is a personal success operating system for planning intentional work, tracking focused time, measuring consistency, and building momentum across career, business, health, and personal growth goals.

This repository currently contains the Phase 2 authentication and app shell foundation. Projects, tasks, timers, logs, analytics, and dashboard data are intentionally not implemented yet.

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
npm run prisma:migrate -- --name add-user-auth
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

Set up frontend environment:

```bash
cp frontend/.env.example frontend/.env.local
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

Auth pages:

- Register: `http://localhost:3000/auth/register`
- Login: `http://localhost:3000/auth/login`
- Protected app pages: `/dashboard`, `/planner`, `/projects`, `/logs`, `/settings`

For this MVP phase, the frontend stores the JWT access token in `localStorage` through centralized helpers in `frontend/src/lib/auth-token.ts`.

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
