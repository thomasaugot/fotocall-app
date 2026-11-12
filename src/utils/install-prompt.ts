import { STORAGE_KEYS } from "@/constants/storage-keys"
import { logger } from "@/utils/logger"

// Shared contract §6: our own install button only when the browser offers it; on iOS Safari
// (no beforeinstallprompt) a one-line hint instead. Never again once dismissed or installed.
export type InstallOffer = "prompt" | "ios-hint" | "none"

export const isIosSafari = (userAgent: string): boolean =>
  /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent)

export const pickInstallOffer = (opts: {
  standalone: boolean
  dismissed: boolean
  hasPrompt: boolean
  userAgent: string
}): InstallOffer => {
  if (opts.standalone || opts.dismissed) return "none"
  if (opts.hasPrompt) return "prompt"
  return isIosSafari(opts.userAgent) ? "ios-hint" : "none"
}

export const readInstallDismissed = (storage: Pick<Storage, "getItem">): boolean => {
  try {
    return storage.getItem(STORAGE_KEYS.installDismissed) === "1"
  } catch (error) {
    logger.warn("install preference unreadable", error)
    return false
  }
}

export const storeInstallDismissed = (storage: Pick<Storage, "setItem">): void => {
  try {
    storage.setItem(STORAGE_KEYS.installDismissed, "1")
  } catch (error) {
    logger.warn("install preference not saved", error)
  }
}
