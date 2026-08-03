# Miss Ginko Restaurant Website

Static-export Next.js site for a restaurant experience: App Router, Tailwind v4,
GSAP + Lenis motion, and Supabase for Auth/Postgres.

The deployed site is intended to run as a static site. There is no separate
Node.js backend and no service-role key in the frontend. Supabase RLS policies
are the security boundary for admin reads and writes.

## Prerequisites

- Node.js 20+
- A Supabase project

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project > Settings > API |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

Do not add `SUPABASE_SERVICE_ROLE_KEY` to a static host. The browser app uses
only the anon key and RLS.

## Database

For a new Supabase project, apply `supabase/migrations/0001_init.sql`, then
optionally seed sample data with `supabase/seed.sql`.

If you already applied the first migration before the static-only refactor, also
run `supabase/migrations/0002_static_export_cleanup.sql`. It tightens booking
inserts, removes the unused review-summary table, and removes empty storage
buckets created by the older schema.

## Run Locally

```bash
npm run dev
```

## Static Build

```bash
npm run build
```

The build writes static output to `out/`.

## Render Static Site

Use Render's **Static Site** product:

| Setting | Value |
|---|---|
| Root Directory | leave blank unless the repo is inside a subfolder |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `out` |
| Environment | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` |

Images are external URLs or files in `public/`; the app does not upload heavy
files to Supabase Storage.
