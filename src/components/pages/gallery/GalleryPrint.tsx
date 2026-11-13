import { GalleryPhoto } from "@/components/pages/gallery/GalleryPhoto"
import { GalleryTime } from "@/components/pages/gallery/GalleryTime"
import type { AlbumPhoto } from "@/types/album"
import { printTilt } from "@/utils/album-layout"

interface GalleryPrintProps {
  photo: AlbumPhoto
  now: Date
  onOpen: (id: string) => void
  onIntent: () => void
}

// One print of the table: white border, the guest's name written on its wider margin, a small
// tilt of its own that straightens when you point at it.
export const GalleryPrint = ({ photo, now, onOpen, onIntent }: GalleryPrintProps) => (
  <li data-anim="mounted-photo" className="invisible mb-7 break-inside-avoid md:mb-9">
    <figure className={`group flex flex-col gap-2 rounded-sm bg-surface p-2 pb-3 shadow-md transition-[transform,box-shadow] duration-300 ease-out hover:z-dropdown hover:rotate-0 hover:scale-[1.03] hover:shadow-lg md:p-2.5 ${printTilt(photo.id)}`}>
      <GalleryPhoto photo={photo} onOpen={onOpen} onIntent={onIntent} />
      <figcaption className="flex items-baseline justify-between gap-3 px-1">
        <span className="text-body min-w-0 truncate" title={photo.guestName}>{photo.guestName}</span>
        <GalleryTime createdAt={photo.createdAt} now={now} />
      </figcaption>
    </figure>
  </li>
)
