export const locales = ["es"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "es"

// routeKey → slug per locale. "" = the locale's home. A new language = one more column here.
export const routeTranslations = {
  home: { es: "" },
  gallery: { es: "galeria" },
  admin: { es: "admin" },
} as const satisfies Record<string, Record<Locale, string>>
export type RouteKey = keyof typeof routeTranslations
