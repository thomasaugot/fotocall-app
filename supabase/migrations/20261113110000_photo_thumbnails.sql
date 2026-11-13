-- ── MIGRATION 2026-11-13 — a light grid copy of every photo ──────────────────────────────────
-- Grids (album, admin, peeks) show a 720 px copy; only the viewer and downloads fetch the full
-- photo. Keeps a party's worth of album scrolling inside the free plan's download allowance.
-- The copy lives in the same owner folder ({uid}/thumb-…), so the storage policies already cover
-- it. Older photos have no copy (NULL): the app falls back to the full photo. Idempotent.

alter table public.photos add column if not exists thumb_path text;

-- A guest's row may only point at a copy inside their own folder, like storage_path.
drop policy if exists "photos: guests add their own" on public.photos;
create policy "photos: guests add their own"
  on public.photos for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and storage_path like (select auth.uid())::text || '/%'
    and (thumb_path is null or thumb_path like (select auth.uid())::text || '/%')
    and public.photo_count_for_current_user() < 60
  );
