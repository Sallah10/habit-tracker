# HabiTapp

A full-stack habit tracker for the one habit everyone lies about: **time spent on social media**. Log how long you spend, how it made you feel and whether it was actually useful - then watch the charts and your streak.

**Live demo:** https://habit-tracker-steel-nine.vercel.app/

![habit tracker](https://github.com/user-attachments/assets/88e75ea0-a23c-4965-ace4-35de5426bf9e)

## What it does

- **Auth** - email + password (bcrypt hashed) or Google OAuth, sessions via NextAuth.
- **Log your usage** - pick a platform, minutes, mood, activity type and whether it was productive.
- **Dashboard** - total time logged, per-day usage chart, current and best streak.
- **Tracker** - usage trend line chart plus a table of your recent logs.
- **Most used apps** - your time per platform, ranked.
- **Focus mode** - pick apps and run a real countdown session.
- **Installable (PWA)** - add it to your home screen; a small service worker keeps the shell available offline.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 18 + TypeScript |
| Auth | NextAuth v4 (JWT strategy, Credentials + Google) |
| Database | PostgreSQL via Prisma 6 (with migrations) |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Charts | Recharts |
| Motion | Framer Motion |
| Testing | Vitest (unit) + a Node end-to-end smoke script |
| CI | GitHub Actions (`lint` → `typecheck` → `test` → `build`) |

## Getting started

```bash
git clone https://github.com/Sallah10/habit-tracker.git
cd habit-tracker
cp .env.example .env        # then fill in the values
npm install                 # runs `prisma generate` for you
npx prisma migrate deploy   # apply the migrations to your database
npm run dev
```

Open http://localhost:3000.

You need a Postgres database (Neon/Supabase/local all work). Google OAuth is optional - leave the `GOOGLE_CLIENT_ID`/`SECRET` blank and the email/password flow still works.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint over `**/*.ts(x)` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run smoke` | End-to-end smoke test against a running server (creates and deletes its own user) |
| `npm run icons` | Regenerate the PWA icons from the logo |

## Architecture

```
app/
  api/logs/route.ts        # the only data API - reads/writes logs for the SESSION user
  api/auth/register/       # signup (bcrypt)
  api/auth/[...nextauth]/  # NextAuth config
  dashboard/               # server components query Prisma, client children do the animation
  tracker/                 # logging form + charts
lib/
  prisma.ts                # single PrismaClient
  streaks.ts               # pure streak maths (unit tested)
  usage.ts                 # pure usage aggregation (unit tested)
  platforms.ts             # platform names + icon paths
middleware.ts              # protects /dashboard and /tracker
```

Every page that reads the database is a React Server Component; the interactive bits are small `"use client"` leaves fed typed props.

## Security notes

- Passwords are hashed with bcrypt; they are never returned by any API.
- `/api/logs` derives the user from the **session**, never from a `userId` in the request, so you can only read or write your own data.
- `/dashboard` and `/tracker` are behind middleware; the API returns `401` instead of redirecting.
- Secrets live in `.env` (gitignored). `.env.example` shows what's needed.

## Tests

`npm run test` covers the pure logic (streaks, usage aggregation). `npm run smoke` drives the real thing: register → sign in → create a log → load the dashboard → confirm the API ignores a spoofed `userId` → delete the test data.
