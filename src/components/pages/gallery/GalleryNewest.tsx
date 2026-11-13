import { useTranslations } from "use-intl"
import { GalleryPhoto } from "@/components/pages/gallery/GalleryPhoto"
import { GalleryTime } from "@/components/pages/gallery/GalleryTime"
import type { AlbumPhoto } from "@/types/album"

interface GalleryNewestProps {
  photo: AlbumPhoto
  now: Date
  onOpen: (id: string) => void
  onIntent: () => void
}

// The photo that just arrived, on its own, large: the album is alive. A big print beside its
// note on a desktop, the note under it on a phone.
export const GalleryNewest = ({ photo, now, onOpen, onIntent }: GalleryNewestProps) => {
  const t = useTranslations("gallery.newest")
  return (
    <section aria-labelledby="gallery-newest" data-anim="mounted-photo" className="invisible grid items-center gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
      <figure className="mx-auto w-full max-w-xs -rotate-2 rounded-sm bg-surface p-3 pb-4 shadow-lg md:mx-0 md:max-w-none md:p-3.5 md:pb-5">
        <GalleryPhoto photo={photo} onOpen={onOpen} onIntent={onIntent} />
      </figure>
      <div className="flex flex-col gap-3">
        <p className="text-label"><span className="text-text-subtle">{t("label")}</span></p>
        <h2 id="gallery-newest" className="text-title"><em>{photo.guestName}</em></h2>
        <p className="text-body inline-flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          <GalleryTime createdAt={photo.createdAt} now={now} />
        </p>
      </div>
    </section>
  )
}
