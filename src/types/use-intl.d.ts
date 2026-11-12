import type { Locale } from "@/config/i18n.config"
import type { Messages } from "@/types/messages"

declare module "use-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: Messages
  }
}
