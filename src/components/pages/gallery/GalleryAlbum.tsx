import { lazy, Suspense, useState } from "react"
import { useNow, useTranslations } from "use-intl"
import { GalleryLeaf } from "@/components/pages/gallery/GalleryLeaf"
import { Button } from "@/components/ui/Button"
import { LEAVES_PER_STEP } from "@/constants/gallery"
import { useLoaderGone } from "@/hooks/useAppReady"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { usePhotoViewer } from "@/hooks/usePhotoViewer"
import type { Photo } from "@/types/photo"
import { composeAlbum } from "@/utils/album-layout"
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

// The album: leaves of prints, newest first, a few leaves at a time (14, "Long lists").
export const GalleryAlbum = ({ photos, guestId }: GalleryAlbumProps) => {
  const t = useTranslations("gallery.album")
  const now = useNow({ updateInterval: 60_000 })
  const { preference } = useMotionPreference()
  const loaderGone = useLoaderGone()
  const [shown, setShown] = useState(LEAVES_PER_STEP)
  const viewer = usePhotoViewer(photos)
  const leaves = composeAlbum(photos)
  // An entrance: it waits for the opening loader to lift (05-ANIMATIONS, loaderGone).
  const rootRef = useGSAPAnimations<HTMLDivElement>(
    () => (loaderGone ? { critical: [(root) => initMountReveal(root, preference === "reduced")] } : {}),
    [loaderGone, preference],
  )

  return (
    <div ref={rootRef} className="flex flex-col gap-10">
      <ul aria-label={t("label")} className="grid gap-x-1.5 gap-y-6 md:grid-cols-2 md:gap-y-10">
        {leaves.slice(0, shown).map((leaf) => (
          <GalleryLeaf key={leaf.id} leaf={leaf} now={now} onOpen={viewer.open} onIntent={preloadViewer} />
        ))}
      </ul>
      {leaves.length > shown && (
        <Button variant="outlined" size="lg" className="self-center" onClick={() => setShown(shown + LEAVES_PER_STEP)}>
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
