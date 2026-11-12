import { useState } from "react"
import { PageMeta } from "@/components/layout/PageMeta"
import { HomeAlbumPeek } from "@/components/pages/home/HomeAlbumPeek"
import { HomeIntro } from "@/components/pages/home/HomeIntro"
import { HomeMyPhotos } from "@/components/pages/home/HomeMyPhotos"
import { HomeStage } from "@/components/pages/home/HomeStage"
import { useGuestName } from "@/hooks/useGuestName"
import { usePhotoCapture } from "@/hooks/usePhotoCapture"

export const HomePage = () => {
  const guest = useGuestName()
  const [editingName, setEditingName] = useState(false)
  const photocall = usePhotoCapture(guest.name)
  const needsName = !guest.name || editingName

  // Phone first: the line, the print, then the album. From 1280 the print stands on the right
  // and the line and the album share the left.
  return (
    <>
      <PageMeta namespace="home" />
      <section
        aria-labelledby="home-title"
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 overflow-x-clip px-5 pt-8 pb-16 md:gap-6 md:px-8 xl:grid xl:min-h-[calc(100svh-4rem)] xl:grid-cols-[minmax(0,1fr)_auto] xl:content-center xl:items-start xl:gap-x-24 xl:gap-y-10 xl:py-8"
      >
        <HomeIntro />
        <HomeStage
          photocall={photocall}
          name={guest.name}
          needsName={needsName}
          onSave={(name) => {
            guest.save(name)
            setEditingName(false)
          }}
          onEdit={() => setEditingName(true)}
        />
        <HomeMyPhotos />
        <HomeAlbumPeek />
      </section>
    </>
  )
}
