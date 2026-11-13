import { useEffect, useEffectEvent, useRef } from "react"
import { useFormatter, useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconClose, IconDownload, IconEye, IconEyeOff, IconNext, IconPrev, IconTrash } from "@/components/ui/Icons"
import { Pressable } from "@/components/ui/Pressable"
import { TOASTER_RAISE_EVENT } from "@/constants/events"
import { useArrowKeys } from "@/hooks/useArrowKeys"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { useScroll } from "@/hooks/useScroll"
import { useSwipe } from "@/hooks/useSwipe"
import type { PhotoPlace, ViewerDirection } from "@/types/album"
import type { Photo } from "@/types/photo"
import { morePhotosFrom } from "@/utils/admin-stats"
import { initPhotoArrive } from "@/utils/animations/photo-arrive"

interface Props {
  place: PhotoPlace | null
  direction: ViewerDirection
  photos: Photo[]
  index: number
  total: number
  busy: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSetHidden: (photo: Photo, hidden: boolean) => void
  onDownload: (photo: Photo) => void
  onDelete: (photo: Photo) => void
  onJump: (id: string) => void
}

// The admin's viewer: the whole screen, the photo as large as it fits on a soft paper ground,
// and a side panel (under it on a phone) with who, when, and the three actions.
// Native <dialog>: focus trap, Escape and top layer for free. Arrows, keys and swipe move.
export const AdminViewer = ({ place, direction, photos, index, total, busy, onClose, onPrev, onNext, onSetHidden, onDownload, onDelete, onJump }: Props) => {
  const t = useTranslations("admin.viewer")
  const tHide = useTranslations("admin.hide")
  const format = useFormatter()
  const { preference } = useMotionPreference()
  const { lockScroll } = useScroll()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const photo = place?.photo ?? null
  const more = photo ? morePhotosFrom(photos, photo, 9) : []
  const moreTotal = photo ? morePhotosFrom(photos, photo, Infinity).length : 0
  const swipe = useSwipe(onPrev, onNext)
  useArrowKeys(!!photo, onPrev, onNext)
  const stageRef = useGSAPAnimations<HTMLDivElement>(
    () => ({ critical: [(root) => initPhotoArrive(root, preference === "reduced", direction)] }),
    [photo?.id ?? "", preference],
  )

  const lock = useEffectEvent(() => lockScroll())
  const isOpen = !!photo
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

  return (
    <dialog
      ref={dialogRef}
      aria-label={photo ? t("title", { name: photo.guestName }) : undefined}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-text backdrop:bg-text/40"
    >
      {place && photo && (
        <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1">
          <div {...swipe} className="relative flex min-h-0 touch-pan-y items-center justify-center px-4 pt-16 pb-6 md:px-20 lg:py-10">
            <p className="text-body-sm absolute top-5 left-5 tabular-nums">{t("position", { index, total })}</p>
            <div ref={stageRef} className="flex h-full w-full items-center justify-center">
              <div key={photo.id} data-anim="photo-arrive" className="invisible flex h-full w-full items-center justify-center">
                <img
                  src={photo.url}
                  alt={t("title", { name: photo.guestName })}
                  width={photo.width}
                  height={photo.height}
                  decoding="async"
                  draggable={false}
                  className={`max-h-full max-w-full rounded-lg object-contain shadow-lg select-none ${photo.hidden ? "opacity-40 grayscale" : ""}`}
                />
              </div>
            </div>
            <Button variant="inverse" size="lg" aria-label={t("prev")} disabled={!place.prev} icon={<IconPrev className="h-6 w-6" />} onClick={onPrev} className="absolute top-1/2 left-4 -translate-y-1/2 max-md:hidden" />
            <Button variant="inverse" size="lg" aria-label={t("next")} disabled={!place.next} icon={<IconNext className="h-6 w-6" />} onClick={onNext} className="absolute top-1/2 right-4 -translate-y-1/2 max-md:hidden" />
          </div>

          <aside aria-label={t("title", { name: photo.guestName })} className="flex min-h-0 flex-col gap-8 bg-surface px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg lg:pt-20">
            <div className="flex flex-col gap-2">
              <p className="text-signature">{photo.guestName}</p>
              <p className="text-body-sm">
                {t("takenAt", { time: format.dateTime(new Date(photo.createdAt), { hour: "2-digit", minute: "2-digit" }) })}
              </p>
              <p className={`text-body-sm inline-flex items-center gap-2 pt-2`}>
                {photo.hidden ? <IconEyeOff className="h-4 w-4 shrink-0 text-text-muted" /> : <IconEye className="h-4 w-4 shrink-0 text-text-muted" />}
                {photo.hidden ? t("hiddenNote") : t("visible")}
              </p>
            </div>

            <div className="flex min-h-0 flex-col gap-3 lg:-mx-2 lg:flex-1 lg:overflow-y-auto lg:px-2 lg:pb-2 no-scrollbar" data-lenis-prevent>
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-body">{t("more", { name: photo.guestName })}</span>
                {moreTotal > 0 && <span className="text-body-sm shrink-0">{t("moreCount", { count: moreTotal })}</span>}
              </p>
              {more.length === 0 ? (
                <p className="text-body-sm">{t("onlyOne", { name: photo.guestName })}</p>
              ) : (
                <ul className="grid grid-cols-3 gap-2 max-lg:grid-cols-6">
                  {more.map((other) => (
                    <li key={other.id}>
                      <Pressable
                        aria-label={t("openOther", { name: photo.guestName })}
                        onClick={() => onJump(other.id)}
                        className="block aspect-[3/4] w-full overflow-hidden rounded-md bg-surface-2"
                      >
                        <img
                          src={other.thumbUrl}
                          alt=""
                          width={other.width}
                          height={other.height}
                          loading="lazy"
                          decoding="async"
                          className={`h-full w-full object-cover transition-transform duration-200 hover:scale-105 ${other.hidden ? "opacity-40 grayscale" : ""}`}
                        />
                      </Pressable>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3 md:hidden">
                <Button variant="outlined" size="lg" aria-label={t("prev")} disabled={!place.prev} icon={<IconPrev className="h-5 w-5" />} onClick={onPrev} className="flex-1" />
                <Button variant="outlined" size="lg" aria-label={t("next")} disabled={!place.next} icon={<IconNext className="h-5 w-5" />} onClick={onNext} className="flex-1" />
              </div>
              <Button size="lg" loading={busy} icon={photo.hidden ? <IconEye className="h-5 w-5" /> : <IconEyeOff className="h-5 w-5" />} onClick={() => onSetHidden(photo, !photo.hidden)}>
                {photo.hidden ? tHide("show") : tHide("hide")}
              </Button>
              <div className="flex gap-3">
                <Button variant="outlined" className="flex-1" icon={<IconDownload className="h-5 w-5" />} onClick={() => onDownload(photo)}>{t("download")}</Button>
                <Button variant="outlined" className="flex-1" icon={<IconTrash className="h-5 w-5" />} onClick={() => onDelete(photo)}>{t("delete")}</Button>
              </div>
            </div>
          </aside>

          <Button variant="inverse" size="md" aria-label={t("close")} icon={<IconClose className="h-5 w-5" />} onClick={onClose} className="absolute top-4 right-4" />
        </div>
      )}
    </dialog>
  )
}
