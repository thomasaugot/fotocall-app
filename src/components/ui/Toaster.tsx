import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ToastItem } from "@/components/ui/ToastItem"
import { TOASTER_RAISE_EVENT } from "@/constants/events"
import { useLoaderGone } from "@/hooks/useAppReady"
import { useToastStore } from "@/stores/toast-store"

// Rendered only once the loader has gone (a toast under it would burn its time unseen).
// popover="manual" puts it in the top layer, so it stays above an open <dialog>.
export const Toaster = () => {
  const loaderGone = useLoaderGone()
  const toasts = useToastStore((s) => s.toasts)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const raise = () => {
      if (list.matches(":popover-open")) list.hidePopover()
      list.showPopover()
    }
    raise()
    window.addEventListener(TOASTER_RAISE_EVENT, raise)
    return () => window.removeEventListener(TOASTER_RAISE_EVENT, raise)
  }, [loaderGone])

  if (!loaderGone) return null

  return createPortal(
    <ol
      ref={listRef}
      popover="manual"
      className="z-toast pointer-events-none fixed inset-x-0 top-4 bottom-auto m-0 mx-auto flex w-fit flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0 [&>li]:pointer-events-auto"
    >
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />)}
    </ol>,
    document.body,
  )
}
