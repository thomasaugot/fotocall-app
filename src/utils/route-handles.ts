import { defaultLocale, locales, routeTranslations, type Locale, type RouteKey } from "@/config/i18n.config"

type Match = { handle: unknown }

const handleValue = (handle: unknown, field: string): unknown =>
  typeof handle === "object" && handle !== null && field in handle
    ? (handle as Record<string, unknown>)[field]
    : undefined

const isLocale = (value: unknown): value is Locale => (locales as readonly unknown[]).includes(value)
const isRouteKey = (value: unknown): value is RouteKey => typeof value === "string" && value in routeTranslations

// The locale comes from the matched route, never from parsing location.pathname (09-I18N).
export const findLocale = (matches: readonly Match[]): Locale => {
  const value = matches.map((m) => handleValue(m.handle, "locale")).find((v) => v !== undefined)
  return isLocale(value) ? value : defaultLocale
}

export const findRouteKey = (matches: readonly Match[]): RouteKey | null => {
  const value = [...matches].reverse().map((m) => handleValue(m.handle, "routeKey")).find((v) => v !== undefined)
  return isRouteKey(value) ? value : null
}
