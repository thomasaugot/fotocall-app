import { useState } from "react"
import { useTranslations } from "use-intl"
import { AdminDeleteModal } from "@/components/pages/admin/AdminDeleteModal"
import { AdminPhotoCard } from "@/components/pages/admin/AdminPhotoCard"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { IconDownload, IconTrash } from "@/components/ui/Icons"
import { useAdminDeletePhotos } from "@/hooks/useAdminDeletePhotos"
import { useDownloadAllPhotos } from "@/hooks/useDownloadAllPhotos"
import { useDownloadPhoto } from "@/hooks/useDownloadPhoto"
import { usePhotoSelection } from "@/hooks/usePhotoSelection"
import type { Photo } from "@/types/photo"

interface Props { photos: Photo[]; isPending: boolean }

export const AdminPhotos = ({ photos, isPending }: Props) => {
  const t = useTranslations("admin.photos")
  const [confirming, setConfirming] = useState(false)
  const selection = usePhotoSelection(photos.map((p) => p.id))
  const remove = useAdminDeletePhotos()
  const downloadOne = useDownloadPhoto()
  const downloadAll = useDownloadAllPhotos()

  const confirmDelete = () =>
    remove.mutate(photos.filter((p) => selection.selected.has(p.id)), {
      onSuccess: () => { selection.clear(); setConfirming(false) },
      onSettled: () => setConfirming(false),
    })

  return (
    <section aria-labelledby="admin-photos-title" className="flex flex-col gap-6">
      <h2 id="admin-photos-title" className="text-heading">{t("title")}</h2>

      {isPending && <p className="text-body-sm" role="status">…</p>}
      {!isPending && photos.length === 0 && <p className="text-body">{t("empty")}</p>}

      {photos.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <Checkbox
              label={t("selectAll")}
              checked={selection.state === "all"}
              indeterminate={selection.state === "some"}
              onChange={() => (selection.state === "all" ? selection.clear() : selection.selectAll())}
            />
            <p className="text-body-sm" aria-live="polite">{t("selectedCount", { count: selection.count })}</p>
            <Button
              disabled={selection.count === 0}
              icon={<IconTrash className="h-5 w-5" />}
              onClick={() => setConfirming(true)}
            >
              {t("deleteSelected")}
            </Button>
            <Button
              variant="outlined"
              loading={downloadAll.isPending}
              icon={<IconDownload className="h-5 w-5" />}
              onClick={() => downloadAll.mutate(photos)}
            >
              {t("downloadAll")}
            </Button>
          </div>

          <ul aria-label={t("list")} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <AdminPhotoCard
                key={photo.id}
                photo={photo}
                selected={selection.selected.has(photo.id)}
                onToggle={selection.toggle}
                onDownload={downloadOne.mutate}
              />
            ))}
          </ul>
        </>
      )}

      <AdminDeleteModal
        isOpen={confirming}
        count={selection.count}
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </section>
  )
}
