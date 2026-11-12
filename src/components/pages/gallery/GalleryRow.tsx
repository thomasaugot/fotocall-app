import { GalleryPhoto } from "@/components/pages/gallery/GalleryPhoto"
import { GalleryTime } from "@/components/pages/gallery/GalleryTime"
import type { AlbumRow, Orientation } from "@/types/album"

interface GalleryRowProps {
  row: AlbumRow
  now: Date
  onOpen: (id: string) => void
  onIntent: () => void
}

// Side by side, two prints share the width by their shape, so they end up about as tall.
const SHARE: Record<Orientation, string> = {
  portrait: "flex-[3_1_0%]",
  square: "flex-[4_1_0%]",
  landscape: "flex-[5_1_0%]",
}

// One line of an album leaf: a single print (an upright one is signed beside it, a wide one
// under it) or two prints, one set a little lower than the other.
export const GalleryRow = ({ row, now, onOpen, onIntent }: GalleryRowProps) => {
  if (row.kind === "solo") {
    const [photo] = row.photos
    const beside = photo.orientation === "portrait"
    return (
      <figure
        data-anim="mounted-photo"
        className={`invisible flex gap-4 ${beside ? "items-end" : "flex-col"} ${beside && row.flip ? "flex-row-reverse text-right" : ""}`}
      >
        <div className={beside ? "w-[62%] shrink-0" : "w-full"}>
          <GalleryPhoto photo={photo} onOpen={onOpen} onIntent={onIntent} />
        </div>
        <figcaption className={beside ? "flex min-w-0 flex-1 flex-col gap-1 pb-1" : "flex items-baseline justify-between gap-4"}>
          <span className="text-signature line-clamp-3 min-w-0 wrap-break-word">{photo.guestName}</span>
          <GalleryTime createdAt={photo.createdAt} now={now} />
        </figcaption>
      </figure>
    )
  }

  return (
    <div className="flex items-start gap-4 md:gap-5">
      {row.photos.map((photo, index) => (
        <figure
          key={photo.id}
          data-anim="mounted-photo"
          className={`invisible flex min-w-0 flex-col gap-3 ${SHARE[photo.orientation]} ${index === (row.flip ? 0 : 1) ? "mt-8" : ""}`}
        >
          <GalleryPhoto photo={photo} onOpen={onOpen} onIntent={onIntent} />
          <figcaption className="flex flex-col gap-0.5">
            <span className="text-signature line-clamp-2 wrap-break-word">{photo.guestName}</span>
            <GalleryTime createdAt={photo.createdAt} now={now} />
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
