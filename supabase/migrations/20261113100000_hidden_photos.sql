-- ── MIGRATION 2026-11-13 — the admin can hide a photo from the album without deleting it ──────
-- A hidden photo stays in the table and the bucket; guests stop seeing it, the admin still does
-- and can show it again. Only the admin may change `hidden`, and nobody may change anything else.
-- Idempotent: the whole file may be re-run.

alter table public.photos add column if not exists hidden boolean not null default false;

-- 1. Reading: guests see the visible photos, the admin sees all of them ───────────────────────
drop policy if exists "photos: guests read the album" on public.photos;
create policy "photos: guests read the album"
  on public.photos for select
  to authenticated
  using (not hidden or public.is_admin());

-- 2. Updating: the admin only, and only the `hidden` column (column privilege) ─────────────────
drop policy if exists "photos: admins hide or show" on public.photos;
create policy "photos: admins hide or show"
  on public.photos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke update on public.photos from authenticated, anon;
grant update (hidden) on public.photos to authenticated;
