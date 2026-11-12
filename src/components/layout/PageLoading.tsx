import { useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "use-intl"
import { BrandMark } from "@/components/ui/BrandMark"
import { PAGE_LOADED_EVENT } from "@/constants/events"

// A page waiting for its data (14-PERFORMANCE): nothing for the first second, then the brand
// mark over a sweeping bar. Portalled to <body>: inside <main> the fixed mark would follow main's
// entrance transform. Its layout-effect cleanup runs in the commit that swaps in the real page,
// before paint: PageShell hides <main> and replays the entrance.
export const PageLoading = () => {
  const t = useTranslations("loader")

  useLayoutEffect(() => () => {
    window.dispatchEvent(new Event(PAGE_LOADED_EVENT))
  }, [])

  return (
    <div aria-busy="true" className="min-h-svh">
      <span className="sr-only">{t("label")}</span>
      {createPortal(
        <div aria-hidden="true" className="z-overlay pointer-events-none fixed inset-0 flex items-center justify-center">
          <div className="page-loading-mark flex flex-col items-center gap-4">
            <BrandMark className="h-12 w-12" />
            <div className="relative h-px w-24 overflow-hidden bg-border">
              <div className="page-loading-bar absolute inset-0 bg-primary" />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
