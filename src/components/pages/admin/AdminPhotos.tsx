import { useState } from "react"
import { useTranslations } from "use-intl"
import { AdminDeleteModal } from "@/components/pages/admin/AdminDeleteModal"
import { AdminPhotoCard } from "@/components/pages/admin/AdminPhotoCard"
import { AdminViewer } from "@/components/pages/admin/AdminViewer"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { IconDownload, IconEye, IconEyeOff, IconTrash } from "@/components/ui/Icons"
import { useAdminDeletePhotos } from "@/hooks/useAdminDeletePhotos"
import { useAdminSetHidden } from "@/hooks/useAdminSetHidden"
import { useDownloadAllPhotos } from "@/hooks/useDownloadAllPhotos"
import { useDownloadPhoto } from "@/hooks/useDownloadPhoto"
import { usePhotoSelection } from "@/hooks/usePhotoSelection"
import { usePhotoViewer } from "@/hooks/usePhotoViewer"
import type { Photo } from "@/types/photo"
import { filterPhotos, selectionHides, type AdminFilter } from "@/utils/admin-stats"

interface Props { photos: Photo[]; isPending: boolean }

const FILTERS: AdminFilter[] = ["all", "hidden"]

export const AdminPhotos = ({ photos, isPending }: Props) => {
  const t = useTranslations("admin")
  const [filter, setFilter] = useState<AdminFilter>("all")
  const [confirming, setConfirming] = useState(false)
  const [doomed, setDoomed] = useState<Photo[]>([])
  const shown = filterPhotos(photos, filter)
  const selection = usePhotoSelection(shown.map((p) => p.id))
  const picked = shown.filter((p) => selection.selected.has(p.id))
  const hides = selectionHides(picked)
  const remove = useAdminDeletePhotos()
  const setHidden = useAdminSetHidden()
  const downloadOne = useDownloadPhoto()
  const downloadAll = useDownloadAllPhotos()
  const viewer = usePhotoViewer(shown)
  const position = viewer.place ? shown.findIndex((p) => p.id === viewer.place?.photo.id) + 1 : 0

  // The delete confirmation serves the selection and the viewer alike.
  const askDelete = (photos: Photo[]) => {
    setDoomed(photos)
    setConfirming(true)
  }
  const confirmDelete = () =>
    remove.mutate(doomed, {
      onSuccess: () => selection.clear(),
      onSettled: () => setConfirming(false),
    })

  return (
    <section aria-labelledby="admin-photos-title" className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="admin-photos-title" className="text-heading">{t("photos.title")}</h2>
        <div role="group" aria-label={t("photos.filterLabel")} className="flex rounded-full bg-surface-2 p-1">
          {FILTERS.map((key) => (
            <Button
              key={key}
              size="sm"
              variant={filter === key ? "filled" : "bare"}
              aria-pressed={filter === key}
              className={filter === key ? "" : "text-text-muted"}
              onClick={() => { setFilter(key); selection.clear() }}
            >
              {key === "all" ? t("photos.all") : t("photos.onlyHidden")}
            </Button>
          ))}
        </div>
      </div>

      {shown.length > 0 && (
        <div
          role="toolbar"
          aria-label={t("photos.toolbar")}
          className="sticky top-16 z-dropdown -mx-2 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-surface/95 px-4 py-3 shadow-md"
        >
          <Checkbox
            label={t("photos.selectAll")}
            checked={selection.state === "all"}
            indeterminate={selection.state === "some"}
            onChange={() => (selection.state === "all" ? selection.clear() : selection.selectAll())}
          />
          <p className="text-body-sm grow" aria-live="polite">{selection.count > 0 ? t("photos.selectedCount", { count: selection.count }) : ""}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              size="sm"
              disabled={selection.count === 0}
              loading={setHidden.isPending}
              icon={hides ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              onClick={() => setHidden.mutate({ ids: picked.map((p) => p.id), hidden: hides }, { onSuccess: () => selection.clear() })}
            >
              {hides ? t("hide.hideSelected") : t("hide.showSelected")}
            </Button>
            <Button variant="outlined" size="sm" disabled={selection.count === 0} icon={<IconTrash className="h-4 w-4" />} onClick={() => askDelete(picked)}>
              {t("photos.deleteSelected")}
            </Button>
            <Button size="sm" loading={downloadAll.isPending} icon={<IconDownload className="h-4 w-4" />} onClick={() => downloadAll.mutate(photos)}>
              {t("photos.downloadAll")}
            </Button>
          </div>
        </div>
      )}

      {isPending && <p className="text-body-sm" role="status">…</p>}
      {!isPending && shown.length === 0 && (
        <p className="text-body rounded-xl bg-surface p-8 text-center shadow-sm">{filter === "hidden" ? t("photos.emptyHidden") : t("photos.empty")}</p>
      )}

      {shown.length > 0 && (
        <ul aria-label={t("photos.list")} className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 2xl:grid-cols-4">
          {shown.map((photo) => (
            <AdminPhotoCard
              key={photo.id}
              photo={photo}
              selected={selection.selected.has(photo.id)}
              busy={setHidden.isPending}
              onToggle={selection.toggle}
              onDownload={downloadOne.mutate}
              onSetHidden={(p, hidden) => setHidden.mutate({ ids: [p.id], hidden })}
              onOpen={viewer.open}
            />
          ))}
        </ul>
      )}

      <AdminViewer
        place={viewer.place}
        direction={viewer.direction}
        photos={shown}
        index={position}
        total={shown.length}
        busy={setHidden.isPending}
        onClose={viewer.close}
        onPrev={viewer.goPrev}
        onNext={viewer.goNext}
        onSetHidden={(p, hidden) => setHidden.mutate({ ids: [p.id], hidden })}
        onDownload={downloadOne.mutate}
        onDelete={(p) => askDelete([p])}
        onJump={viewer.open}
      />

      <AdminDeleteModal isOpen={confirming} count={doomed.length} loading={remove.isPending} onConfirm={confirmDelete} onClose={() => setConfirming(false)} />
    </section>
  )
}
