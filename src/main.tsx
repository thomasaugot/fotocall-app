import "@fontsource-variable/figtree"
import "@fontsource-variable/cormorant"
import "@/globals.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "@/app/router"
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary"
import { reportError, startErrorReporting } from "@/lib/sentry"
import { CHUNK_RELOAD_KEY, shouldReloadForChunk } from "@/utils/chunk-reload"
import { logger } from "@/utils/logger"

startErrorReporting()

// A tab left open across a deploy asks for chunks that are gone: reload once for the new ones.
window.addEventListener("vite:preloadError", (event) => {
  try {
    if (!shouldReloadForChunk(Date.now(), sessionStorage.getItem(CHUNK_RELOAD_KEY))) return
    event.preventDefault()
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
    window.location.reload()
  } catch (error) {
    logger.warn("chunk reload skipped", error)
  }
})

// PageMeta renders the live <title>; drop the static one so document.title follows the page.
document.querySelectorAll('title[data-prerendered], meta[name="description"][data-prerendered]')
  .forEach((node) => node.remove())

const root = document.getElementById("root")
if (!root) throw new Error("#root not found in index.html")
createRoot(root, {
  onUncaughtError: (error, info) => reportError(error, { componentStack: info.componentStack }),
}).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </StrictMode>,
)
