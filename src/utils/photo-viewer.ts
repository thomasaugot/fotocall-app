import { SWIPE_MIN_PX, SWIPE_SIDEWAYS_RATIO } from "@/constants/gallery"
import type { PhotoPlace, SwipeMove } from "@/types/album"
import type { Photo } from "@/types/photo"

// The photo on show and its neighbours. `photos` is newest first: "next" is the older one.
export const locatePhoto = (photos: Photo[], id: string | null): PhotoPlace | null => {
  if (!id) return null
  const index = photos.findIndex((photo) => photo.id === id)
  if (index === -1) return null
  return { photo: photos[index], prev: photos[index - 1] ?? null, next: photos[index + 1] ?? null }
}

// The offer to delete. The real guard is the database policy (owner only).
export const isOwnPhoto = (photo: Photo, guestId: string | null | undefined): boolean =>
  !!guestId && photo.ownerId === guestId

const slug = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

export const downloadName = (photo: Photo): string => {
  const extension = /\.([a-z0-9]+)$/i.exec(photo.storagePath)?.[1]?.toLowerCase() ?? "jpg"
  const who = slug(photo.guestName) || "foto"
  return `mi-fotocall-${who}-${photo.id.slice(0, 8)}.${extension}`
}

// Storage answers a signed URL carrying `download` as an attachment, so the photo is saved
// instead of opened (an <a download> alone is ignored across origins).
export const downloadHref = (photo: Photo): string => {
  try {
    const url = new URL(photo.url)
    url.searchParams.set("download", downloadName(photo))
    return url.toString()
  } catch {
    return photo.url
  }
}

// A touch drag to the left brings the next photo, to the right the previous one.
export const swipeMove = (dx: number, dy: number): SwipeMove => {
  if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * SWIPE_SIDEWAYS_RATIO) return null
  return dx < 0 ? "next" : "prev"
}
