# Miss Ginko — Restaurant Website

Modern Asian fine dining site: Next.js App Router, Tailwind v4, GSAP + Lenis
motion system, Supabase (Postgres/Auth/Storage), Claude for AI review
summarization. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system
design — this file only covers getting it running.

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (or the Supabase CLI + Docker for local dev)
- An [Anthropic API key](https://console.anthropic.com) (only needed for the admin "Regenerate AI Summary" feature)

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (keep server-only, never expose) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |
| `ANTHROPIC_API_KEY` | console.anthropic.com — optional until you use AI review summaries |

### Database

Apply the schema to your Supabase project. Either:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

or paste the contents of `supabase/migrations/0001_init.sql` into the
Supabase SQL editor directly. Then optionally seed sample data with
`supabase/seed.sql` (also picked up automatically by `supabase db reset` in
local dev).

### Run

```bash
npm run dev
```

Without a real Supabase project configured, the app still builds and runs —
pages that read live data (menu, gallery, private events, reviews) render a
graceful "coming soon" empty state instead of erroring, so you can preview
the design immediately and wire up data later.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Adding real assets

Every photo/video on the site is currently a labeled placeholder
(`components/common/placeholder-media.tsx`) so the layout and motion are
correct without real media. Drop files into `public/` and pass a `src` prop
where each placeholder is used (or set `HERO_VIDEO_SRC` in
`features/home/components/hero.tsx` for the homepage video) — no other code
changes needed.
