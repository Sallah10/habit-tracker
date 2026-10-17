# HabiTapp

A full-stack habit tracker for the one habit everyone lies about: **time spent on social media**. Log how long you spend, how it made you feel and whether it was actually useful - then watch the charts and your streak.

**Live demo:** https://habit-tracker-steel-nine.vercel.app/

**Demo account:** `demo@habit.app` / `Demo1234` (pre-seeded with 31 days of history). You can also sign up with your own email.

![habit tracker](https://github.com/user-attachments/assets/88e75ea0-a23c-4965-ace4-35de5426bf9e)

## What it does

- **Auth** - email + password (bcrypt hashed) or Google OAuth, sessions via NextAuth. New accounts go through a short onboarding (pick platforms + set goals).
- **Dashboard** - today's status, streaks, per-platform goals, last-14-day trend, and quick links to Insights, Focus, Settings and Help.
- **Log your usage** - fast, tactile form to log minutes, mood, activity and whether it was productive.
- **Insights** - see where your time goes, ranked by platform.
- **Focus mode** - pick apps and run a real countdown session; link to Wind Down for a nightly schedule.
- **Tracker** - quick log + recent history.
- **Settings** (`/dashboard/settings`) - edit your display name, daily goals per app, and change (or set) your password. Deleting your account lives here, behind a type-confirmation.
- **Help** (`/help`) - a plain-English glossary of every term (Logging, Streak, Insights, Focus Mode, Wind Down, Privacy) so nothing in the app is jargon.
- **Feedback** - toasts for everything that matters (log saved, settings saved, password changed, errors) and confirmation dialogs for anything destructive (log out, delete account).
- **Installable (PWA)** - add it to your home screen from the browser. Opens fullscreen, no app store, and static assets are cached so it loads instantly.

## Install it as an app (PWA)

HabiTapp is a progressive web app, so you don't need an app store - it installs from the browser and then behaves like a native app (own icon, fullscreen, one tap away).

- **Android (Chrome):** open the site, then menu **⋮ → Add to Home screen**. The landing page also shows an **Install HabiTapp** button when your browser supports it.
- **iPhone/iPad (Safari):** tap **Share**, then **Add to Home Screen**. (iOS doesn't fire the install button, so this is the way.)
- **Desktop (Chrome/Edge):** click the **install icon** in the address bar.

Once installed it opens with no browser chrome, and static assets are cached so it loads instantly. It is **not** an offline app - HTML pages and API calls are never cached, so logging needs a connection (by design: it keeps auth and data honest).

## How it works (and what it doesn't)

HabiTapp is **fully manual**. There is no automatic screen-time tracking, no platform APIs and no background monitoring - you tell it how long you spent and it does the maths.

- **You log your usage yourself**, on purpose. The daily ritual is the point: a number you write down is harder to ignore than one a system reported on your behalf.
- **Privacy is the feature, not a limitation.** Because HabiTapp connects to nothing, there's no screen-time feed, no linked accounts and no background access to leak - the only data stored is what you type in.
- **Focus Mode is a countdown timer, not a blocker.** It doesn't restrict apps on your device - it's a commitment device to keep you honest.
- **Wind Down is a plan/reminder**, not an enforced do-not-disturb schedule.
- **Streaks** count consecutive days (UTC) with at least one log. Log nothing and the streak resets.
- The **in-app demo account** is pre-seeded with 31 days of generated data so the charts and streak look alive without you entering anything.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 18 + TypeScript |
| Auth | NextAuth v4 (JWT strategy, Credentials + Google) |
| Database | PostgreSQL via Prisma 6 (with migrations) |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Feedback | sonner (toasts) + Radix AlertDialog (confirmations) |
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
npx prisma db seed         # optional: create a demo account (demo@habit.app / Demo1234)
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
  api/onboarding/          # save platforms + goals after signup
  onboarding/              # first-run setup page
  dashboard/               # dashboard hub + insights + focus + winddown
  tracker/                 # fast logging page
  nav.tsx                  # auth-aware nav (coral accent)
lib/
  prisma.ts                # single PrismaClient
  streaks.ts               # pure streak maths (unit tested)
  usage.ts                 # pure usage aggregation (unit tested)
  platforms.ts             # platform names + icon paths
middleware.ts              # protects /dashboard, /tracker, /onboarding
```

Every page that reads the database is a React Server Component; the interactive bits are small `"use client"` leaves fed typed props. The UI is dark-first, warm coral accent and uses Baloo Tamma 2 throughout.

## Security notes

- Passwords are hashed with bcrypt; they are never returned by any API.
- `/api/logs` derives the user from the **session**, never from a `userId` in the request, so you can only read or write your own data.
- `/api/onboarding` creates/updates habits only for the signed-in user.
- Protected routes (`/dashboard`, `/tracker`, `/onboarding`) are guarded by middleware; API routes return `401`.
- Secrets live in `.env` (gitignored). `.env.example` shows what's needed.

## Tests

`npm run test` covers the pure logic (streaks, usage aggregation). `npm run smoke` drives the real thing: register → sign in → create a log → load the dashboard → confirm the API ignores a spoofed `userId` → validate onboarding guards → delete the test data.
