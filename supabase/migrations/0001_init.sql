-- Miss Ginko — initial schema
-- Enums, tables, RLS policies, triggers, and storage buckets for the
-- restaurant site: menu, bookings, private events, reviews (+ AI summary
-- cache), gallery, contact, newsletter, and a lightweight admin CRM layer.

-- ============================================================================
-- Enums
-- ============================================================================

create type user_role as enum ('customer', 'staff', 'admin');
create type booking_area as enum ('indoor', 'outdoor', 'private');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
create type event_type as enum ('wedding', 'corporate', 'birthday', 'celebration', 'other');
create type event_status as enum ('new', 'contacted', 'confirmed', 'declined');
create type review_status as enum ('pending', 'approved', 'rejected');
create type gallery_category as enum ('interior', 'food', 'events', 'team');
create type contact_status as enum ('new', 'read', 'archived');

-- ============================================================================
-- Generic helper functions
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- profiles — extends auth.users
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_staff_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Profiles are viewable by owner or staff"
  on public.profiles for select
  using (auth.uid() = id or public.is_staff_or_admin());

create policy "Profiles are updatable by owner or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Menu
-- ============================================================================

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  dietary_tags text[] not null default '{}',
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'USD',
  image_url text,
  gallery text[] not null default '{}',
  is_chef_recommendation boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index menu_items_category_id_idx on public.menu_items (category_id);

create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

create policy "Menu categories are public"
  on public.menu_categories for select using (true);

create policy "Menu categories are staff-writable"
  on public.menu_categories for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

create policy "Available menu items are public"
  on public.menu_items for select
  using (is_available or public.is_staff_or_admin());

create policy "Menu items are staff-writable"
  on public.menu_items for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- ============================================================================
-- Gallery
-- ============================================================================

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  alt text not null,
  image_url text not null,
  category gallery_category not null,
  width integer,
  height integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

create policy "Gallery images are public"
  on public.gallery_images for select using (true);

create policy "Gallery images are staff-writable"
  on public.gallery_images for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- ============================================================================
-- Private events
-- ============================================================================

create table public.event_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  capacity_min integer not null check (capacity_min > 0),
  capacity_max integer not null check (capacity_max >= capacity_min),
  price_from numeric(10, 2) not null check (price_from >= 0),
  includes text[] not null default '{}',
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.private_events (
  id uuid primary key default gen_random_uuid(),
  event_type event_type not null,
  full_name text not null,
  email text not null,
  phone text not null,
  event_date date not null,
  guest_count integer not null check (guest_count > 0),
  package_id uuid references public.event_packages (id) on delete set null,
  message text,
  status event_status not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.event_packages enable row level security;
alter table public.private_events enable row level security;

create policy "Event packages are public"
  on public.event_packages for select using (true);

create policy "Event packages are staff-writable"
  on public.event_packages for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

create policy "Anyone can submit a private event inquiry"
  on public.private_events for insert with check (true);

create policy "Private event inquiries are staff-only to read"
  on public.private_events for select using (public.is_staff_or_admin());

create policy "Private event inquiries are staff-writable"
  on public.private_events for update
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- ============================================================================
-- Bookings + capacity
-- ============================================================================

create table public.restaurant_capacity (
  id uuid primary key default gen_random_uuid(),
  area booking_area not null,
  time_slot time not null,
  max_covers integer not null check (max_covers > 0),
  unique (area, time_slot)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  party_size integer not null check (party_size > 0),
  booking_date date not null,
  booking_time time not null,
  area booking_area not null,
  occasion text,
  special_requests text,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_date_time_area_idx on public.bookings (booking_date, booking_time, area);
create index bookings_user_id_idx on public.bookings (user_id);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.restaurant_capacity enable row level security;
alter table public.bookings enable row level security;

create policy "Capacity settings are public"
  on public.restaurant_capacity for select using (true);

create policy "Capacity settings are staff-writable"
  on public.restaurant_capacity for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

create policy "Anyone can create a booking"
  on public.bookings for insert with check (true);

create policy "Bookings are viewable by owner or staff"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_staff_or_admin());

create policy "Bookings are updatable by owner or staff"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_staff_or_admin())
  with check (auth.uid() = user_id or public.is_staff_or_admin());

-- Realtime availability: covers already booked for a given date/time/area,
-- counting only pending + confirmed bookings (cancelled/no_show free the slot).
-- security definer: anonymous guests booking a table can't SELECT other
-- people's rows under RLS, but still need an accurate remaining-capacity
-- count. This only ever returns an aggregate integer, never raw booking rows.
create or replace function public.available_covers(
  p_date date,
  p_time time,
  p_area booking_area
)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select greatest(
    coalesce((
      select max_covers from public.restaurant_capacity
      where area = p_area and time_slot = p_time
    ), 0) - coalesce((
      select sum(party_size) from public.bookings
      where booking_date = p_date
        and booking_time = p_time
        and area = p_area
        and status in ('pending', 'confirmed')
    ), 0),
    0
  );
$$;

-- ============================================================================
-- Reviews + AI-generated summary cache
-- ============================================================================

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  photos text[] not null default '{}',
  is_verified boolean not null default false,
  status review_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.review_summaries (
  id uuid primary key default gen_random_uuid(),
  generated_at timestamptz not null default now(),
  overall_rating_avg numeric(3, 2) not null,
  total_reviews integer not null,
  atmosphere_summary text not null,
  service_summary text not null,
  food_summary text not null,
  most_mentioned_dishes jsonb not null default '[]'
);

alter table public.reviews enable row level security;
alter table public.review_summaries enable row level security;

create policy "Approved reviews are public"
  on public.reviews for select
  using (status = 'approved' or auth.uid() = user_id or public.is_staff_or_admin());

create policy "Authenticated users can submit a review"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Reviews are moderated by staff"
  on public.reviews for update
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

create policy "Review summaries are public"
  on public.review_summaries for select using (true);

create policy "Review summaries are written by the service role only"
  on public.review_summaries for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- Contact + newsletter
-- ============================================================================

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status contact_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_submissions for insert with check (true);

create policy "Contact submissions are staff-only to read"
  on public.contact_submissions for select using (public.is_staff_or_admin());

create policy "Contact submissions are staff-writable"
  on public.contact_submissions for update
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert with check (true);

create policy "Anyone can update their own subscription by email match"
  on public.newsletter_subscribers for update using (true) with check (true);

create policy "Newsletter subscribers are staff-only to read"
  on public.newsletter_subscribers for select using (public.is_staff_or_admin());

-- ============================================================================
-- Admin CRM notes
-- ============================================================================

create table public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

alter table public.customer_notes enable row level security;

create policy "Customer notes are staff-only"
  on public.customer_notes for all
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- ============================================================================
-- Storage buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('menu-images', 'menu-images', true),
  ('gallery-images', 'gallery-images', true),
  ('event-photos', 'event-photos', true),
  ('review-photos', 'review-photos', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Public read for public buckets"
  on storage.objects for select
  using (bucket_id in ('menu-images', 'gallery-images', 'event-photos', 'review-photos', 'avatars'));

create policy "Staff can manage menu, gallery, and event images"
  on storage.objects for all
  using (bucket_id in ('menu-images', 'gallery-images', 'event-photos') and public.is_staff_or_admin())
  with check (bucket_id in ('menu-images', 'gallery-images', 'event-photos') and public.is_staff_or_admin());

create policy "Users can upload their own review photos"
  on storage.objects for insert
  with check (bucket_id = 'review-photos' and auth.uid() is not null);

create policy "Users can manage their own avatar"
  on storage.objects for all
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
