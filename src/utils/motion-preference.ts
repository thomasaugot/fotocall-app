import { STORAGE_KEYS } from "@/constants/storage-keys"
import type { MotionPreference } from "@/types/motion"
import { logger } from "@/utils/logger"

const isMotionPreference = (value: unknown): value is MotionPreference =>
  value === "full" || value === "reduced"

export const readMotionPreference = (storage: Pick<Storage, "getItem">): MotionPreference | null => {
  try {
    const value = storage.getItem(STORAGE_KEYS.motionPreference)
    return isMotionPreference(value) ? value : null
  } catch (error) {
    logger.warn("motion preference unreadable", error)
    return null
  }
}

export const storeMotionPreference = (storage: Pick<Storage, "setItem">, value: MotionPreference): void => {
  try {
    storage.setItem(STORAGE_KEYS.motionPreference, value)
  } catch (error) {
    logger.warn("motion preference not saved", error)
  }
}
