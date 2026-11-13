import { useFormatter, useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Pressable } from "@/components/ui/Pressable"
import { IconDownload, IconEye, IconEyeOff } from "@/components/ui/Icons"
import type { Photo } from "@/types/photo"

interface Props {
  photo: Photo
  selected: boolean
  busy: boolean
  onToggle: (id: string) => void
  onDownload: (photo: Photo) => void
  onSetHidden: (photo: Photo, hidden: boolean) => void
  onOpen: (id: string) => void
}

// One print of the album. A hidden photo is dimmed and tagged "Oculta"; its key shows it again.
export const AdminPhotoCard = ({ photo, selected, busy, onToggle, onDownload, onSetHidden, onOpen }: Props) => {
  const t = useTranslations("admin")
  const format = useFormatter()
  return (
    <li className="flex flex-col gap-3">
      <div className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-2 shadow-md transition-[outline-color] duration-150 outline-3 outline-offset-3 ${selected ? "outline-primary" : "outline-transparent"}`}>
        <Pressable aria-label={t("viewer.open", { name: photo.guestName })} onClick={() => onOpen(photo.id)} className="block h-full w-full">
          <img
            src={photo.thumbUrl}
            alt={t("photos.photoOf", { name: photo.guestName })}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-[opacity,transform] duration-300 hover:scale-[1.02] ${photo.hidden ? "opacity-35 grayscale" : ""}`}
          />
        </Pressable>
        <Checkbox
          label={t("photos.select", { name: photo.guestName })}
          hideLabel
          checked={selected}
          onChange={() => onToggle(photo.id)}
          className="absolute top-1 left-2.5 drop-shadow-md"
        />
        {photo.hidden && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-text px-3 py-1.5">
            <IconEyeOff className="h-3.5 w-3.5 shrink-0 text-surface" />
            <span className="text-body-sm"><span className="text-surface">{t("hide.badge")}</span></span>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="flex min-w-0 flex-col">
          <span className="text-body truncate" title={photo.guestName}>{photo.guestName}</span>
          <time dateTime={photo.createdAt} className="text-body-sm">
            {format.dateTime(new Date(photo.createdAt), { hour: "2-digit", minute: "2-digit" })}
          </time>
        </p>
        <div className="-mr-2 flex shrink-0 items-center">
          <Button
            variant="bare"
            size="md"
            disabled={busy}
            aria-label={`${photo.hidden ? t("hide.show") : t("hide.hide")} · ${photo.guestName}`}
            icon={photo.hidden ? <IconEye className="h-5 w-5 text-text-muted" /> : <IconEyeOff className="h-5 w-5 text-text-muted" />}
            onClick={() => onSetHidden(photo, !photo.hidden)}
          />
          <Button
            variant="bare"
            size="md"
            aria-label={t("photos.download", { name: photo.guestName })}
            icon={<IconDownload className="h-5 w-5 text-text-muted" />}
            onClick={() => onDownload(photo)}
          />
        </div>
      </div>
    </li>
  )
}
