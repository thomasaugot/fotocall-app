import { routeData, routeModules } from "@/app/route-modules"
import { routeKeyFromPath } from "@/i18n/paths"
import { queryClient } from "@/lib/query-client"

const modules: Record<string, (() => Promise<unknown>) | undefined> = routeModules
const data: Record<string, ((client: typeof queryClient) => Promise<unknown>) | undefined> = routeData

// Starts the page's code AND data, but resolves on the code only: navigateTo awaits it, and a
// slow query must never hold a faded-out page (the page shows PageLoading instead). Never throws.
export const preloadRoute = (href: string): Promise<unknown> => {
  const key = routeKeyFromPath(href)
  if (!key) return Promise.resolve()
  data[key]?.(queryClient).catch(() => undefined)
  const load = modules[key]
  return load ? load().then(() => undefined, () => undefined) : Promise.resolve()
}
