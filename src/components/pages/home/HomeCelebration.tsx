import { useEffect, useEffectEvent, useRef } from "react"
import { useLocale, useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconCamera, IconCheck } from "@/components/ui/Icons"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { TOASTER_RAISE_EVENT } from "@/constants/events"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import type { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { useScroll } from "@/hooks/useScroll"
import { localizedPath } from "@/i18n/paths"
import { initCelebrate } from "@/utils/animations/celebrate"

interface Props { photocall: ReturnType<typeof usePhotoCapture> }

// The moment a photo joins the album: full screen, the print drops in, confetti, and the two
// things to do next. Escape or "Hacer otra" goes back to the camera.
export const HomeCelebration = ({ photocall }: Props) => {
  const t = useTranslations("home.celebrate")
  const locale = useLocale()
  const { preference } = useMotionPreference()
  const { lockScroll } = useScroll()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { celebration } = photocall
  const lock = useEffectEvent(() => lockScroll())
  const isOpen = !!celebration
  const reduced = preference === "reduced"

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return
    dialog.showModal()
    window.dispatchEvent(new Event(TOASTER_RAISE_EVENT))
    const unlock = lock()
    const stop = initCelebrate(dialog, reduced)
    return () => {
      stop()
      unlock()
      if (dialog.open) dialog.close()
    }
  }, [isOpen, reduced])

  if (!celebration) return null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="celebrate-title"
      onCancel={(event) => { event.preventDefault(); photocall.endCelebration() }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-bg p-0 text-text"
    >
      <div className="flex h-full flex-col items-center justify-center gap-9 px-6 pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="relative">
          <div data-anim="celebrate-burst" aria-hidden="true" className="invisible pointer-events-none absolute inset-0" />
          <figure data-anim="celebrate-print" className="invisible relative rounded-sm bg-surface p-3 pb-12 shadow-lg">
            <img src={celebration.url} alt={t("alt")} className="block h-[min(40svh,22rem)] w-auto max-w-[70vw] rounded-sm object-cover" />
            <span className="absolute -right-4 -bottom-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-md">
              <IconCheck className="h-7 w-7 shrink-0 text-on-primary" />
            </span>
          </figure>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 id="celebrate-title" data-anim="celebrate-words" className="invisible text-hero"><em>{t("title", { count: celebration.count })}</em></h2>
          <p data-anim="celebrate-words" className="invisible text-body max-w-[28ch]">{t("body", { count: celebration.count })}</p>
        </div>
        <div data-anim="celebrate-words" className="invisible flex w-full max-w-sm flex-col gap-3">
          <Button size="lg" className="w-full" icon={<IconCamera className="h-5 w-5" />} onClick={photocall.endCelebration} autoFocus>
            {t("again")}
          </Button>
          <TransitionLink
            href={localizedPath("gallery", locale)}
            onClick={photocall.endCelebration}
            className="text-button inline-flex h-14 items-center justify-center rounded-full border border-border-strong text-text"
          >
            {t("gallery")}
          </TransitionLink>
        </div>
      </div>
    </dialog>
  )
}
