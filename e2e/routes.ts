import type { Page } from "@playwright/test"

// The ONE list of routes every E2E suite walks. A new route is added here.
export const ROUTES = [
  { name: "home", path: "/", h1: "Un recuerdo para siempre" },
  { name: "gallery", path: "/galeria", h1: "Galería" },
  { name: "admin", path: "/admin", h1: "Administración" },
  { name: "not-found", path: "/esta-pagina-no-existe", h1: "Esta página no existe" },
] as const

// PageLoader sets this in its exit callback. Waiting for the loader to DETACH races.
export const waitForPageReady = (page: Page) =>
  page.waitForFunction(() => window.__loadingComplete === true, null, { timeout: 15_000 })
