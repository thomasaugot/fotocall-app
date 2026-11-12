import type { Photo } from "@/types/photo"

// The photos this guest added, newest first as the album gives them. No session yet = none.
export const ownPhotos = (photos: Photo[] | undefined, guestId: string | null | undefined): Photo[] =>
  guestId ? (photos ?? []).filter((photo) => photo.ownerId === guestId) : []
