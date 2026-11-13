import { useState } from "react"
import { useTranslations } from "use-intl"
import { GalleryCorners } from "@/components/pages/gallery/GalleryCorners"
import { Pressable } from "@/components/ui/Pressable"
import type { AlbumPhoto } from "@/types/album"

interface GalleryPhotoProps {
  photo: AlbumPhoto
  onOpen: (id: string) => void
  onIntent: () => void
}

// One print held by its four corners. Pressing it loosens the corners and opens the viewer.
export const GalleryPhoto = ({ photo, onOpen, onIntent }: GalleryPhotoProps) => {
  const t = useTranslations("gallery.photo")
  const [loaded, setLoaded] = useState(false)

  return (
    <Pressable
      aria-label={t("open", { name: photo.guestName })}
      onPointerDown={onIntent}
      onClick={() => onOpen(photo.id)}
      className="group relative block w-full bg-surface-2 shadow-sm transition-transform duration-200 ease-out active:scale-[0.985]"
    >
      <img
        src={photo.thumbUrl}
        alt={t("alt", { name: photo.guestName })}
        width={photo.width}
        height={photo.height}
        decoding="async"
        {...(photo.priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        onLoad={() => setLoaded(true)}
        className={`block h-auto w-full transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <GalleryCorners />
    </Pressable>
  )
}
