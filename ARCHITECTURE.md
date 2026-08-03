# Miss Ginko — Application Architecture

A production-ready, motion-first restaurant website. This document is the
single reference for how the codebase is organized, how the pieces fit
together, and how to extend it safely. It reflects the code as built, not a
hypothetical plan — file paths below exist in the repo today.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui
(Base UI) · GSAP + Lenis · Supabase (Postgres, Auth, Storage, Realtime) ·
Anthropic Claude (AI review summarization)**.

---

## 1. Complete Folder Structure

```
msginko2/
├─ supabase/
│  ├─ migrations/0001_init.sql   # full schema: enums, tables, RLS, triggers, storage buckets
│  └─ seed.sql                   # local dev sample data (supabase db reset picks this up)
├─ public/                       # static assets — drop real photography/video here
├─ src/
│  ├─ app/                       # routes only — thin, data-fetching + composition
│  │  ├─ (marketing)/            # public site, shares root layout's nav/footer
│  │  │  ├─ page.tsx             # home
│  │  │  ├─ about/
│  │  │  ├─ menu/
│  │  │  ├─ gallery/
│  │  │  ├─ private-events/
│  │  │  ├─ reviews/
│  │  │  ├─ booking/
│  │  │  │  └─ success/
│  │  │  ├─ contact/
│  │  │  └─ faq/
│  │  ├─ (auth)/
│  │  │  ├─ login/
│  │  │  └─ register/
│  │  ├─ admin/                  # staff/admin-only, own layout + sidebar
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx             # dashboard
│  │  │  ├─ reservations/
│  │  │  ├─ private-events/
│  │  │  ├─ reviews/
│  │  │  ├─ menu/
│  │  │  ├─ gallery/
│  │  │  ├─ customers/
│  │  │  ├─ newsletter/
│  │  │  └─ contact/
│  │  ├─ api/                    # reserved for route handlers (og image, revalidate webhooks)
│  │  ├─ layout.tsx               # root: fonts, Lenis, cursor, loader, navbar/footer, JSON-LD
│  │  ├─ globals.css             # design tokens + Tailwind v4 @theme
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ components/
│  │  ├─ ui/                     # shadcn primitives (button, dialog, select, sheet, ...)
│  │  ├─ layout/                 # navbar, footer, loader, nav-link
│  │  └─ common/                 # cross-feature presentational: MaskedTitle, Reveal,
│  │                             # MagneticButton, PlaceholderMedia, ParallaxImage,
│  │                             # Marquee, ScrollIndicator, StarRating, CursorProvider
│  ├─ features/                  # one folder per domain; page.tsx composes these
│  │  ├─ home/components/        # Hero, Philosophy, ChefStory, Ingredients, ...
│  │  ├─ menu/components/
│  │  ├─ booking/components/
│  │  ├─ private-events/components/
│  │  ├─ gallery/components/
│  │  ├─ about/components/
│  │  ├─ reviews/components/
│  │  ├─ contact/components/
│  │  ├─ auth/components/
│  │  └─ admin/components/
│  ├─ animations/
│  │  ├─ gsap.ts                 # plugin registration + named CustomEase (once, memoized)
│  │  ├─ lenis.tsx               # LenisProvider — drives Lenis off the GSAP ticker
│  │  └─ hooks/                  # useSplitReveal, useScrollReveal, useParallax,
│  │                             # usePinnedSection, useMagnetic
│  ├─ hooks/                     # non-animation reusable hooks (reserved for growth)
│  ├─ lib/
│  │  ├─ utils.ts                # cn() — clsx + tailwind-merge
│  │  └─ fonts.ts                # next/font declarations (Fraunces + Inter)
│  ├─ services/                  # ALL Supabase/Anthropic access lives here — pure functions,
│  │                             # no React imports. Pages/actions call these, never the
│  │                             # Supabase client directly.
│  │  ├─ menu.service.ts
│  │  ├─ booking.service.ts
│  │  ├─ events.service.ts
│  │  ├─ gallery.service.ts
│  │  ├─ reviews.service.ts
│  │  ├─ ai-summary.service.ts   # Claude Haiku 4.5 review summarization
│  │  ├─ contact.service.ts
│  │  ├─ newsletter.service.ts
│  │  └─ admin.service.ts
│  ├─ actions/                   # 'use server' — the only layer allowed to call services
│  │                             # from a mutation path; validates with zod first
│  │  ├─ booking.actions.ts
│  │  ├─ events.actions.ts
│  │  ├─ reviews.actions.ts
│  │  ├─ contact.actions.ts
│  │  ├─ newsletter.actions.ts
│  │  ├─ auth.actions.ts
│  │  └─ admin.actions.ts
│  ├─ schemas/                   # zod — shared client/server validation, one file per form
│  ├─ types/
│  │  └─ database.ts             # hand-authored mirror of the SQL migration (Row/Insert/
│  │                             # Update/Relationships per table) — swap for `supabase gen
│  │                             # types typescript` output once a project is linked
│  ├─ supabase/
│  │  ├─ client.ts               # browser client (Client Components)
│  │  ├─ server.ts               # cookie-aware client (Server Components/Actions) +
│  │                             # service-role client (admin-only privileged ops)
│  │  └─ public.ts               # cookie-free client for public catalog reads — lets
│  │                             # menu/gallery/events pages stay static/ISR instead of
│  │                             # being forced fully dynamic by cookies()
│  ├─ seo/
│  │  ├─ metadata.ts             # buildMetadata() + defaultMetadata — every route uses this
│  │  └─ jsonld.ts               # Restaurant, Breadcrumb, FAQ, Menu schema builders
│  ├─ config/
│  │  ├─ site.ts                 # name, contact, hours, nav, socials — single source of truth
│  │  └─ motion.ts               # shared easing/duration constants (GSAP + CSS both read this)
│  └─ middleware.ts              # session refresh + /admin fast-path redirect
├─ .env.local.example
├─ ARCHITECTURE.md               # this file
└─ package.json
```

**Why this split:** `services/` never imports React; `actions/` never talks to
Supabase directly (always through a service); `features/*/components` never
fetch data themselves (server components in `app/` fetch, then pass props
down). This makes every layer independently testable and means a developer
can trace any piece of data from database column to rendered pixel through
exactly three hops.

---

## 2. Route Structure

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static (ISR-eligible) | Hero + 8 storytelling sections |
| `/about` | Static | Story, philosophy, timeline, team, awards |
| `/menu` | Static, `revalidate: 3600` | Uses the cookie-free public client so cookies never force dynamic |
| `/gallery` | Static, `revalidate: 3600` | Masonry grid + fullscreen viewer |
| `/private-events` | Static, `revalidate: 3600` | Packages + inquiry form |
| `/reviews` | Dynamic | Reads `auth.getUser()` to gate the review form |
| `/booking` | Static | Form is fully client-side interactive |
| `/booking/success` | Dynamic | Reads `searchParams` |
| `/contact` | Static | Form + embedded map (no API key required) |
| `/faq` | Static | FAQ schema JSON-LD |
| `/login`, `/register` | Dynamic | `noIndex`, Supabase Auth email/password |
| `/admin/*` | Dynamic | Gated by `middleware.ts` + `admin/layout.tsx` + RLS |
| `/robots.txt`, `/sitemap.xml` | Generated | `app/robots.ts`, `app/sitemap.ts` |

Route groups `(marketing)` and `(auth)` don't affect URLs — they exist purely
to scope layouts/conventions without nesting `/marketing/` into every path.

---

## 3. Component Hierarchy

```
RootLayout
├─ <script> Restaurant JSON-LD
├─ LenisProvider                  (smooth scroll, drives GSAP ticker)
│  └─ CursorProvider               (global custom cursor, desktop-only)
│     ├─ Loader                    (mounts once per hard navigation)
│     ├─ Navbar                    (transparent → solid on scroll, mobile Sheet)
│     ├─ <main>{page}</main>
│     └─ Footer                    (newsletter, hours, social, map link)
└─ Toaster (sonner)
```

Every marketing page follows the same composition pattern: a thin
`app/.../page.tsx` server component fetches data (or catches a fetch failure
gracefully) and renders `features/<domain>/components/*`, which are themselves
built from `components/common/*` primitives (`Reveal`, `MaskedTitle`,
`PlaceholderMedia`, `MagneticButton`). No feature component reaches into
another feature's folder — cross-feature reuse always goes through
`components/common`.

---

## 4. UI System

- **Primitives:** shadcn/ui on the `base-nova` style, built on **Base UI**
  (`@base-ui/react`) rather than Radix — this project was scaffolded against
  the current shadcn CLI default. Key API difference from the Radix-era
  shadcn docs: no `asChild` prop — composition uses a `render` prop
  (`<SheetClose render={<Link href="/x" />}>`), and most primitives ship a
  `data-slot` attribute for styling hooks.
- **Styling:** Tailwind v4, CSS-first config (`@theme` in `globals.css`, no
  `tailwind.config.js`). Brand tokens (`--primary`, `--background`,
  `--secondary`, the `ink-50…950` scale) are plain hex custom properties, not
  oklch, so the exact brand colors given in the brief are reproduced exactly.
- **Dark surfaces:** a local `.theme-dark` class (not Tailwind's `dark:`
  variant) re-scopes the same CSS custom properties for a subtree — used on
  the footer, loader, and alternating dark sections — so light/dark switches
  per-section rather than site-wide.
- **Icons:** `lucide-react`. Note: brand/logo glyphs (Instagram, Facebook,
  Twitter) were removed from lucide-react's core package upstream; hand-authored
  SVGs live in `components/common/social-icons.tsx` instead of a second icon
  dependency.

---

## 5–7. Animation Architecture, GSAP Timeline Planning, Lenis Integration

**Principle:** motion guides attention, never runs everywhere at once. Every
animated primitive respects `prefers-reduced-motion` by skipping straight to
the end state — checked via `window.matchMedia` inside each hook, no global
kill-switch needed.

**Lenis + GSAP are one clock.** `animations/lenis.tsx` does *not* run Lenis's
own `requestAnimationFrame` loop — it registers Lenis's `raf()` on
`gsap.ticker` instead, and forwards `lenis.on("scroll", ScrollTrigger.update)`.
This is the standard integration pattern and is why scroll-pinned sections
never visibly desync from scrub animations.

**`animations/gsap.ts`** is the single place plugins are registered
(`ScrollTrigger`, `SplitText`, `CustomEase`) and where the three named eases
live: `premium` (`0.16,1,0.3,1` — slow start, decisive settle; used for
reveals/pins), `soft` (hover/micro-interactions), `snap` (cursor/magnetic
follow). `registerGsap()` is idempotent — safe to call from every hook.

**Reusable hooks** (`animations/hooks/`), each independently reduced-motion-safe:

| Hook | Used for |
|---|---|
| `useSplitReveal` | Masked line/word/char text reveals (headings) |
| `useScrollReveal` | Generic fade/rise/clip-path-wipe for images & blocks |
| `useScrollParallax` / `useMouseParallax` | Background image drift, hero decorative elements |
| `usePinnedSection` | Scroll-scrubbed pinned storytelling (ingredients horizontal scroller) |
| `useMagnetic` | Button/link magnetic hover |

**Sequencing example — Hero (`features/home/components/hero.tsx`):** the hero
does *not* animate on mount. It listens for `LOADER_COMPLETE_EVENT` (a
`CustomEvent` the `Loader` dispatches after its own exit timeline finishes),
then runs one `gsap.timeline()`: media scale-down (2.2s) → eyebrow fade →
headline `SplitText` line reveal (staggered) → CTA fade → scroll-indicator
fade. Reduced-motion users get the same event but skip straight to the final
state. This event-based handoff — rather than a fixed delay — is what keeps
the loader-to-hero transition frame-accurate regardless of asset load time.

**Custom cursor** (`components/common/cursor-provider.tsx`) is a single
global instance (dot + lagging ring) mounted once in the root layout,
enabled only for `pointer: fine` + non-reduced-motion, with a
`useCursorLabel()` context any component can call to show "View"/"Drag" text
in the ring on hover.

---

## 8–9. Supabase Schema & Database Tables

Full DDL: `supabase/migrations/0001_init.sql`. Summary:

| Table | Purpose | Key RLS policy |
|---|---|---|
| `profiles` | Extends `auth.users`; `role` enum (`customer`/`staff`/`admin`) | Owner or staff can read; owner or admin can update |
| `menu_categories`, `menu_items` | Public menu catalog | Public read (available items only); staff-writable |
| `gallery_images` | Gallery catalog | Public read; staff-writable |
| `event_packages` | Private-event package catalog | Public read; staff-writable |
| `private_events` | Event inquiries | Public insert; staff-only read/update |
| `restaurant_capacity` | Max covers per area/time-slot | Public read; staff-writable |
| `bookings` | Reservations | Public insert; owner-or-staff read/update |
| `reviews` | Guest reviews | Public read (approved only); authenticated insert; staff moderates |
| `review_summaries` | Cached AI-generated summary | Public read; admin-only write |
| `contact_submissions` | Contact form | Public insert; staff-only read/update |
| `newsletter_subscribers` | Newsletter | Public insert/update by email; staff-only read |
| `customer_notes` | Internal CRM notes | Staff-only, all operations |

**Helper functions:** `is_staff_or_admin()` / `is_admin()` (`security definer`,
used inside RLS policies) and `available_covers(date, time, area)` — also
`security definer`, because an **anonymous** guest booking a table must get an
accurate remaining-capacity count even though the `bookings` RLS policy
otherwise hides other guests' rows from them. This is the one place the
migration deliberately steps around RLS, and it only ever returns an
aggregate integer, never raw rows.

**Triggers:** `handle_new_user()` auto-creates a `profiles` row on
`auth.users` insert; `set_updated_at()` maintains `updated_at` on `bookings`
and `menu_items`.

**Storage buckets** (all public-read): `menu-images`, `gallery-images`,
`event-photos`, `review-photos`, `avatars` — with per-bucket write policies
(staff for menu/gallery/events, own-row-only for avatars keyed by
`auth.uid()` as the folder prefix, authenticated-insert for review photos).

**`supabase/seed.sql`** populates categories, sample menu items, gallery
placeholders, event packages, capacity slots, and a seed `review_summaries`
row — run automatically by `supabase db reset` in local dev.

---

## 10. Authentication Flow

Supabase Auth, email/password, via `@supabase/ssr`:

1. **Sign up** (`/register`) → `supabase.auth.signUp()` → `handle_new_user()`
   trigger creates the `profiles` row (`role: customer` by default).
2. **Sign in** (`/login`) → `signInWithPassword()` → session cookie set by
   the cookie-aware server client.
3. **Session refresh** happens on every request in `middleware.ts` — this is
   required so Server Components always see a non-expired session, not just
   an optimization.
4. **Role gating:** middleware redirects unauthenticated `/admin/*` requests
   to `/login?redirectTo=/admin`, and redirects authenticated non-staff users
   to `/`. `admin/layout.tsx` re-checks the same thing server-side (defense in
   depth) before rendering the sidebar. **The real security boundary is
   Postgres RLS**, not either of these checks — both are UX fast-paths.
5. **Sign out** — a server action (`signOutAction`) called from a plain
   `<form action={...}>` in the admin sidebar, no client JS required.

Three Supabase client variants exist for a reason (`supabase/client.ts`,
`server.ts`, `public.ts`) — see the folder-structure table above. Never
import `supabase/server.ts`'s `createServiceClient()` (service-role key,
bypasses RLS) from anything reachable by a Client Component bundle; it's
used exactly once today, inside `ai-summary.service.ts`, which only ever
runs from an admin server action.

---

## 11. Reservation Workflow

1. Guest fills the booking form (`features/booking/components/booking-form.tsx`)
   — date (shadcn `Calendar` in a `Popover`), time/area/occasion (`Select`,
   values mirrored into hidden inputs so `FormData` always has a plain
   string regardless of the Base UI component's internal state), guests,
   contact details, special requests.
2. As date/time/area become complete, `AvailabilityBadge` debounces (350ms)
   a call to `checkAvailabilityAction`, which calls the `available_covers`
   RPC and shows a live "X seats available" / "only Y left" indicator —
   this is the **realtime availability** requirement, implemented as an
   on-demand accurate check rather than a client subscription (a client
   can't subscribe to Postgres changes on rows RLS hides from it, so a
   security-definer RPC is the correct mechanism here, not
   `supabase.channel()`).
3. On submit, `createBookingAction` re-validates with zod server-side,
   re-checks availability (never trust the client's last-seen number),
   inserts the booking, and `redirect()`s to `/booking/success?ref=<id>`.
4. Staff manage status (`pending → confirmed/cancelled/completed/no_show`)
   from `/admin/reservations` via `StatusActions`, a generic optimistic
   status-transition component reused across bookings/reviews/events/contact.

---

## 12–13. Review Workflow & AI Summarization Workflow

**Submission:** requires a signed-in user (RLS: `insert ... with check
(auth.uid() = user_id)`) — anonymous review spam is blocked at the database
layer, not just in the UI. New reviews land as `status: pending`; only
`approved` reviews are public. Staff moderate from `/admin/reviews`.

**AI summarization** (`services/ai-summary.service.ts`):

- Triggered manually from `/admin/reviews` ("Regenerate AI Summary") — not on
  every page load, since it's a real LLM call over up to 300 reviews.
- Pulls the 300 most recent **approved** reviews via the service-role client
  (needs full comment text, which a staff session's RLS view would also
  allow, but the service-role path keeps this one write path simple).
- Computes `overall_rating_avg` / `total_reviews` in code (never asks the
  model to do arithmetic).
- Calls **Claude Haiku 4.5** (`claude-haiku-4-5`) — deliberately the cheap/fast
  tier, since this is a high-volume batch summarization job with no
  reasoning requirement, not an agentic task.
- Requests **structured output** via `client.messages.parse()` +
  `zodOutputFormat(summarySchema)` (the modern Anthropic SDK
  structured-outputs path) rather than prompting for "please return JSON" —
  guarantees a schema-valid `{ atmosphere_summary, service_summary,
  food_summary, most_mentioned_dishes[] }` response with no parsing
  fallback logic needed.
- Inserts a new row into `review_summaries` (append-only cache — the public
  reviews page always reads the latest by `generated_at`).

To wire this up for real: set `ANTHROPIC_API_KEY` in the environment; no
other configuration is needed.

---

## 14. Admin Dashboard Architecture

`app/admin/layout.tsx` is auth-gated (see §10) and renders a fixed sidebar
(`Dashboard, Reservations, Private Events, Reviews, Menu, Gallery, Customers,
Newsletter, Messages`) plus `{children}`. Deliberately **not** built with the
GSAP motion system — an internal tool should be fast and boring, not
cinematic.

| Screen | Status |
|---|---|
| Dashboard | Live counts (pending bookings/reviews/inquiries/messages) |
| Reservations | Full list + status transitions |
| Reviews | Full list + moderation + AI summary regeneration |
| Private Events | Full list + status transitions |
| Messages (contact) | Full list + status transitions |
| Customers | Read-only table (`profiles`) |
| Newsletter | Read-only table (`newsletter_subscribers`) |
| Menu, Gallery | Read-only list — **CRUD forms (image upload to Storage,
  create/edit/delete) are the next thing to build on this codebase**, using
  the exact `services/admin.service.ts` + `actions/admin.actions.ts` +
  `StatusActions`-style pattern already established for the other screens |

`features/admin/components/status-actions.tsx` is the one generic piece
worth knowing: it takes an entity's current status, a list of `{value,
label}` transitions, and the bound server action, and renders a button per
transition with `useTransition` for optimistic pending state — every admin
list screen reuses this instead of hand-rolling status dropdowns.

---

## 15. SEO Architecture

- **Metadata:** every route's `metadata` export funnels through
  `seo/metadata.ts`'s `buildMetadata()` — canonical URL, OG (1200×630),
  Twitter card, robots directives — so no page hand-rolls these and drifts.
  `defaultMetadata` in the root layout sets the title template
  (`%s — Miss Ginko`).
- **JSON-LD:** `Restaurant` schema (address, geo, opening hours, cuisine)
  injected once in the root layout; `Menu` schema on `/menu`; `FAQPage`
  schema on `/faq`; a `breadcrumbJsonLd()` builder is ready for any page
  that needs it.
- **`sitemap.ts` / `robots.ts`:** generated via the Next.js Metadata API,
  disallowing `/admin`, `/api`, `/booking/success`.
- **Dynamic OG images:** `app/api/og/` is reserved for an
  `ImageResponse`-based route once real photography exists — not built yet
  since it would only render the placeholder gradient.
- **Core Web Vitals levers already in place:** `next/font` with `display:
  swap`, `next/image` wired into `PlaceholderMedia` (swaps to a real
  `<Image>` the instant a `src` prop is supplied — no call-site changes
  needed later), ISR on the three catalog pages (see §2), and the
  cookie-free `supabase/public.ts` client specifically so those pages aren't
  forced into fully dynamic rendering by an unrelated cookie read.

---

## 16. Accessibility Checklist

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` throughout.
- All interactive custom components (Sheet, Dialog, Select, Accordion,
  Popover) are Base UI primitives — full keyboard nav, focus trapping, and
  ARIA wiring ship with the library, not hand-rolled.
- Every animation hook checks `prefers-reduced-motion` and renders the final
  state statically instead of animating — including the full-screen loader,
  which skips itself entirely.
- Custom cursor is desktop-only (`pointer: fine`) and never replaces default
  focus indicators.
- Form errors are rendered as visible text tied to the field, not
  color-only.
- Color contrast: body text is near-black (`#221d1e`) on `#dbdbdb`/`#f2f0ed`
  surfaces — comfortably AA; the primary red (`#b32e3d`) is used for CTAs
  and accents at sizes/weights that pass AA for large text, and paired with
  white text on solid buttons.
- **Outstanding for a full WCAG AA audit:** run automated contrast checks on
  every text/background combination once real photography is in (dark
  overlays over unknown-brightness images can drop contrast), and a
  keyboard-only pass through the booking form's `Calendar`/`Select`
  combination specifically.

---

## 17. Performance Strategy

- Server Components by default; `"use client"` only where interaction/hooks
  require it (forms, animated sections, the loader, the cursor).
- ISR on `/menu`, `/gallery`, `/private-events` (see §2/§15) instead of
  forcing dynamic rendering.
- `next/image` throughout `PlaceholderMedia`'s real-asset path.
- GSAP/Lenis registration is memoized (`registerGsap()` runs once regardless
  of how many hooks import it) — no duplicate plugin registration cost.
- Fonts loaded via `next/font/google` (self-hosted, no external request,
  `display: swap`).
- **Video:** the hero is built to accept a real `<video>` (`autoPlay muted
  loop playsInline`) the moment `HERO_VIDEO_SRC` in
  `features/home/components/hero.tsx` is set — until then it renders a
  static gradient placeholder rather than shipping a broken/missing video
  request.

---

## 18. Responsive Behavior

Mobile-first Tailwind throughout (`sm:`/`md:`/`lg:` add complexity, never
required for the base layout to work). Specific patterns:

- Navbar collapses to a full-screen `Sheet` menu with large touch targets
  below `md:`.
- The custom cursor and magnetic-hover effects are inert on
  `pointer: coarse` — desktop-only enhancements, never required for mobile
  usability.
- Menu/Reviews pages reflow from sidebar+content to stacked single-column
  below `lg:`.
- Gallery grid: `columns-1` → `sm:columns-2` → `lg:columns-3`.
- **Not yet built:** a floating mobile "Reserve" button and gesture-based
  (swipe) gallery navigation, both called out explicitly in the brief —
  see §24.

---

## 19–20. Motion Specification & Design Tokens

Central config in `config/motion.ts` (durations, stagger, the three named
eases, Lenis config) and `config/site.ts` (brand facts). Full token set in
`src/app/globals.css`'s `@theme` block:

| Token | Value | Use |
|---|---|---|
| `--primary` | `#b32e3d` | CTAs, accents — used sparingly per brief |
| `--background` | `#dbdbdb` | Page background |
| `--secondary` / `--ink` | `#3a3031` | Dark surfaces, footer, headings on light |
| `--paper` | `#f2f0ed` | Card/menu-item surfaces |
| `ink-50…950` | full warm-neutral scale | Any grayscale need |
| `--text-display-xl…sm` | `clamp(...)` fluid scale | Editorial headings, no manual breakpoint tuning |
| `--ease-premium/soft/snap` | cubic-beziers | Mirrored in `CustomEase` for GSAP |

Fonts: **Fraunces** (variable, optical-size axis) for display/headings,
**Inter** for body/UI — see `lib/fonts.ts`.

---

## 21–22. Component Documentation & Coding Standards

- **No prop-drilling data through more than one layer:** pages fetch, feature
  components render — enforced by convention, not tooling, so keep new pages
  following the same shape.
- **Naming:** `kebab-case.tsx` files, `PascalCase` exports, one component
  per file except tightly-coupled pairs (e.g. `MenuItemRow` +its dialog).
- **Server actions** always: `"use server"` at the top, zod `safeParse`
  first, return a typed `{ success, error?, fieldErrors? }` result — never
  throw across the server/client boundary.
- **Comments:** only where a non-obvious constraint exists (see
  `available_covers`'s `security definer`, or the Lenis/GSAP ticker
  wiring) — not restating what the code already says.
- **Placeholders:** every stand-in image goes through `PlaceholderMedia`,
  which self-documents in the rendered UI (visible label like "Chef portrait
  — add /images/chef-portrait.jpg") so a non-technical stakeholder reviewing
  the live site can see exactly what's missing, and swaps to a real
  `next/image` the instant a `src` is supplied.

---

## 23. Deployment Strategy

**Target: Vercel** (zero-config for this stack).

1. Push to a Git provider Vercel can import.
2. Set environment variables (from `.env.local.example`):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_`),
   `NEXT_PUBLIC_SITE_URL`, `ANTHROPIC_API_KEY`.
3. Provision Supabase: create a project, run
   `supabase link` + `supabase db push` (or paste `supabase/migrations/0001_init.sql`
   into the SQL editor), then `supabase/seed.sql` for sample data.
4. In Supabase Auth settings, add the production URL to allowed redirect
   URLs.
5. Deploy — `next build` runs cleanly with zero Supabase connectivity (every
   public-data page degrades to a graceful empty state instead of a 500;
   see the `try/catch` around every `service.ts` call in `app/(marketing)/*`),
   so a broken/unset Supabase env var never breaks the build itself, only
   the data on those pages until it's configured.

No custom server, no Docker required for the app itself. Supabase local dev
(`supabase start`) requires Docker only if you want a local Postgres instead
of a hosted project — the app has no other Docker dependency.

---

## 24. Future Scalability

Explicitly out of scope for this pass, in priority order for a follow-up:

1. **Admin CRUD for Menu & Gallery** — image upload to the `menu-images` /
   `gallery-images` Storage buckets, full create/edit/delete forms, following
   the `services/admin.service.ts` + `StatusActions` pattern already in place.
2. **Real assets** — swap every `PlaceholderMedia` call for a real
   `src` (photography, and `HERO_VIDEO_SRC` in `hero.tsx` for the cinematic
   background video). No component code changes required.
3. **Dynamic OG images** (`app/api/og/route.tsx` via `ImageResponse`) once
   real photography exists to compose into them.
4. **Mobile floating Reserve button** and **gesture-based gallery swipe**.
5. **Newsletter unsubscribe flow** — currently insert/upsert only; a signed
   unsubscribe-token link is the natural next step (noted in the
   `newsletter_subscribers` RLS policy comment).
6. **E2E tests** — Playwright is already a devDependency (used for this
   build's manual verification passes); wiring it into CI as real specs
   covering the booking and review-submission flows is the highest-value
   next testing investment.
7. **Supabase Realtime subscriptions** for the admin dashboard (live-updating
   counts instead of per-navigation refetch) — deferred because RLS makes a
   naive `postgres_changes` subscription on `bookings`/`reviews` leak
   nothing today (staff already see everything), but it's worth adding once
   the admin panel sees concurrent staff usage.
8. **CI pipeline** — `npm run build && npm run lint` as a required check
   before merge; add Playwright specs from point 6 once they exist.
