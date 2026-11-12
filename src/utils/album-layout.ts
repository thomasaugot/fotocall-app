import { LANDSCAPE_ABOVE, LEAF_TEMPLATES, PORTRAIT_BELOW, PRIORITY_PHOTOS } from "@/constants/gallery"
import type { AlbumCounts, AlbumLeaf, AlbumRow, Orientation } from "@/types/album"
import type { Photo } from "@/types/photo"

export const orientationOf = (width: number, height: number): Orientation => {
  if (width <= 0 || height <= 0) return "portrait"
  const ratio = width / height
  if (ratio < PORTRAIT_BELOW) return "portrait"
  if (ratio > LANDSCAPE_ABOVE) return "landscape"
  return "square"
}

// `photos` arrives newest first. Leaves are cut from the OLDEST photo so they stay put while the
// party goes on, then returned newest leaf first, newest print first inside each leaf.
export const composeAlbum = (photos: Photo[]): AlbumLeaf[] => {
  const priority = new Set(photos.slice(0, PRIORITY_PHOTOS).map((photo) => photo.id))
  const chronological = photos.toReversed()
  const leaves: AlbumLeaf[] = []

  for (let index = 0, start = 0; start < chronological.length; index += 1) {
    const template = LEAF_TEMPLATES[index % LEAF_TEMPLATES.length]
    const size = template.reduce((sum, count) => sum + count, 0)
    const chunk = chronological.slice(start, start + size)
    start += size

    const prints = chunk.toReversed().map((photo) => ({
      ...photo,
      orientation: orientationOf(photo.width, photo.height),
      priority: priority.has(photo.id),
    }))

    const rows: AlbumRow[] = []
    let cursor = 0
    template.forEach((count, rowIndex) => {
      const rowPrints = prints.slice(cursor, cursor + count)
      cursor += count
      if (rowPrints.length === 0) return
      rows.push({
        id: `${chunk[0].id}-${rowIndex}`,
        kind: rowPrints.length === 1 ? "solo" : "duo",
        flip: (index + rowIndex) % 2 === 1,
        photos: rowPrints,
      })
    })

    leaves.push({ id: chunk[0].id, rows })
  }

  return leaves.toReversed()
}

export const albumCounts = (photos: Photo[]): AlbumCounts => ({
  photos: photos.length,
  guests: new Set(photos.map((photo) => photo.ownerId)).size,
})
