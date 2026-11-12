import type { Photo } from "@/types/photo"

export const countGuests = (photos: Pick<Photo, "ownerId">[]): number =>
  new Set(photos.map((p) => p.ownerId)).size
