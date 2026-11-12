import { GUEST_NAME_MAX } from "@/constants/upload-limits"

export const normalizeGuestName = (raw: string): string =>
  raw.replace(/\s+/g, " ").trim().slice(0, GUEST_NAME_MAX)

// Same bounds as the CHECK constraint on photos.guest_name (the database is the real guard).
export const isValidGuestName = (raw: string): boolean => {
  const trimmed = raw.trim()
  return trimmed.length >= 1 && trimmed.length <= GUEST_NAME_MAX
}
