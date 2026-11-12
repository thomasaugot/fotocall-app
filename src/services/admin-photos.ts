import { supabase } from "@/lib/supabase"
import type { Photo } from "@/types/photo"

const BUCKET = "photos"

// Admin only (RLS: is_admin()). Rows first: the album stops showing them even if the file removal
// then fails. RLS hides a refused delete as "0 rows", so the count is checked.
export const deletePhotos = async (photos: Pick<Photo, "id" | "storagePath">[]): Promise<void> => {
  if (photos.length === 0) return
  const rows = await supabase.from("photos").delete().in("id", photos.map((p) => p.id)).select("id")
  if (rows.error) throw rows.error
  if ((rows.data?.length ?? 0) !== photos.length) throw new Error("Not every photo row was deleted")

  const files = await supabase.storage.from(BUCKET).remove(photos.map((p) => p.storagePath))
  if (files.error) throw files.error
}
