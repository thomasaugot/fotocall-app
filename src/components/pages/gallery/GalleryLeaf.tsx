import { GalleryRow } from "@/components/pages/gallery/GalleryRow"
import type { AlbumLeaf } from "@/types/album"

interface GalleryLeafProps {
  leaf: AlbumLeaf
  now: Date
  onOpen: (id: string) => void
  onIntent: () => void
}

// One leaf of the album: a sheet of paper with its prints. From tablets up two leaves sit side
// by side like the open album, joined at the fold (the corners facing it stay square).
export const GalleryLeaf = ({ leaf, now, onOpen, onIntent }: GalleryLeafProps) => {
  return (
    <li className="flex flex-col gap-10 rounded-md bg-surface p-5 pb-8 shadow-md md:p-6 md:pb-8 md:odd:rounded-r-none md:even:rounded-l-none xl:p-8 xl:pb-10">
      {leaf.rows.map((row) => (
        <GalleryRow key={row.id} row={row} now={now} onOpen={onOpen} onIntent={onIntent} />
      ))}
    </li>
  )
}
