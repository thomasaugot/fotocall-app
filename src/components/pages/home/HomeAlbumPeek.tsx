import { useLocale, useTranslations } from "use-intl"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { usePhotos } from "@/hooks/usePhotos"
import { localizedPath } from "@/i18n/paths"

// Three prints from the top of the pile, newest in front: the album is alive, go and see it.
const PRINT = [
  "-rotate-6",
  "-ml-12 mt-5 rotate-3",
  "-ml-12 -rotate-2",
] as const

export const HomeAlbumPeek = () => {
  const t = useTranslations("home.peek")
  const locale = useLocale()
  const { data } = usePhotos()
  const latest = (data ?? []).slice(0, 3)
  if (latest.length === 0) return null

  return (
    <TransitionLink
      href={localizedPath("gallery", locale)}
      aria-label={t("open")}
      className="mx-auto mt-8 flex w-fit max-w-full flex-col items-center gap-8 rounded-lg py-2 text-center xl:flex-row xl:text-left xl:col-start-1 xl:row-start-2 xl:mx-0"
    >
      <span aria-hidden="true" className="flex shrink-0 items-start pl-1">
        {latest.toReversed().map((photo, i) => (
          <span key={photo.id} className={`block rounded-sm bg-surface p-2 pb-7 shadow-md ${PRINT[i + 3 - latest.length]}`}>
            <img
              src={photo.url}
              alt=""
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="block h-40 w-32 rounded-sm object-cover md:h-52 md:w-40"
            />
          </span>
        ))}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-heading">{t("title")}</span>
        <span className="text-body-sm">{t("by", { name: latest[0].guestName })}</span>
      </span>
    </TransitionLink>
  )
}
