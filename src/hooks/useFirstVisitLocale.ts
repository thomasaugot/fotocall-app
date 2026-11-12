import { useEffect, useEffectEvent } from "react"
import { useLocation } from "react-router"
import { defaultLocale, locales } from "@/config/i18n.config"
import { usePageTransition } from "@/hooks/usePageTransition"
import { localizedPath } from "@/i18n/paths"
import { pickBrowserLocale, readLanguagePreference, storeLanguagePreference } from "@/utils/language-preference"

// Only on the bare default home, only with no stored choice, only once. A deep link always
// keeps the language of its URL. With one locale this never redirects.
export const useFirstVisitLocale = () => {
  const { pathname } = useLocation()
  const { navigateTo } = usePageTransition()

  const run = useEffectEvent(() => {
    if (pathname !== "/" || readLanguagePreference(localStorage)) return
    const pick = pickBrowserLocale(navigator.languages, locales)
    if (!pick || pick === defaultLocale) return
    storeLanguagePreference(localStorage, pick)
    void navigateTo(localizedPath("home", pick))
  })

  useEffect(() => { run() }, [])
}
