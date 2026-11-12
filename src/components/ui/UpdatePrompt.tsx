import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useRegisterSW } from "virtual:pwa-register/react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconRefresh } from "@/components/ui/Icons"
import { logger } from "@/utils/logger"

const HOUR = 60 * 60 * 1000

// A new version is OFFERED, never forced (PWA skill §2): the open tab keeps the old files until
// the guest taps Actualizar. Persistent, in the top layer so it stays above an open <dialog>.
export const UpdatePrompt = () => {
  const t = useTranslations("pwa")
  const boxRef = useRef<HTMLDivElement>(null)
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW: (_url, registration) => {
      if (registration) window.setInterval(() => void registration.update(), HOUR)
    },
    onRegisterError: (error) => logger.error("service worker registration failed", error),
  })

  useEffect(() => {
    const box = boxRef.current
    if (needRefresh && box && !box.matches(":popover-open")) box.showPopover()
  }, [needRefresh])

  if (!needRefresh) return null

  return createPortal(
    <div
      ref={boxRef}
      popover="manual"
      role="status"
      className="fixed inset-x-0 top-auto bottom-[max(1rem,env(safe-area-inset-bottom))] m-0 mx-auto flex w-[min(100vw-2rem,26rem)] items-center gap-3 overflow-visible rounded-full bg-surface p-2 shadow-lg"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <IconRefresh className="h-5 w-5 text-text" />
      </span>
      <p className="text-body grow">{t("updateAvailable")}</p>
      <Button size="sm" onClick={() => void updateServiceWorker(true)}>{t("update")}</Button>
    </div>,
    document.body,
  )
}
