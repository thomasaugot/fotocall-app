import { useTranslations } from "use-intl"
import { PageLoading } from "@/components/layout/PageLoading"
import { PageMeta } from "@/components/layout/PageMeta"
import { usePhotos } from "@/hooks/usePhotos"

export const GalleryPage = () => {
  const t = useTranslations("gallery")
  const photos = usePhotos()
  if (photos.isPending) return <PageLoading />
  if (photos.isError) throw photos.error
  return (
    <>
      <PageMeta namespace="gallery" />
      <h1 className="text-title">{t("title")}</h1>
    </>
  )
}
