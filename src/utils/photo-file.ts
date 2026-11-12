import type { Photo } from "@/types/photo"

const EXTENSION_RE = /\.(webp|jpe?g)$/i

// Guest names are free text: keep letters (accents included), digits, dashes; nothing a file system dislikes.
export const safeName = (name: string): string =>
  name.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").toLowerCase() || "invitado"

export const photoFileName = (photo: Pick<Photo, "guestName" | "storagePath" | "createdAt">, index = 0): string => {
  const ext = photo.storagePath.match(EXTENSION_RE)?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "webp"
  const stamp = photo.createdAt.replace(/[^0-9]/g, "").slice(0, 14)
  return `${safeName(photo.guestName)}-${stamp}-${index + 1}.${ext}`
}

// Two photos can share a name and a second: every zip entry name is made unique.
export const uniqueNames = (photos: Pick<Photo, "guestName" | "storagePath" | "createdAt">[]): string[] =>
  photos.map((p, i) => photoFileName(p, i))
