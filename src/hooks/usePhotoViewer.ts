import { useEffect, useState } from "react"
import type { ViewerDirection } from "@/types/album"
import type { Photo } from "@/types/photo"
import { locatePhoto } from "@/utils/photo-viewer"

// Which photo is open, and the way to its neighbours. A photo that leaves the album (deleted
// here or by its owner elsewhere) closes the viewer by itself: `place` becomes null.
export const usePhotoViewer = (photos: Photo[]) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [everOpened, setEverOpened] = useState(false)
  const [direction, setDirection] = useState<ViewerDirection>(0)
  const place = locatePhoto(photos, openId)
  const prevUrl = place?.prev?.url
  const nextUrl = place?.next?.url

  // The neighbours are fetched while this one is looked at: prev/next shows them at once.
  useEffect(() => {
    for (const url of [prevUrl, nextUrl]) {
      if (!url) continue
      const image = new Image()
      image.decoding = "async"
      image.src = url
    }
  }, [prevUrl, nextUrl])

  const open = (id: string) => {
    setDirection(0)
    setOpenId(id)
    setEverOpened(true)
  }
  const close = () => setOpenId(null)
  const goPrev = () => {
    if (!place?.prev) return
    setDirection(-1)
    setOpenId(place.prev.id)
  }
  const goNext = () => {
    if (!place?.next) return
    setDirection(1)
    setOpenId(place.next.id)
  }

  return { place, everOpened, direction, open, close, goPrev, goNext }
}
