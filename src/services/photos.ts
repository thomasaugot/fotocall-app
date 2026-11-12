import { SIGNED_URL_SECONDS } from "@/constants/upload-limits"
import { supabase } from "@/lib/supabase"
import type { NewPhoto, Photo } from "@/types/photo"
import { storagePathFor } from "@/utils/image-file"

const BUCKET = "photos"

// Raw calls only: no React, no cache, and every error is thrown (04-CLIENT_SERVER).
export const listPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from("photos")
    .select("id, owner_id, guest_name, storage_path, width, height, created_at")
    .order("created_at", { ascending: false })
  if (error) throw error
  if (!data || data.length === 0) return []

  // Private bucket: short-lived signed URLs, never a public bucket (11-SECURITY).
  const signed = await supabase.storage.from(BUCKET).createSignedUrls(data.map((r) => r.storage_path), SIGNED_URL_SECONDS)
  if (signed.error) throw signed.error
  const urls = new Map(signed.data.map((s) => [s.path, s.signedUrl]))

  return data.flatMap((r) => {
    const url = urls.get(r.storage_path)
    return url
      ? [{ id: r.id, ownerId: r.owner_id, guestName: r.guest_name, url, storagePath: r.storage_path, width: r.width, height: r.height, createdAt: r.created_at }]
      : []
  })
}

export const uploadPhoto = async ({ ownerId, guestName, blob, mime, width, height }: NewPhoto): Promise<void> => {
  const path = storagePathFor(ownerId, mime)
  const upload = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: mime, upsert: false })
  if (upload.error) throw upload.error

  const insert = await supabase.from("photos").insert({ guest_name: guestName, storage_path: path, width, height })
  if (insert.error) {
    await supabase.storage.from(BUCKET).remove([path])
    throw insert.error
  }
}

// Row first: the album stops showing it even if the file removal then fails.
export const deletePhoto = async ({ id, storagePath }: Pick<Photo, "id" | "storagePath">): Promise<void> => {
  const { error } = await supabase.from("photos").delete().eq("id", id)
  if (error) throw error
  const removal = await supabase.storage.from(BUCKET).remove([storagePath])
  if (removal.error) throw removal.error
}
