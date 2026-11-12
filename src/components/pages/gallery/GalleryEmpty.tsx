import { useLocale, useTranslations } from "use-intl"
import { GalleryCorners } from "@/components/pages/gallery/GalleryCorners"
import { IconCamera } from "@/components/ui/Icons"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { useLoaderGone } from "@/hooks/useAppReady"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { localizedPath } from "@/i18n/paths"
import { initMountReveal } from "@/utils/animations/mount-reveal"

// No photo yet: the first leaf of the album with its corners waiting for a print. The empty
// place IS the way to the camera, signed underneath where the guest's name will go.
export const GalleryEmpty = () => {
  const t = useTranslations("gallery.empty")
  const locale = useLocale()
  const { preference } = useMotionPreference()
  const loaderGone = useLoaderGone()
  // An entrance: it waits for the opening loader to lift (05-ANIMATIONS, loaderGone).
  const rootRef = useGSAPAnimations<HTMLDivElement>(
    () => (loaderGone ? { critical: [(root) => initMountReveal(root, preference === "reduced")] } : {}),
    [loaderGone, preference],
  )

  return (
    <div
      ref={rootRef}
      className="grid w-full max-w-3xl items-center gap-8 rounded-md bg-surface p-6 shadow-md md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-12 md:p-10"
    >
      <figure data-anim="mounted-photo" className="invisible mx-auto flex w-full max-w-56 flex-col gap-3 md:max-w-none">
        <TransitionLink
          href={localizedPath("home", locale)}
          className="group relative flex aspect-3/4 w-full flex-col items-center justify-center gap-4 bg-surface-2 px-4 text-center transition-transform duration-200 ease-out active:scale-[0.985]"
        >
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <IconCamera className="h-7 w-7 shrink-0" />
          </span>
          <span className="text-button leading-snug text-primary">{t("cta")}</span>
          <GalleryCorners />
        </TransitionLink>
        <figcaption className="text-signature">
          <span className="text-text-subtle">{t("sign")}</span>
        </figcaption>
      </figure>
      <div className="flex flex-col gap-3">
        <h2 className="text-heading">{t("title")}</h2>
        <p className="text-body max-w-[40ch]">{t("body")}</p>
      </div>
    </div>
  )
}
