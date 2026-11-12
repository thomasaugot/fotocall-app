-- ── MIGRATION 2026-11-12 — admin role: may delete any photo (row and file) ─────────────────────
-- The admin is a REAL Supabase user (email + password), created by hand with `npm run admin:create`.
-- Its role lives in app_metadata.role = 'admin': only the service role can write app_metadata,
-- a user cannot set it on themselves (user_metadata, which a user CAN write, is never read).
-- Guests are unchanged. Idempotent: the whole file may be re-run.

-- 1. is_admin(): true only for a signed-in, non-anonymous user whose JWT carries the role ───────
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
     and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Admins delete any row (policies are permissive: they OR with "guests delete their own") ────
drop policy if exists "photos: admins delete any" on public.photos;
create policy "photos: admins delete any"
  on public.photos for delete
  to authenticated
  using (public.is_admin());

-- 3. Admins delete any file in the bucket ───────────────────────────────────────────────────────
drop policy if exists "photos bucket: admins delete any" on storage.objects;
create policy "photos bucket: admins delete any"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos' and public.is_admin());

-- Reading: every authenticated user already reads the whole album and the whole bucket.
-- The 60-photo cap (photo_count_for_current_user) counts only the caller's own rows and the admin
-- never uploads, so it needs no change.
