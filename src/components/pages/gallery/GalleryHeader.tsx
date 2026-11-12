import { useTranslations } from "use-intl"
import type { Photo } from "@/types/photo"
import { albumCounts } from "@/utils/album-layout"

// The album's title and how full it is. The count line only exists once there is a photo.
export const GalleryHeader = ({ photos }: { photos: Photo[] }) => {
  const t = useTranslations("gallery")
  const counts = albumCounts(photos)

  return (
    <header aria-labelledby="gallery-title" className="flex flex-col gap-3">
      <h1 id="gallery-title" className="text-title">{t("title")}</h1>
      {counts.photos > 0 && (
        <p className="text-body">
          <span className="text-text-muted">{t("count", counts)}</span>
        </p>
      )}
    </header>
  )
}
