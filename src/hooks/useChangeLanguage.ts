import { useLocale } from "use-intl"
import type { Locale } from "@/config/i18n.config"
import { useCurrentRouteKey } from "@/hooks/useCurrentRouteKey"
import { usePageTransition } from "@/hooks/usePageTransition"
import { localizedPath } from "@/i18n/paths"
import { storeLanguagePreference } from "@/utils/language-preference"

// Navigate (never replaceState: the matched route, so the messages, would not change),
// to the SAME page in the other language.
export const useChangeLanguage = () => {
  const current = useLocale()
  const routeKey = useCurrentRouteKey()
  const { navigateTo } = usePageTransition()

  return (lang: Locale) => {
    if (lang === current) return
    storeLanguagePreference(localStorage, lang)
    void navigateTo(localizedPath(routeKey ?? "home", lang))
  }
}
