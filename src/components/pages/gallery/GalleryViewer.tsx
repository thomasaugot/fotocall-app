import { useState } from "react"
import { useNow, useTranslations } from "use-intl"
import { GalleryCorners } from "@/components/pages/gallery/GalleryCorners"
import { GalleryTime } from "@/components/pages/gallery/GalleryTime"
import { GalleryViewerActions } from "@/components/pages/gallery/GalleryViewerActions"
import { Button } from "@/components/ui/Button"
import { IconNext, IconPrev } from "@/components/ui/Icons"
import { Modal } from "@/components/ui/Modal"
import { useArrowKeys } from "@/hooks/useArrowKeys"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useBreakpoint } from "@/hooks/useMediaQuery"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { useSwipe } from "@/hooks/useSwipe"
import type { PhotoPlace, ViewerDirection } from "@/types/album"
import { initPhotoArrive } from "@/utils/animations/photo-arrive"
import { isOwnPhoto } from "@/utils/photo-viewer"

interface GalleryViewerProps {
  place: PhotoPlace | null
  direction: ViewerDirection
  guestId: string | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

// A photo taken out of the album to look at: the whole screen on a phone, a sheet from tablets
// up. Swipe, the two round keys under it or the arrow keys go to its neighbours.
export const GalleryViewer = ({ place, direction, guestId, onClose, onPrev, onNext }: GalleryViewerProps) => {
  const t = useTranslations("gallery.viewer")
  const tPhoto = useTranslations("gallery.photo")
  const now = useNow({ updateInterval: 60_000 })
  const breakpoint = useBreakpoint()
  const { preference } = useMotionPreference()
  const swipe = useSwipe(onPrev, onNext)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const photo = place?.photo ?? null
  const confirming = !!photo && confirmingId === photo.id
  useArrowKeys(!!photo, onPrev, onNext)
  const rootRef = useGSAPAnimations<HTMLDivElement>(
    () => ({ critical: [(root) => initPhotoArrive(root, preference === "reduced", direction)] }),
    [photo?.id ?? "", preference],
  )

  return (
    <Modal
      isOpen={!!photo}
      onClose={onClose}
      title={photo ? t("title", { name: photo.guestName }) : ""}
      size={breakpoint === "mobile" ? "full" : "lg"}
    >
      <div ref={rootRef} className="flex flex-col items-center gap-5 pt-2 pb-[env(safe-area-inset-bottom)] max-md:min-h-[calc(100dvh-7.5rem)]">
        {place && photo && (
          <>
            <div {...swipe} className="flex w-full flex-1 touch-pan-y items-center justify-center">
              <div key={photo.id} data-anim="photo-arrive" className="invisible w-fit max-w-full">
                <div className={`relative transition-[transform,opacity] duration-300 ease-out ${confirming ? "scale-[0.95] opacity-70" : ""}`}>
                  <img
                    src={photo.url}
                    alt={tPhoto("alt", { name: photo.guestName })}
                    width={photo.width}
                    height={photo.height}
                    decoding="async"
                    draggable={false}
                    className="block h-auto max-h-[calc(100dvh-18.5rem)] w-auto max-w-full bg-surface-2 shadow-md select-none"
                  />
                  <GalleryCorners size="lg" released={confirming} />
                </div>
              </div>
            </div>
            <div className="flex w-full max-w-md items-center justify-between gap-3">
              <Button variant="outlined" size="lg" aria-label={t("prev")} disabled={!place.prev} icon={<IconPrev className="h-5 w-5" />} onClick={onPrev} />
              <GalleryTime createdAt={photo.createdAt} now={now} />
              <Button variant="outlined" size="lg" aria-label={t("next")} disabled={!place.next} icon={<IconNext className="h-5 w-5" />} onClick={onNext} />
            </div>
            <GalleryViewerActions
              photo={photo}
              canDelete={isOwnPhoto(photo, guestId)}
              confirming={confirming}
              onConfirming={(next) => setConfirmingId(next ? photo.id : null)}
              onDeleted={onClose}
            />
          </>
        )}
      </div>
    </Modal>
  )
}
