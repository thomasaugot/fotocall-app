import type { Photo } from "@/types/photo"

export const countGuests = (photos: Pick<Photo, "ownerId">[]): number =>
  new Set(photos.map((p) => p.ownerId)).size

export const countHidden = (photos: Pick<Photo, "hidden">[]): number =>
  photos.filter((p) => p.hidden).length

export type AdminFilter = "all" | "hidden"

// The admin grid shows every photo, or only the ones hidden from the guests.
export const filterPhotos = <P extends Pick<Photo, "hidden">>(photos: P[], filter: AdminFilter): P[] =>
  filter === "hidden" ? photos.filter((p) => p.hidden) : photos

// The selection's one hide/show action: show them if they are all hidden, otherwise hide.
export const selectionHides = (photos: Pick<Photo, "hidden">[]): boolean => !photos.every((p) => p.hidden)

// The other photos from the same phone as this one, in album order (newest first), capped.
export const morePhotosFrom = <P extends { id: string; ownerId: string }>(photos: P[], photo: P, limit: number): P[] =>
  photos.filter((p) => p.ownerId === photo.ownerId && p.id !== photo.id).slice(0, limit)
