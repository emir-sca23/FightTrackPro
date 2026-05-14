# FightTrack Pro

## Overview

FightTrack Pro is a smart workout tracker built for fighters (boxing, kickboxing, MMA, muay thai). Athletes can log training sessions, track weight cuts, and analyze progress with charts.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind + Framer Motion + Recharts
- **Auth**: Replit Auth (OIDC)

## Artifacts

- `artifacts/fighttrack` — React + Vite web app (served at `/`)
  - `src/lib/workout-routines.ts` — built-in guided routines per discipline
  - `src/lib/food-database.ts` — local food database for meal autocomplete
  - `src/lib/sound.ts` — Web Audio beep + vibration helpers, sound preference (localStorage)
  - `src/lib/water.ts` — per-day water cup tracker (localStorage)
  - `src/components/dashboard/Achievements.tsx`, `WaterTracker.tsx`
- `artifacts/api-server` — Express API (served at `/api`)

## Features

- Replit Auth for sign in / sign out
- Dashboard with stats, achievements grid, and water tracker
- **Guided Workout Player** (`/workouts/play`): pick a discipline → built-in routine plays exercise → rest → next automatically with countdown timer, progress bar, pause/resume/skip/stop, audio beeps + vibration on phase changes; auto-logs the workout on completion
- Manual workout logging: date, type, duration, intensity 1-10, notes; calories burned auto-calculated from type, duration, and intensity
- Weight tracking with auto-derived weight class (Strawweight through Heavyweight)
- **Weight cut planning**: target weight, optional deadline, total kcal to burn (7700 kcal/kg), progress bar
- **Daily calorie tracking**: meals + workouts → consumed / burned / net, daily limit budget
- **Smart recommendations** (`/api/recommendations`): computes daily deficit target from goal + deadline, suggests Running / Jump rope / Shadow boxing / Cardio minutes to hit it
- **Meals page** with built-in food database autocomplete (~45 common foods); log, list, delete meals for today
- **Achievements**: 12 derived badges (workouts logged, streaks, weekly volume, cut progress, etc.)
- **Water tracker**: per-day cup count saved in localStorage, 8-cup goal with visual indicator
- **Settings page**: workout sound on/off, reset weight cut goals
- Progress charts: workouts per week (12-week trend), weight progress, type breakdown
- Profile editing (display name, weight, discipline, target weight, deadline, daily calorie limit)

## Database tables

- `users`, `sessions` — Replit Auth
- `profiles` — Fighter profile (weight, weight category, discipline, target weight, cut deadline, daily calorie limit)
- `workouts` — Logged training sessions (with auto-calculated `calories_burned`)
- `weights` — Historical weight measurements
- `meals` — Logged meals with calories per meal

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
