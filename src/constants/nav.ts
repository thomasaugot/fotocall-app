import type { RouteKey } from "@/config/i18n.config"

// Structure only: the label for each labelKey lives in locales/<lang>/common.json → nav.
export const NAV_LINKS: { routeKey: RouteKey; labelKey: "home" | "gallery" }[] = [
  { routeKey: "home", labelKey: "home" },
  { routeKey: "gallery", labelKey: "gallery" },
]

export const NAV_HIDE_AFTER_PX = 100
export const NAV_SOLID_AFTER_PX = 60
