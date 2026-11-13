import { lazy, Suspense, useState } from "react"
import { useNow, useTranslations } from "use-intl"
import { GalleryNewest } from "@/components/pages/gallery/GalleryNewest"
import { GalleryPrint } from "@/components/pages/gallery/GalleryPrint"
import { Button } from "@/components/ui/Button"
import { PHOTOS_PER_STEP } from "@/constants/gallery"
import { useLoaderGone } from "@/hooks/useAppReady"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { usePhotoViewer } from "@/hooks/usePhotoViewer"
import type { Photo } from "@/types/photo"
import { albumWall } from "@/utils/album-layout"
import { initMountReveal } from "@/utils/animations/mount-reveal"

interface GalleryAlbumProps {
  photos: Photo[]
  guestId: string | null
}

// The viewer is a modal: its code comes on the intent to open a photo (14-PERFORMANCE).
const loadViewer = () =>
  import("@/components/pages/gallery/GalleryViewer").then((m) => ({ default: m.GalleryViewer }))
const GalleryViewer = lazy(loadViewer)
const preloadViewer = () => void loadViewer()

// The newest photo large on its own, then the others as prints laid on the table, newest first,
// in columns that keep each photo's shape (2 on a phone, 3 on a tablet, 4 on a desktop).
export const GalleryAlbum = ({ photos, guestId }: GalleryAlbumProps) => {
  const t = useTranslations("gallery.album")
  const now = useNow({ updateInterval: 60_000 })
  const { preference } = useMotionPreference()
  const loaderGone = useLoaderGone()
  const [shown, setShown] = useState(PHOTOS_PER_STEP)
  const viewer = usePhotoViewer(photos)
  const [newest, ...wall] = albumWall(photos)
  // An entrance: it waits for the opening loader to lift (05-ANIMATIONS, loaderGone).
  const rootRef = useGSAPAnimations<HTMLDivElement>(
    () => (loaderGone ? { critical: [(root) => initMountReveal(root, preference === "reduced")] } : {}),
    [loaderGone, preference],
  )

  return (
    <div ref={rootRef} className="flex flex-col gap-16 md:gap-20">
      {newest && <GalleryNewest photo={newest} now={now} onOpen={viewer.open} onIntent={preloadViewer} />}
      <ul aria-label={t("label")} className="columns-2 gap-5 md:columns-3 md:gap-8 xl:columns-4">
        {wall.slice(0, shown).map((photo) => (
          <GalleryPrint key={photo.id} photo={photo} now={now} onOpen={viewer.open} onIntent={preloadViewer} />
        ))}
      </ul>
      {wall.length > shown && (
        <Button variant="outlined" size="lg" className="self-center" onClick={() => setShown(shown + PHOTOS_PER_STEP)}>
          {t("more")}
        </Button>
      )}
      {viewer.everOpened && (
        <Suspense fallback={null}>
          <GalleryViewer
            place={viewer.place}
            direction={viewer.direction}
            guestId={guestId}
            onClose={viewer.close}
            onPrev={viewer.goPrev}
            onNext={viewer.goNext}
          />
        </Suspense>
      )}
    </div>
  )
}
