# GrowthOS

GrowthOS is a personal success operating system for planning intentional work, tracking focused time, measuring consistency, and building momentum across career, business, health, and personal growth goals.

This repository currently contains the Phase 1 foundation only. Authentication, projects, tasks, timers, dashboards, and analytics are intentionally not implemented yet.

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
npm run prisma:generate
npm run start:dev
```

The backend runs on `http://localhost:4000`.

Check health:

```bash
curl http://localhost:4000/health
```

Set up frontend environment:

```bash
cp frontend/.env.example frontend/.env.local
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

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
