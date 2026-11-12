import { SCROLL_MEMORY_PREFIX } from "@/constants/scroll"
import { logger } from "@/utils/logger"

export const saveScroll = (storage: Pick<Storage, "setItem">, key: string, y: number): void => {
  try {
    storage.setItem(SCROLL_MEMORY_PREFIX + key, String(Math.round(y)))
  } catch (error) {
    logger.warn("scroll position not saved", error)
  }
}

export const readScroll = (storage: Pick<Storage, "getItem">, key: string): number | null => {
  try {
    const raw = storage.getItem(SCROLL_MEMORY_PREFIX + key)
    if (raw === null) return null
    const y = Number(raw)
    return Number.isFinite(y) ? y : null
  } catch (error) {
    logger.warn("scroll position unreadable", error)
    return null
  }
}
