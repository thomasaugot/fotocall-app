import { AdminHeader } from "@/components/pages/admin/AdminHeader"
import { AdminPhotos } from "@/components/pages/admin/AdminPhotos"
import { AdminQr } from "@/components/pages/admin/AdminQr"
import { AdminStats } from "@/components/pages/admin/AdminStats"
import { usePhotos } from "@/hooks/usePhotos"
import { countGuests } from "@/utils/admin-stats"

export const AdminDashboard = () => {
  const photos = usePhotos()
  if (photos.isError) throw photos.error
  const list = photos.data ?? []

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pt-12 pb-20">
      <AdminHeader />
      <AdminStats photos={list.length} guests={countGuests(list)} />
      <AdminPhotos photos={list} isPending={photos.isPending} />
      <AdminQr />
    </div>
  )
}
