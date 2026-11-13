import { useState } from "react"
import { useTranslations } from "use-intl"
import { Pressable } from "@/components/ui/Pressable"
import type { AlbumPhoto } from "@/types/album"

interface GalleryPhotoProps {
  photo: AlbumPhoto
  onOpen: (id: string) => void
  onIntent: () => void
}

// One photo of the wall. Pressing it opens the viewer.
export const GalleryPhoto = ({ photo, onOpen, onIntent }: GalleryPhotoProps) => {
  const t = useTranslations("gallery.photo")
  const [loaded, setLoaded] = useState(false)

  return (
    <Pressable
      aria-label={t("open", { name: photo.guestName })}
      onPointerDown={onIntent}
      onClick={() => onOpen(photo.id)}
      className="relative block w-full overflow-hidden rounded-[2px] bg-surface-2 active:scale-[0.985]"
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
    </Pressable>
  )
}
