import { useState } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconTrash } from "@/components/ui/Icons"
import { Modal } from "@/components/ui/Modal"
import { useDeletePhoto } from "@/hooks/useDeletePhoto"
import { useMyPhotos } from "@/hooks/useMyPhotos"
import type { Photo } from "@/types/photo"

// What this guest has added today, as prints to swipe through, each with its own delete key.
export const HomeMyPhotos = () => {
  const t = useTranslations("home.mine")
  const mine = useMyPhotos()
  const remove = useDeletePhoto()
  const [doomed, setDoomed] = useState<Photo | null>(null)
  if (mine.length === 0) return null

  const confirm = () => {
    if (!doomed) return
    remove.mutate(doomed, { onSettled: () => setDoomed(null) })
  }

  return (
    <section aria-labelledby="home-mine-title" className="flex w-full flex-col gap-6 xl:col-span-2 xl:row-start-5">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 id="home-mine-title" className="text-heading">{t("title")}</h2>
        <p className="text-body-sm">{t("count", { count: mine.length })}</p>
      </div>
      <ul data-lenis-prevent className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-4 pb-12 no-scrollbar">
        {mine.map((photo) => (
          <li key={photo.id} className="relative w-40 shrink-0 snap-center rounded-sm bg-surface p-2 pb-3 shadow-md md:w-48">
            <img
              src={photo.thumbUrl}
              alt={t("alt")}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="block aspect-[3/4] w-full rounded-sm object-cover"
            />
            <div className="flex justify-end pt-2">
              <Button
                variant="outlined"
                size="sm"
                aria-label={t("delete")}
                icon={<IconTrash className="h-4 w-4" />}
                onClick={() => setDoomed(photo)}
              />
            </div>
          </li>
        ))}
      </ul>
      <Modal isOpen={doomed !== null} onClose={() => setDoomed(null)} title={t("confirmTitle")} size="sm">
        <p className="text-body">{t("confirmBody")}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" className="w-full" loading={remove.isPending} onClick={confirm}>{t("confirmYes")}</Button>
          <Button variant="outlined" size="lg" className="w-full" onClick={() => setDoomed(null)}>{t("confirmNo")}</Button>
        </div>
      </Modal>
    </section>
  )
}
