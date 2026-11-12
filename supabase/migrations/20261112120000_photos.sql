-- ── MIGRATION 2026-11-12 — photos table, private bucket, access rules ──────────────────────
-- Guests have an ANONYMOUS Supabase session (role `authenticated`, is_anonymous = true).
-- Every guest sees every photo (it is a shared album); a guest writes and deletes only their own.
-- Idempotent end to end: the whole file may be re-run.

-- 1. Table ──────────────────────────────────────────────────────────────────────────────────
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  guest_name    text not null check (char_length(btrim(guest_name)) between 1 and 60),
  storage_path  text not null unique,
  width         integer not null check (width between 1 and 4096),
  height        integer not null check (height between 1 and 4096),
  created_at    timestamptz not null default now()
);

create index if not exists photos_created_at_idx on public.photos (created_at desc);
create index if not exists photos_owner_id_idx on public.photos (owner_id);

alter table public.photos enable row level security;

-- Caps one guest at 60 photos: a stolen or looping session cannot fill the bucket.
-- security definer so the count sees every row of that owner regardless of RLS; it only ever
-- counts the CALLER's rows (auth.uid()), so it leaks nothing.
create or replace function public.photo_count_for_current_user()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.photos where owner_id = (select auth.uid())
$$;

revoke all on function public.photo_count_for_current_user() from public, anon;
grant execute on function public.photo_count_for_current_user() to authenticated;

-- 2. Table policies: select / insert / update / delete, all explicit ─────────────────────────
drop policy if exists "photos: guests read the album" on public.photos;
create policy "photos: guests read the album"
  on public.photos for select
  to authenticated
  using (true);

drop policy if exists "photos: guests add their own" on public.photos;
create policy "photos: guests add their own"
  on public.photos for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and storage_path like (select auth.uid())::text || '/%'
    and public.photo_count_for_current_user() < 60
  );

drop policy if exists "photos: nobody edits" on public.photos;
create policy "photos: nobody edits"
  on public.photos for update
  to authenticated
  using (false)
  with check (false);

drop policy if exists "photos: guests delete their own" on public.photos;
create policy "photos: guests delete their own"
  on public.photos for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- 3. Bucket: private, size and type enforced by the bucket itself ────────────────────────────
-- WebP from the browser's resize; JPEG is the fallback for Safari, whose canvas cannot encode WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 5242880, array['image/webp', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 4. Storage policies: path = {owner uid}/{generated id}.{webp|jpg} ─────────────────────────────
drop policy if exists "photos bucket: guests read" on storage.objects;
create policy "photos bucket: guests read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'photos');

drop policy if exists "photos bucket: guests upload into their folder" on storage.objects;
create policy "photos bucket: guests upload into their folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "photos bucket: nobody overwrites" on storage.objects;
create policy "photos bucket: nobody overwrites"
  on storage.objects for update
  to authenticated
  using (false)
  with check (false);

drop policy if exists "photos bucket: guests delete their own" on storage.objects;
create policy "photos bucket: guests delete their own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
