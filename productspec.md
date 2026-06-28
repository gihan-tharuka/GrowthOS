# MVP Project Specification

## Project Name

**Momentum Tracker**

Alternative names:

* **ActionLog**
* **FocusPath**
* **MomentumOS Lite**
* **Daily Action Tracker**

Recommended name for portfolio:

> **Momentum Tracker — Daily Action Planning & Time Tracking Platform**

---

# 1. Purpose

Momentum Tracker is a full-stack productivity web application that helps users plan daily actions, track focused work time, and review their consistency across important life/work areas such as career, business, learning, and personal growth.

The MVP focuses on one core problem:

> Users often feel like they are not making progress because they do not clearly track what they planned, what they completed, and how much focused time they spent.

The app solves this by allowing users to:

* Create projects such as Career or Business
* Plan tasks for specific dates
* Estimate how long each task should take
* Start, pause, resume, and stop a timer
* Track actual time spent
* Mark tasks as completed
* View daily and weekly summaries

---

# 2. MVP Goal

The MVP should answer one question:

> “Can this app help a user plan the day, track focused action, and review progress?”

Version 1 should **not** try to become a full life operating system yet.

---

# 3. User Roles

## 1. Guest User

A guest user is not logged in.

Can:

* View landing page
* View product features
* Register
* Login

Cannot:

* Access dashboard
* Create projects
* Create tasks
* Track time

---

## 2. Authenticated User

The main user of the app.

Can:

* Manage own profile
* Create, edit, archive, and delete projects
* Create, edit, delete, and complete tasks
* Schedule tasks for specific dates
* Start, pause, resume, and stop timers
* View daily logs
* View basic analytics
* Access only their own data

---

## 3. Admin

Do **not** build an admin role in version 1.

Later, if this becomes SaaS, admin can be added for:

* User management
* Subscription management
* App analytics
* Support

---

# 4. Core User Stories

## Authentication

### US-01: Register account

As a new user, I want to create an account so that I can securely save my projects, tasks, and time logs.

Acceptance criteria:

* User can register with name, email, and password
* Email must be unique
* Password must meet minimum security rules
* User is redirected to dashboard after registration
* User data is private to that account

---

### US-02: Login

As a registered user, I want to log in so that I can access my personal productivity dashboard.

Acceptance criteria:

* User can log in using email and password
* Invalid credentials show an error message
* Successful login redirects to dashboard
* Authenticated routes are protected

---

### US-03: Logout

As a user, I want to log out so that my account is secure.

Acceptance criteria:

* User can log out from the app
* Session is cleared
* User is redirected to login or landing page

---

## Projects

### US-04: Create project

As a user, I want to create projects so that I can organize my actions by life/work area.

Example projects:

* Career
* BrandGrade Business
* Learning
* Fitness Coaching Idea

Acceptance criteria:

* User can create a project with name, description, and color
* Project belongs only to the logged-in user
* Project appears in project list and task form

---

### US-05: Edit project

As a user, I want to update project details so that my workspace stays organized.

Acceptance criteria:

* User can edit project name, description, color, and status
* Changes are saved immediately or after form submission
* Empty project name is not allowed

---

### US-06: Archive project

As a user, I want to archive a project so that old projects do not clutter my active workspace.

Acceptance criteria:

* User can archive a project
* Archived projects do not appear in active project dropdown by default
* Tasks connected to archived projects are not deleted

---

## Tasks

### US-07: Create task

As a user, I want to create a task and assign it to a date so that I know what actions to complete each day.

Acceptance criteria:

* User can create a task with title, project, scheduled date, estimated time, priority, and optional description
* Task appears on the daily planner page for the selected date
* Task status defaults to `PLANNED`

---

### US-08: Edit task

As a user, I want to edit task details so that I can update my plan when priorities change.

Acceptance criteria:

* User can edit title, description, project, scheduled date, estimate, priority, and status
* User cannot edit another user’s task
* Invalid data shows validation messages

---

### US-09: Delete task

As a user, I want to delete a task if it was created by mistake.

Acceptance criteria:

* User can delete a task
* Deleting a task also deletes or disconnects related time sessions based on chosen database behavior
* Confirmation is shown before deletion

Recommended MVP behavior:

> Soft-delete tasks instead of permanently deleting them, or permanently delete task and related time sessions through cascade delete.

For simplicity, use cascade delete in MVP.

---

### US-10: Complete task

As a user, I want to mark a task as completed so that I can track progress.

Acceptance criteria:

* User can mark task as completed
* Task status changes to `COMPLETED`
* `completedAt` timestamp is saved
* Completed tasks appear in daily log

---

## Timer

### US-11: Start timer

As a user, I want to start a timer for a task so that I can track actual focused work time.

Acceptance criteria:

* User can start timer from a task card
* A new time session is created
* Task status changes to `IN_PROGRESS`
* Only one timer can run at a time per user
* If another timer is already running, show an error

---

### US-12: Pause timer

As a user, I want to pause a timer when I stop working temporarily.

Acceptance criteria:

* User can pause a running timer
* Timer session status changes to `PAUSED`
* Time until pause is saved/calculated
* User can later resume the same task

---

### US-13: Resume timer

As a user, I want to resume a paused timer so that I can continue the same task.

Acceptance criteria:

* User can resume a paused session
* Timer status changes to `RUNNING`
* Timer continues tracking time
* Task status remains `IN_PROGRESS`

---

### US-14: Stop timer

As a user, I want to stop a timer when I finish or stop working on a task.

Acceptance criteria:

* User can stop a running or paused timer
* Session status changes to `COMPLETED`
* `endedAt` is saved
* `durationSeconds` is calculated
* Actual time is reflected in task summary and logs

---

## Daily Planner

### US-15: View daily plan

As a user, I want to select a date and view all planned tasks for that date.

Acceptance criteria:

* User can select a date
* App shows tasks scheduled for that date
* App shows total estimated time
* App shows total tracked time
* App shows completed and remaining task counts

---

## Logs & Dashboard

### US-16: View daily log

As a user, I want to view completed tasks and tracked time so that I can see proof of progress.

Acceptance criteria:

* User can view a table of tasks by date
* Table shows task title, project, estimated time, actual time, and status
* User can filter by date range and project, optional for MVP

---

### US-17: View dashboard summary

As a user, I want to see a simple summary of my productivity so that I can stay motivated.

Acceptance criteria:

Dashboard shows:

* Today’s focus time
* Today’s completed tasks
* This week’s focus time
* Active projects count
* Time by project, simple list or chart

---

# 5. Pages / Screens

## Public Pages

## 1. Landing Page `/`

Purpose:

Introduce the product and encourage users to register.

Sections:

* Hero section
* Problem statement
* Solution section
* Core features
* Screenshots or demo preview
* Final CTA

Main CTA:

* “Start Tracking”
* “Create Free Account”

---

## 2. Register Page `/register`

Fields:

* Name
* Email
* Password
* Confirm password

Actions:

* Create account
* Link to login

---

## 3. Login Page `/login`

Fields:

* Email
* Password

Actions:

* Login
* Link to register

---

# App Pages

## 4. Dashboard `/dashboard`

Purpose:

Give a high-level overview.

Components:

* Welcome message
* Today’s focus time card
* Today’s completed tasks card
* Weekly focus time card
* Active projects card
* Today’s task preview
* Time by project summary

---

## 5. Daily Planner `/planner`

Purpose:

Main working page.

Components:

* Date selector
* Add task button/form
* Daily summary cards
* Task list
* Timer controls on each task
* Complete task button

Task card should show:

* Title
* Project
* Priority
* Estimated time
* Actual tracked time
* Status
* Start/pause/resume/stop timer buttons

---

## 6. Projects Page `/projects`

Purpose:

Manage projects.

Components:

* Project list
* Create project modal/form
* Edit project action
* Archive/delete action

Project card should show:

* Name
* Description
* Color
* Active task count
* Total tracked time, optional

---

## 7. Project Detail Page `/projects/[id]`

Optional for MVP, but good if time allows.

Purpose:

Show all tasks under one project.

Components:

* Project header
* Project summary
* Task list
* Tracked time for project

This can be delayed if time is short.

---

## 8. Time Log Page `/logs`

Purpose:

Show history of actions.

Components:

* Date range filter
* Project filter, optional
* Log table

Columns:

* Date
* Task
* Project
* Estimated time
* Actual time
* Status

---

## 9. Settings Page `/settings`

Purpose:

Basic account and app settings.

MVP fields:

* Name
* Email display
* Default focus duration, optional
* Theme toggle, optional

This page can be very simple.

---

# 6. Database Schema

Recommended stack:

* PostgreSQL
* Prisma ORM

---

## Enums

```prisma
enum ProjectStatus {
  ACTIVE
  ARCHIVED
}

enum TaskStatus {
  PLANNED
  IN_PROGRESS
  PAUSED
  COMPLETED
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

enum TimeSessionStatus {
  RUNNING
  PAUSED
  COMPLETED
  CANCELLED
}
```

---

## User Model

```prisma
model User {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  passwordHash String
  projects     Project[]
  tasks        Task[]
  timeSessions TimeSession[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

---

## Project Model

```prisma
model Project {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?
  color       String?
  status      ProjectStatus @default(ACTIVE)

  tasks       Task[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([userId])
}
```

---

## Task Model

```prisma
model Task {
  id               String       @id @default(cuid())
  userId           String
  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  projectId        String
  project          Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)

  title            String
  description      String?
  scheduledDate    DateTime
  estimatedMinutes Int
  priority         TaskPriority @default(MEDIUM)
  status           TaskStatus   @default(PLANNED)

  completedAt      DateTime?

  timeSessions     TimeSession[]

  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([userId])
  @@index([projectId])
  @@index([scheduledDate])
}
```

---

## TimeSession Model

```prisma
model TimeSession {
  id              String            @id @default(cuid())

  userId          String
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  taskId          String
  task            Task              @relation(fields: [taskId], references: [id], onDelete: Cascade)

  startedAt       DateTime
  pausedAt        DateTime?
  resumedAt       DateTime?
  endedAt         DateTime?
  durationSeconds Int               @default(0)

  status          TimeSessionStatus @default(RUNNING)

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([userId])
  @@index([taskId])
  @@index([status])
}
```

---

## Important timer rule

There should be only one active timer per user.

App-level rule:

```txt
A user cannot have more than one TimeSession with status RUNNING.
```

When starting a timer:

1. Check if user already has a running session
2. If yes, block request
3. If no, create session

---

# 7. API Routes

Assuming full-stack Next.js API routes or route handlers.

Base path:

```txt
/api
```

---

## Auth Routes

If using NextAuth/Auth.js or Clerk, many routes are handled by the library.

If custom auth:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## Project Routes

```txt
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
PATCH  /api/projects/:id/archive
```

### Create project request

```json
{
  "name": "Career",
  "description": "Job hunting, resume updates, interview prep",
  "color": "#6366F1"
}
```

### Project response

```json
{
  "id": "project_id",
  "name": "Career",
  "description": "Job hunting, resume updates, interview prep",
  "color": "#6366F1",
  "status": "ACTIVE",
  "createdAt": "2026-06-28T10:00:00.000Z"
}
```

---

## Task Routes

```txt
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/complete
```

Useful query filters:

```txt
GET /api/tasks?date=2026-06-28
GET /api/tasks?projectId=abc
GET /api/tasks?status=COMPLETED
GET /api/tasks?from=2026-06-01&to=2026-06-30
```

### Create task request

```json
{
  "projectId": "project_id",
  "title": "Apply for Ceylinco job",
  "description": "Update resume and submit application",
  "scheduledDate": "2026-06-28",
  "estimatedMinutes": 60,
  "priority": "HIGH"
}
```

---

## Timer Routes

```txt
POST /api/tasks/:taskId/timer/start
POST /api/tasks/:taskId/timer/pause
POST /api/tasks/:taskId/timer/resume
POST /api/tasks/:taskId/timer/stop
GET  /api/tasks/:taskId/sessions
```

### Start timer response

```json
{
  "sessionId": "session_id",
  "taskId": "task_id",
  "startedAt": "2026-06-28T10:00:00.000Z",
  "status": "RUNNING"
}
```

### Stop timer response

```json
{
  "sessionId": "session_id",
  "taskId": "task_id",
  "startedAt": "2026-06-28T10:00:00.000Z",
  "endedAt": "2026-06-28T10:45:00.000Z",
  "durationSeconds": 2700,
  "status": "COMPLETED"
}
```

---

## Dashboard / Analytics Routes

```txt
GET /api/dashboard/summary
GET /api/analytics/daily?date=2026-06-28
GET /api/analytics/weekly?from=2026-06-22&to=2026-06-28
GET /api/analytics/projects?from=2026-06-01&to=2026-06-30
```

### Dashboard summary response

```json
{
  "todayFocusSeconds": 7200,
  "todayCompletedTasks": 3,
  "weeklyFocusSeconds": 25200,
  "activeProjects": 4,
  "timeByProject": [
    {
      "projectId": "project_id",
      "projectName": "Career",
      "durationSeconds": 10800
    }
  ]
}
```

---

# 8. Authentication Requirements

## MVP authentication requirements

Use one of these:

### Recommended for fast MVP

**Clerk**

Pros:

* Fast setup
* Secure auth handled for you
* Good UI components
* Less time spent on auth

### More portfolio-control option

**Auth.js / NextAuth with Credentials Provider**

Pros:

* Shows more backend/auth understanding
* Works well with Prisma
* More customizable

For your MVP, I recommend:

> **Auth.js / NextAuth + Prisma + PostgreSQL**

because it looks stronger in a portfolio than relying fully on Clerk.

---

## Auth rules

* Only authenticated users can access app pages
* Users can only access their own projects, tasks, and time sessions
* API routes must check session before returning data
* Unauthorized requests return `401`
* Accessing another user’s record returns `403` or `404`

Recommended behavior:

> Return `404` for records not owned by the user, so the API does not reveal whether the record exists.

---

## Password rules

If using custom credential auth:

* Minimum 8 characters
* Must include at least one letter
* Must include at least one number
* Password should be hashed using bcrypt
* Never store plain-text passwords

---

# 9. Validation Rules

Use **Zod** for request validation.

---

## Register validation

```txt
name:
- required
- min 2 characters
- max 80 characters

email:
- required
- valid email format
- unique

password:
- required
- min 8 characters
- max 100 characters

confirmPassword:
- must match password
```

---

## Login validation

```txt
email:
- required
- valid email format

password:
- required
```

---

## Project validation

```txt
name:
- required
- min 2 characters
- max 80 characters

description:
- optional
- max 300 characters

color:
- optional
- must be valid hex color or predefined color value

status:
- ACTIVE or ARCHIVED
```

---

## Task validation

```txt
projectId:
- required
- must belong to logged-in user

title:
- required
- min 2 characters
- max 120 characters

description:
- optional
- max 500 characters

scheduledDate:
- required
- valid date

estimatedMinutes:
- required
- integer
- minimum 1
- maximum 720

priority:
- LOW, MEDIUM, or HIGH

status:
- PLANNED, IN_PROGRESS, PAUSED, COMPLETED, or CANCELLED
```

Why max 720 minutes?

> A task estimate longer than 12 hours is probably unrealistic for a single task.

---

## Timer validation

### Start timer

Rules:

* Task must exist
* Task must belong to logged-in user
* Task must not already be completed
* User must not already have another running timer

---

### Pause timer

Rules:

* Session must exist
* Session must belong to logged-in user
* Session status must be `RUNNING`

---

### Resume timer

Rules:

* Session must exist
* Session must belong to logged-in user
* Session status must be `PAUSED`
* User must not already have another running timer

---

### Stop timer

Rules:

* Session must exist
* Session must belong to logged-in user
* Session status must be `RUNNING` or `PAUSED`
* Duration must be calculated and saved

---

# 10. Error States

## Global error states

### 1. Unauthorized

Message:

```txt
You need to log in to access this page.
```

Action:

* Redirect to login

---

### 2. Forbidden

Message:

```txt
You do not have permission to access this resource.
```

Use when:

* User tries to access another user’s data

---

### 3. Not found

Message:

```txt
This item could not be found.
```

Use when:

* Project does not exist
* Task does not exist
* Session does not exist

---

### 4. Validation error

Message examples:

```txt
Task title is required.
Estimated time must be at least 1 minute.
Please select a project.
```

Display inline near fields.

---

### 5. Server error

Message:

```txt
Something went wrong. Please try again.
```

Do not expose technical error details in UI.

---

# Specific App Error States

## Project errors

### No projects yet

Message:

```txt
Create your first project to start planning focused actions.
```

CTA:

```txt
Create Project
```

---

### Cannot delete project with active tasks

Optional rule.

Message:

```txt
This project has active tasks. Archive it instead or complete/delete the tasks first.
```

For MVP, you can allow delete with cascade after confirmation.

---

## Task errors

### No tasks for selected date

Message:

```txt
No tasks planned for this day. Add one focused action to build momentum.
```

CTA:

```txt
Add Task
```

---

### Missing project

Message:

```txt
Please create a project before adding tasks.
```

CTA:

```txt
Create Project
```

---

## Timer errors

### Another timer already running

Message:

```txt
You already have a running timer. Pause or stop it before starting another task.
```

CTA:

```txt
Go to active task
```

---

### Starting completed task

Message:

```txt
This task is already completed. Reopen it before tracking more time.
```

---

### Timer session not found

Message:

```txt
This timer session could not be found.
```

---

### Browser refresh while timer running

Important MVP behavior:

The timer should be based on database timestamps, not just frontend state.

If user refreshes the page:

* App fetches active running session
* Timer display continues from `startedAt`
* User can pause or stop it

---

# 11. Testing Plan

For a portfolio project, include tests. You do not need huge coverage, but test the important logic.

---

## Unit Tests

Use:

* Vitest or Jest

Test:

### Validation schemas

* Valid project input passes
* Empty project name fails
* Valid task input passes
* Invalid estimated time fails
* Invalid priority fails

### Timer utility functions

Test:

* Calculate duration from start to stop
* Format seconds into hours/minutes
* Calculate total task time from sessions
* Planned vs actual time difference

---

## API / Integration Tests

Use:

* Jest
* Supertest, if using separate backend
* Or Next.js route handler tests if using full-stack Next

Test:

### Auth

* Register user
* Reject duplicate email
* Login with valid credentials
* Reject invalid credentials

### Projects

* Authenticated user can create project
* User can only fetch own projects
* User can update own project
* User cannot update another user’s project

### Tasks

* Create task
* Fetch tasks by date
* Mark task completed
* Reject task without project
* Reject estimatedMinutes less than 1

### Timer

* Start timer
* Prevent second running timer
* Pause running timer
* Resume paused timer
* Stop timer and calculate duration
* Reject timer action for another user’s task

---

## E2E Tests

Use:

* Playwright or Cypress

Recommended: **Playwright**

Test main user flow:

```txt
1. User registers
2. User creates project called Career
3. User creates task called Apply for job X
4. User schedules task for today
5. User starts timer
6. User pauses timer
7. User resumes timer
8. User stops timer
9. User marks task complete
10. User sees task in log
11. Dashboard updates focus time
```

This single E2E test will make your project look much more professional.

---

## Manual QA Checklist

Before deployment, test:

* Register
* Login
* Logout
* Create project
* Edit project
* Archive project
* Create task
* Edit task
* Delete task
* Start timer
* Pause timer
* Resume timer
* Stop timer
* Refresh page while timer running
* Complete task
* View logs
* View dashboard
* Mobile layout
* Empty states
* Error messages

---

# 12. Deployment Plan

## Recommended deployment setup

```txt
Frontend/App: Vercel
Database: Neon PostgreSQL or Supabase PostgreSQL
ORM: Prisma
Auth: Auth.js / NextAuth
File storage: Not needed in MVP
```

---

## Environment variables

Example:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

If using OAuth later:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

For MVP, email/password is enough.

---

## Deployment steps

### Step 1: Create production database

Use Neon or Supabase PostgreSQL.

Create:

* Production database
* Connection string
* Add `DATABASE_URL` to Vercel

---

### Step 2: Configure Prisma

Commands:

```bash
npx prisma generate
npx prisma migrate deploy
```

For development:

```bash
npx prisma migrate dev
```

For production:

```bash
npx prisma migrate deploy
```

---

### Step 3: Deploy to Vercel

Steps:

1. Push project to GitHub
2. Import repo into Vercel
3. Add environment variables
4. Set build command

Typical build command:

```bash
npm run build
```

5. Deploy

---

### Step 4: Seed demo data, optional

Create a demo user with sample data:

Projects:

* Career
* Business
* Learning

Tasks:

* Apply for job
* Polish pricing plans
* Build portfolio section
* Practice interview questions

This helps recruiters quickly understand the app.

---

### Step 5: Add production checks

Before sharing:

* Test auth in production
* Test database writes
* Test timer after page refresh
* Test mobile layout
* Test protected routes
* Check console errors
* Check loading states
* Check 404 page

---

# 13. MVP Tech Stack Recommendation

For a 2–4 week MVP, use:

```txt
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Prisma
PostgreSQL
Auth.js / NextAuth
Zod
React Hook Form
Vercel
Neon PostgreSQL
Playwright
```

This is the best balance between:

* Speed
* Portfolio value
* Recruiter relevance
* Scalability
* Clean architecture

---

# 14. Suggested Folder Structure

```txt
src/
  app/
    page.tsx
    login/
    register/
    dashboard/
    planner/
    projects/
    logs/
    settings/
    api/
      auth/
      projects/
      tasks/
      timer/
      analytics/

  components/
    ui/
    layout/
    dashboard/
    planner/
    projects/
    tasks/
    timer/
    logs/

  lib/
    auth.ts
    prisma.ts
    validations/
      project.schema.ts
      task.schema.ts
      auth.schema.ts
    timer/
      calculate-duration.ts
      format-time.ts

  server/
    services/
      project.service.ts
      task.service.ts
      timer.service.ts
      analytics.service.ts

  types/
    index.ts

prisma/
  schema.prisma
  seed.ts
```

---

# 15. Version 1 Success Criteria

The MVP is successful when a user can:

1. Register and log in
2. Create a project
3. Create a task under that project
4. Schedule the task for today
5. Add an estimated time
6. Start the timer
7. Pause the timer
8. Resume the timer
9. Stop the timer
10. Mark the task as completed
11. See actual tracked time
12. View the task in daily logs
13. See daily and weekly summary on dashboard

That is the full MVP.

---

# 16. What to Avoid in Version 1

Do **not** build these yet:

* Workout tracking
* Meal tracking
* Habit tracking
* Journal
* Blog
* Coaching dashboard
* Client accounts
* Payments/subscriptions
* AI productivity assistant
* Google Calendar sync
* Push notifications
* Offline mode
* Full PWA support
* Drag-and-drop planner
* Advanced recurring tasks
* Team/workspace system
* Admin dashboard
* Complex Pomodoro cycles

Reason:

> These features are valuable later, but they will delay the MVP and reduce your chance of finishing in 2–4 weeks.

---

# 17. Portfolio Positioning

Use this description in your portfolio:

> **Momentum Tracker is a full-stack productivity platform that helps users plan daily actions, track focused work sessions, and review consistency across career and business goals. The MVP includes project management, date-based task planning, task timers with pause/resume support, time session logging, and dashboard analytics.**

Resume bullet points:

```txt
- Built a full-stack productivity platform using Next.js, TypeScript, Prisma, and PostgreSQL to manage projects, scheduled tasks, and user-specific progress tracking.
- Implemented task-based time tracking with start, pause, resume, and stop functionality using persistent time sessions.
- Developed dashboard summaries and daily logs to visualize focused work time, completed tasks, and project-level progress.
```

Final MVP identity:

> **Not a simple to-do app. A focused action tracking system for building consistency.**
