import { SIGNED_URL_REUSE_MS } from "@/constants/gallery"
import type { Photo } from "@/types/photo"

type Kept = { url: string; since: number }

const kept = new Map<string, Kept>()

// Every refetch signs a NEW url for the same file. Showing it would make the browser download
// each picture again every 30 s. The first url seen is kept while it is safely inside its hour.
export const keepSignedUrls = (photos: Photo[], now: number = Date.now()): Photo[] => {
  const present = new Set(photos.map((photo) => photo.id))
  for (const id of kept.keys()) if (!present.has(id)) kept.delete(id)

  return photos.map((photo) => {
    const known = kept.get(photo.id)
    if (known && now - known.since < SIGNED_URL_REUSE_MS) {
      return known.url === photo.url ? photo : { ...photo, url: known.url }
    }
    kept.set(photo.id, { url: photo.url, since: now })
    return photo
  })
}

export const forgetSignedUrls = (): void => kept.clear()
