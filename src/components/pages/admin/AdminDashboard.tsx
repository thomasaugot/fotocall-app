import { AdminHeader } from "@/components/pages/admin/AdminHeader"
import { AdminPhotos } from "@/components/pages/admin/AdminPhotos"
import { AdminQr } from "@/components/pages/admin/AdminQr"
import { useAlbumPhotos } from "@/hooks/useAlbumPhotos"
import { countGuests, countHidden } from "@/utils/admin-stats"

// A desktop tool first: the album takes the width, the QR stands in a column on the right.
// On a phone everything stacks: header, photos, QR.
export const AdminDashboard = () => {
  const photos = useAlbumPhotos()
  if (photos.isError) throw photos.error
  const list = photos.data ?? []

  return (
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-12 px-5 pt-10 pb-24 md:px-10 md:pt-14">
      <AdminHeader photos={list.length} guests={countGuests(list)} hidden={countHidden(list)} />
      <div className="grid items-start gap-14 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
        <AdminPhotos photos={list} isPending={photos.isPending} />
        <AdminQr />
      </div>
    </div>
  )
}
