import { defaultLocale, locales, routeTranslations, type Locale, type RouteKey } from "@/config/i18n.config"
import { normalizePath } from "@/utils/paths"

// Default locale unprefixed ("as-needed"), others prefixed. The ONLY URL builder.
export const localizedPath = (routeKey: RouteKey, locale: Locale): string => {
  const prefix = locale === defaultLocale ? "" : `/${locale}`
  const slug = routeTranslations[routeKey][locale]
  return `${prefix}/${slug}`.replace(/\/+$/, "") || "/"
}

// The reverse of localizedPath: one routeKey serves every language's slug.
export const routeKeyFromPath = (href: string): RouteKey | null => {
  const path = normalizePath(href)
  const keys = Object.keys(routeTranslations) as RouteKey[]
  for (const locale of locales) {
    const key = keys.find((k) => localizedPath(k, locale) === path)
    if (key) return key
  }
  return null
}
