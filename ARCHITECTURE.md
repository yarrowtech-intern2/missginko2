# Miss Ginko Architecture

This app is a static-export Next.js 16 App Router site. Production hosting is a
static file host, and Supabase is the only backend service.

## Stack

- Next.js 16 with `output: "export"`
- TypeScript
- Tailwind CSS v4
- shadcn/ui on Base UI
- GSAP + Lenis for motion
- Supabase Postgres/Auth with RLS

There is no deployed Node.js backend, no Next middleware, no Server Actions,
no service-role key in the frontend, no AI summary service, and no Supabase
Storage uploads for heavy files.

## Runtime Shape

Public pages are statically generated into `out/`.

Public catalog reads such as menu packages/reviews can run during `next build`
through the anon Supabase key. Form submissions and admin screens run in the
browser against Supabase using the anon key. Supabase RLS policies are the
security boundary.

## Important Directories

| Path | Purpose |
|---|---|
| `src/app` | App Router pages and layouts |
| `src/features` | Feature components for marketing pages, forms, and admin views |
| `src/services` | Supabase read/write functions |
| `src/supabase/client.ts` | Browser Supabase client for auth and RLS-protected operations |
| `src/supabase/public.ts` | Cookie-free anon client for public build-time reads |
| `src/schemas` | Shared zod validation |
| `src/types/database.ts` | Hand-authored Supabase type mirror |
| `supabase/migrations` | Database schema and cleanup migrations |

## Supabase Security

The frontend only receives:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Admin access is handled in the browser:

1. `/admin/*` renders a static admin shell.
2. The shell reads the current Supabase Auth user.
3. It loads the matching `profiles.role`.
4. Only `staff` and `admin` users see admin content.
5. All admin reads/writes still require matching RLS policies in Supabase.

This client-side gate is for UX. The database policies are what protect the
data.

## Egress Rules

- Do not upload food/gallery/menu images to Supabase Storage.
- Use external image URLs or files in `public/`.
- Keep admin selects narrow and limited.
- Use count queries with `head: true` for dashboard totals.
- Do not add realtime subscriptions unless the user explicitly asks for them.
- Do not add service-role or third-party API secrets to Render Static Site env.

## Database

`supabase/migrations/0001_init.sql` creates:

- profiles
- menu categories/items
- gallery image URL metadata
- event packages and private-event inquiries
- restaurant capacity and bookings
- reviews
- contact submissions
- newsletter subscribers
- customer notes

`supabase/migrations/0002_static_export_cleanup.sql` is for projects that
already ran the older schema. It tightens booking insert RLS, removes the old
review-summary table, and removes empty Storage buckets/policies from the old
setup.

## Deployment

Render Static Site settings:

| Setting | Value |
|---|---|
| Root Directory | blank, unless the repo is inside a subfolder |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `out` |
| Env Vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` |

`npm run start` is not the production path for Render Static Site.
