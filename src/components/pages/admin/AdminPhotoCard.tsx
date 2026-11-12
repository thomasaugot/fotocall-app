import { useFormatter, useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { IconDownload } from "@/components/ui/Icons"
import type { Photo } from "@/types/photo"

interface Props {
  photo: Photo
  selected: boolean
  onToggle: (id: string) => void
  onDownload: (photo: Photo) => void
}

export const AdminPhotoCard = ({ photo, selected, onToggle, onDownload }: Props) => {
  const t = useTranslations("admin.photos")
  const format = useFormatter()
  return (
    <li className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-sm">
      <div className="relative aspect-[3/4] bg-surface-2">
        <img
          src={photo.url}
          alt={t("photoOf", { name: photo.guestName })}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <Checkbox
          label={t("select", { name: photo.guestName })}
          hideLabel
          checked={selected}
          onChange={() => onToggle(photo.id)}
          className="absolute top-1 left-1"
        />
      </div>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-body truncate">{photo.guestName}</span>
          <time dateTime={photo.createdAt} className="text-body-sm">
            {format.dateTime(new Date(photo.createdAt), { dateStyle: "short", timeStyle: "short" })}
          </time>
        </div>
        <Button
          variant="outlined"
          size="sm"
          aria-label={t("download", { name: photo.guestName })}
          icon={<IconDownload className="h-4 w-4" />}
          onClick={() => onDownload(photo)}
        />
      </div>
    </li>
  )
}
