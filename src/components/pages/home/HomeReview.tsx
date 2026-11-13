import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconClose } from "@/components/ui/Icons"
import { Pressable } from "@/components/ui/Pressable"
import { TOASTER_RAISE_EVENT } from "@/constants/events"
import type { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { useScroll } from "@/hooks/useScroll"
import { initReviewPrint } from "@/utils/animations/review-print"
import { shakeNo } from "@/utils/animations/shake-no"

interface Props { photocall: ReturnType<typeof usePhotoCapture> }

// Nothing reaches the album unseen: the shot or the picked photos fill the WHOLE screen first
// (a native <dialog>: top layer, focus trap, Escape = cancel). Several
// photos get a strip of thumbnails to look through, each one removable; then add them or go back.
export const HomeReview = ({ photocall }: Props) => {
  const t = useTranslations("home.review")
  const { review, progress, uploading } = photocall
  const [picked, setPicked] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { lockScroll } = useScroll()
  const lock = useEffectEvent(() => lockScroll())
  const isOpen = !!review
  const { preference } = useMotionPreference()
  const failures = photocall.failures

  // A failed upload: the photo shakes "no" and the message drops in (each new failure replays it).
  useEffect(() => {
    if (failures > 0 && dialogRef.current) shakeNo(dialogRef.current, preference === "reduced")
  }, [failures, preference])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return
    dialog.showModal()
    window.dispatchEvent(new Event(TOASTER_RAISE_EVENT))
    const unlock = lock()
    return () => {
      unlock()
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  const shownUrl = review?.items[Math.min(picked, (review?.items.length ?? 1) - 1)]?.url
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !shownUrl) return
    return initReviewPrint(dialog, preference === "reduced")
  }, [shownUrl, preference])

  if (!review) return null
  const items = review.items
  const current = Math.min(picked, items.length - 1)
  const shown = items[current]

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="review-title"
      onCancel={(event) => { event.preventDefault(); if (!uploading) photocall.discard() }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-bg p-0 text-text"
    >
      <div className="mx-auto flex h-full max-w-xl flex-col gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 id="review-title" className="text-title"><em>{t("title", { count: items.length })}</em></h2>
          <p className="text-body-sm">{items.length > 1 ? t("position", { index: current + 1, total: items.length }) : t("hint")}</p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-2">
          <figure key={shown.url} data-anim="review-print" className="invisible relative flex max-h-full rounded-sm bg-surface p-2.5 pb-9 shadow-lg">
            <img
              data-anim="review-photo"
              src={shown.url}
              alt={t("alt", { index: current + 1, total: items.length })}
              className="block max-h-[calc(100dvh-24rem)] w-auto max-w-[calc(100vw-5rem)] rounded-sm object-contain"
            />
            <Button
              variant="inverse"
              size="md"
              aria-label={t("remove")}
              disabled={uploading}
              icon={<IconClose className="h-5 w-5" />}
              onClick={() => photocall.removeAt(current)}
              className="absolute -top-4 -right-4"
            />
          </figure>
        </div>

        {failures > 0 && (
          <p data-anim="review-error" role="alert" className="invisible mx-auto flex items-center rounded-full bg-danger px-4 py-2 text-center">
            <span className="text-body-sm"><span className="text-on-primary">{t("failed", { count: items.length })}</span></span>
          </p>
        )}

        {items.length > 1 && (
          <ul data-lenis-prevent className="no-scrollbar -mx-5 flex justify-center-safe gap-3 overflow-x-auto px-5 py-2">
            {items.map((item, i) => (
              <li key={item.url} className="shrink-0">
                <Pressable
                  aria-label={t("alt", { index: i + 1, total: items.length })}
                  aria-current={i === current || undefined}
                  onClick={() => setPicked(i)}
                  className={`block rounded-sm bg-surface p-1 pb-3 shadow-md transition-[transform,opacity] duration-200 ${i === current ? "-translate-y-1 opacity-100" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={item.url} alt="" className="block h-14 w-11 rounded-[2px] object-cover" />
                </Pressable>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          <Button variant="outlined" size="lg" className="flex-1 px-4" disabled={uploading} onClick={photocall.discard}>
            {review.source === "camera" ? t("retake") : t("cancel")}
          </Button>
          <Button size="lg" className="flex-[1.7] px-4" loading={uploading} onClick={() => void photocall.keepAll()}>
            {progress ? t("progress", progress) : t("keep", { count: items.length })}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
