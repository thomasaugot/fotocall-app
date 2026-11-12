import { PageLoading } from "@/components/layout/PageLoading"
import { PageMeta } from "@/components/layout/PageMeta"
import { GalleryAlbum } from "@/components/pages/gallery/GalleryAlbum"
import { GalleryEmpty } from "@/components/pages/gallery/GalleryEmpty"
import { GalleryHeader } from "@/components/pages/gallery/GalleryHeader"
import { useAlbumPhotos } from "@/hooks/useAlbumPhotos"
import { useGuestSession } from "@/hooks/useGuestSession"

export const GalleryPage = () => {
  // Both start together (14-PERFORMANCE §3). The session only decides who may delete what.
  const photos = useAlbumPhotos()
  const session = useGuestSession()

  if (photos.isPending) return <PageLoading />
  if (photos.isError) throw photos.error

  return (
    <>
      <PageMeta namespace="gallery" />
      <section aria-labelledby="gallery-title" className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pt-10 pb-8 md:gap-12 md:pt-14">
        <GalleryHeader photos={photos.data} />
        {photos.data.length === 0
          ? <GalleryEmpty />
          : <GalleryAlbum photos={photos.data} guestId={session.data ?? null} />}
      </section>
    </>
  )
}