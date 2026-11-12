import { useQueryClient } from "@tanstack/react-query"
import { useLocale } from "use-intl"
import { signOutAdmin } from "@/services/admin-auth"
import type { Locale } from "@/config/i18n.config"
import { localizedPath } from "@/i18n/paths"
import { logger } from "@/utils/logger"

// 14-PERFORMANCE "Sign-out is a full document load": the cache holds the whole album in memory.
export const useAdminSignOut = () => {
  const queryClient = useQueryClient()
  const locale = useLocale() as Locale
  return async () => {
    queryClient.clear()
    try {
      await signOutAdmin()
    } catch (error) {
      logger.error("admin sign-out failed", error)
    }
    window.location.assign(localizedPath("admin", locale))
  }
}
