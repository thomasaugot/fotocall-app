import { logger } from "@/utils/logger"

// A key missing everywhere: its path while building, nothing for visitors. Never a raw key on screen.
export const createMessageFallback = (isDev: boolean) =>
  ({ namespace, key }: { namespace?: string; key: string }): string =>
    isDev ? [namespace, key].filter(Boolean).join(".") : ""

export const handleIntlError = (error: Error): void => {
  logger.error("i18n", error)
}
