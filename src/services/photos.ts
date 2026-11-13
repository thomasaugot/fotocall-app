import { SIGNED_URL_SECONDS } from "@/constants/upload-limits"
import { supabase } from "@/lib/supabase"
import type { NewPhoto, Photo } from "@/types/photo"
import { photoFiles, storagePathFor } from "@/utils/image-file"
import { isAlreadyStored } from "@/utils/upload-queue"
import type { QueuedPhoto } from "@/types/upload-queue"

const BUCKET = "photos"

// Raw calls only: no React, no cache, and every error is thrown (04-CLIENT_SERVER).
export const listPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from("photos")
    .select("id, owner_id, guest_name, storage_path, thumb_path, width, height, created_at, hidden")
    .order("created_at", { ascending: false })
  if (error) throw error
  if (!data || data.length === 0) return []

  // Private bucket: short-lived signed URLs, never a public bucket (11-SECURITY).
  const signed = await supabase.storage.from(BUCKET).createSignedUrls(data.flatMap((r) => (r.thumb_path ? [r.storage_path, r.thumb_path] : [r.storage_path])), SIGNED_URL_SECONDS)
  if (signed.error) throw signed.error
  const urls = new Map(signed.data.map((s) => [s.path, s.signedUrl]))

  return data.flatMap((r) => {
    const url = urls.get(r.storage_path)
    return url
      ? [{
          id: r.id, ownerId: r.owner_id, guestName: r.guest_name, url,
          thumbUrl: (r.thumb_path && urls.get(r.thumb_path)) || url,
          storagePath: r.storage_path, thumbPath: r.thumb_path,
          width: r.width, height: r.height, createdAt: r.created_at, hidden: r.hidden,
        }]
      : []
  })
}

export const uploadPhoto = async ({ ownerId, guestName, blob, mime, width, height, thumb }: NewPhoto): Promise<void> => {
  const path = storagePathFor(ownerId, mime)
  const thumbPath = storagePathFor(ownerId, thumb.mime, "thumb-")
  const [full, small] = await Promise.all([
    supabase.storage.from(BUCKET).upload(path, blob, { contentType: mime, upsert: false }),
    supabase.storage.from(BUCKET).upload(thumbPath, thumb.blob, { contentType: thumb.mime, upsert: false }),
  ])
  if (full.error || small.error) {
    await supabase.storage.from(BUCKET).remove([path, thumbPath])
    throw full.error ?? small.error
  }

  const insert = await supabase.from("photos").insert({ guest_name: guestName, storage_path: path, thumb_path: thumbPath, width, height })
  if (insert.error) {
    await supabase.storage.from(BUCKET).remove([path, thumbPath])
    throw insert.error
  }
}

// Row first: the album stops showing it even if the file removal then fails.
export const deletePhoto = async (photo: Pick<Photo, "id" | "storagePath" | "thumbPath">): Promise<void> => {
  const { error } = await supabase.from("photos").delete().eq("id", photo.id)
  if (error) throw error
  const removal = await supabase.storage.from(BUCKET).remove(photoFiles(photo))
  if (removal.error) throw removal.error
}

// The queue's upload: same row id and same paths on every attempt, so an attempt that got halfway
// before the connection dropped is completed, never duplicated ("already there" counts as done).
export const uploadQueuedPhoto = async (item: QueuedPhoto & { ownerId: string; path: string; thumbPath: string }): Promise<void> => {
  const files = await Promise.all([
    supabase.storage.from(BUCKET).upload(item.path, item.full.blob, { contentType: item.full.mime, upsert: false }),
    supabase.storage.from(BUCKET).upload(item.thumbPath, item.thumb.blob, { contentType: item.thumb.mime, upsert: false }),
  ])
  for (const file of files) if (file.error && !isAlreadyStored(file.error)) throw file.error

  const insert = await supabase.from("photos").insert({
    id: item.id, guest_name: item.guestName, storage_path: item.path, thumb_path: item.thumbPath,
    width: item.full.width, height: item.full.height,
  })
  if (insert.error && !isAlreadyStored(insert.error)) throw insert.error
}
