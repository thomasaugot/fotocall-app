import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconDownload, IconTrash } from "@/components/ui/Icons"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { useDeletePhoto } from "@/hooks/useDeletePhoto"
import type { Photo } from "@/types/photo"
import { downloadHref, downloadName } from "@/utils/photo-viewer"

interface GalleryViewerActionsProps {
  photo: Photo
  canDelete: boolean
  confirming: boolean
  onConfirming: (confirming: boolean) => void
  onDeleted: () => void
}

// Under the photo: save it, and for its author take it out of the album, in two steps.
export const GalleryViewerActions = ({ photo, canDelete, confirming, onConfirming, onDeleted }: GalleryViewerActionsProps) => {
  const t = useTranslations("gallery.viewer")
  const remove = useDeletePhoto()

  if (confirming) {
    return (
      <div role="group" aria-labelledby="gallery-delete-question" className="flex w-full max-w-md flex-col gap-4">
        <p className="flex flex-col gap-1 text-center">
          <span id="gallery-delete-question" className="text-body">{t("confirm.question")}</span>
          <span className="text-body-sm">{t("confirm.hint")}</span>
        </p>
        <div className="flex gap-3">
          <Button variant="outlined" size="lg" autoFocus className="flex-1" disabled={remove.isPending} onClick={() => onConfirming(false)}>
            {t("confirm.no")}
          </Button>
          <Button
            size="lg"
            loading={remove.isPending}
            className="flex-1 bg-danger! hover:bg-danger!"
            onClick={() => remove.mutate(photo, { onSuccess: onDeleted })}
          >
            {t("confirm.yes")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-md gap-3">
      <TransitionLink
        href={downloadHref(photo)}
        download={downloadName(photo)}
        className="text-button inline-flex h-13 flex-1 items-center justify-center gap-3 rounded-full bg-primary px-7 text-on-primary transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
      >
        <IconDownload className="h-5 w-5 shrink-0" />
        {t("download")}
      </TransitionLink>
      {canDelete && (
        <Button variant="outlined" size="lg" icon={<IconTrash className="h-5 w-5" />} onClick={() => onConfirming(true)}>
          {t("delete")}
        </Button>
      )}
    </div>
  )
}
