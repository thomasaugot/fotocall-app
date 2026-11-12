import { STORAGE_KEYS } from "@/constants/storage-keys"
import { GUEST_NAME_MAX } from "@/constants/upload-limits"
import { logger } from "@/utils/logger"

export const normalizeGuestName = (raw: string): string =>
  raw.replace(/\s+/g, " ").trim().slice(0, GUEST_NAME_MAX)

// Same bounds as the CHECK constraint on photos.guest_name (the database is the real guard).
export const isValidGuestName = (raw: string): boolean => {
  const trimmed = raw.trim()
  return trimmed.length >= 1 && trimmed.length <= GUEST_NAME_MAX
}

// Remembered on this phone, so a guest types it once for the whole party.
export const readGuestName = (storage: Pick<Storage, "getItem">): string => {
  try {
    const stored = storage.getItem(STORAGE_KEYS.guestName) ?? ""
    return isValidGuestName(stored) ? normalizeGuestName(stored) : ""
  } catch (error) {
    logger.warn("guest name unreadable", error)
    return ""
  }
}

export const storeGuestName = (storage: Pick<Storage, "setItem">, name: string): void => {
  try {
    storage.setItem(STORAGE_KEYS.guestName, normalizeGuestName(name))
  } catch (error) {
    logger.warn("guest name not saved", error)
  }
}
