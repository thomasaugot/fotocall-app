import { locales } from "@/config/i18n.config"

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(?=/|$)`)

export const normalizePath = (href: string): string => {
  const path = href.split(/[?#]/)[0] || "/"
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : path
}

export const stripLocale = (path: string): string => path.replace(LOCALE_PREFIX, "") || "/"

export const isExternalHref = (href: string): boolean => /^(https?:|mailto:|tel:|\/\/)/i.test(href)

// pathname carries the locale prefix, hrefs may not: never compare them raw (06-TRANSITIONS).
export const isSamePage = (href: string, pathname: string): boolean =>
  stripLocale(normalizePath(href)) === stripLocale(normalizePath(pathname))
