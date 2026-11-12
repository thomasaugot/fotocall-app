import type { ComponentType } from "react"
import { createBrowserRouter } from "react-router"
import { routeModules } from "@/app/route-modules"
import { RootLayout } from "@/components/layout/RootLayout"
import { RouteError } from "@/components/layout/RouteError"
import { HomePage } from "@/components/pages/home/HomePage"
import { defaultLocale, locales, routeTranslations } from "@/config/i18n.config"
import { loadMessages } from "@/i18n/messages"

const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  () => load().then((m) => ({ Component: m[name] }))

// One branch per locale, generated from routeTranslations. RootLayout is pathless and ABOVE
// the branches, so a language switch never remounts Providers, the loader or the navbar.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // Direct load: the ivory ground holds until the messages and the chunk land, then PageLoader.
    hydrateFallbackElement: <div className="min-h-svh bg-bg" />,
    children: locales.map((locale) => ({
      id: `locale-${locale}`,
      path: locale === defaultLocale ? "/" : `/${locale}`,
      loader: () => loadMessages(locale),
      handle: { locale },
      children: [
        {
          errorElement: <RouteError />,
          children: [
            { index: true, element: <HomePage />, handle: { routeKey: "home" } },
            {
              path: routeTranslations.gallery[locale],
              handle: { routeKey: "gallery" },
              lazy: page(routeModules.gallery, "GalleryPage"),
            },
            { path: "*", lazy: page(routeModules.notFound, "NotFoundPage") },
          ],
        },
      ],
    })),
  },
])
