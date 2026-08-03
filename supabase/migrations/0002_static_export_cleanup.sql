-- Static-export cleanup for existing Supabase projects.
-- Keeps browser-only Supabase access safe and removes unused AI/storage setup.

drop policy if exists "Anyone can create a booking" on public.bookings;

create policy "Anyone can create a booking"
  on public.bookings for insert
  with check (user_id is null or auth.uid() = user_id or public.is_staff_or_admin());

drop table if exists public.review_summaries;

drop policy if exists "Public read for public buckets" on storage.objects;
drop policy if exists "Staff can manage menu, gallery, and event images" on storage.objects;
drop policy if exists "Users can upload their own review photos" on storage.objects;
drop policy if exists "Users can manage their own avatar" on storage.objects;

delete from storage.buckets bucket
where bucket.id in (
  'menu-images',
  'gallery-images',
  'event-photos',
  'review-photos',
  'avatars'
)
and not exists (
  select 1
  from storage.objects obj
  where obj.bucket_id = bucket.id
);
