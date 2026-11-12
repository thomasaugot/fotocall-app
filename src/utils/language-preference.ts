import { locales, type Locale } from "@/config/i18n.config"
import { STORAGE_KEYS } from "@/constants/storage-keys"
import { logger } from "@/utils/logger"

const isLocale = (value: unknown): value is Locale => (locales as readonly unknown[]).includes(value)

export const pickBrowserLocale = <L extends string>(languages: readonly string[], supported: readonly L[]): L | null => {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0]
    const match = supported.find((locale) => locale === base)
    if (match) return match
  }
  return null
}

export const readLanguagePreference = (storage: Pick<Storage, "getItem">): Locale | null => {
  try {
    const value = storage.getItem(STORAGE_KEYS.preferredLanguage)
    return isLocale(value) ? value : null
  } catch (error) {
    logger.warn("language preference unreadable", error)
    return null
  }
}

export const storeLanguagePreference = (storage: Pick<Storage, "setItem">, locale: Locale): void => {
  try {
    storage.setItem(STORAGE_KEYS.preferredLanguage, locale)
  } catch (error) {
    logger.warn("language preference not saved", error)
  }
}
