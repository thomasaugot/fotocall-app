import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"
import { useLocale, useTranslations } from "use-intl"
import { HomeCamera } from "@/components/pages/home/HomeCamera"
import { HomeCameraIdle } from "@/components/pages/home/HomeCameraIdle"
import { HomeCelebration } from "@/components/pages/home/HomeCelebration"
import { HomeNameForm } from "@/components/pages/home/HomeNameForm"
import { HomeReview } from "@/components/pages/home/HomeReview"
import { HomeSignature } from "@/components/pages/home/HomeSignature"
import { StageFrame } from "@/components/ui/StageFrame"
import { Gloria } from "@/components/ui/Gloria"
import { IconArrow } from "@/components/ui/Icons"
import { OliveBranch } from "@/components/ui/OliveBranch"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { useLoaderGone } from "@/hooks/useAppReady"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import type { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { localizedPath } from "@/i18n/paths"
import { pulseGloria } from "@/utils/animations/gloria-pulse"
import { flashShutter } from "@/utils/animations/shutter-flash"
import { initStageArrive } from "@/utils/animations/stage-arrive"

interface Props {
  photocall: ReturnType<typeof usePhotoCapture>
  name: string
  needsName: boolean
  onSave: (name: string) => void
  onEdit: () => void
}

// The photocall is one large photo print: fine gold rays behind it, olive branches at its foot. It asks for
// the name, becomes the viewfinder, shows the shot, and the rays swell when a photo joins the album.
export const HomeStage = ({ photocall, name, needsName, onSave, onEdit }: Props) => {
  const t = useTranslations("home.camera")
  const locale = useLocale()
  const { pathname } = useLocation()
  const loaderGone = useLoaderGone()
  const { preference } = useMotionPreference()
  const reduced = preference === "reduced"
  const rootRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState(name)
  const { cameraOn, cameraError, added, uploading } = photocall
  const live = cameraOn && !cameraError

  // A first-paint entrance: after the loader has left, and again on every return to the page.
  useEffect(() => {
    const root = rootRef.current
    if (!loaderGone || !root) return
    return initStageArrive(root, reduced)
  }, [loaderGone, pathname, reduced])

  useEffect(() => {
    if (rootRef.current && added > 0) pulseGloria(rootRef.current, reduced)
  }, [added, reduced])

  const openCamera = () => {
    photocall.openCamera()
    rootRef.current?.scrollIntoView({ block: "end", behavior: reduced ? "auto" : "smooth" })
  }
  const shoot = () => {
    if (rootRef.current) flashShutter(rootRef.current, reduced)
    void photocall.capture()
  }

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[min(100%,calc((100svh-9rem)*0.7))] scroll-mb-6 flex-col gap-6 xl:col-start-2 xl:row-span-4 xl:row-start-1 xl:max-w-[min(100%,calc((100svh-12rem)*0.72))] xl:justify-self-center"
    >
      <div className="relative px-6">
        <div data-anim="stage-gloria" className="invisible absolute -top-[30%] left-1/2 w-[170%] -translate-x-1/2">
          <Gloria className="h-auto w-full" />
        </div>
        <div data-anim="stage-arch" className="invisible relative">
          <StageFrame
            foot={
              <HomeSignature
                name={name}
                draft={needsName ? draft : null}
                onEdit={() => {
                  setDraft(name)
                  onEdit()
                }}
              />
            }
          >
            {live && <HomeCamera photocall={photocall} onShoot={shoot} locked={needsName} />}
            {!live && !needsName && (
              <HomeCameraIdle
                error={cameraError}
                uploading={uploading}
                onOpen={openCamera}
                onRetry={photocall.retryCamera}
                onFiles={photocall.reviewFiles}
              />
            )}
            {photocall.review && !needsName && <HomeReview photocall={photocall} />}
            <HomeCelebration photocall={photocall} />
            {needsName && (
              <HomeNameForm
                initialName={name}
                onType={setDraft}
                onSave={(next) => {
                  setDraft(next)
                  onSave(next)
                }}
              />
            )}
          </StageFrame>
        </div>
        <div data-anim="stage-branch" className="invisible absolute -bottom-5 left-0 w-[20%]">
          <OliveBranch className="h-auto w-full -scale-x-100" />
        </div>
        <div data-anim="stage-branch" className="invisible absolute right-0 -bottom-5 w-[20%]">
          <OliveBranch className="h-auto w-full" />
        </div>
      </div>

      <div data-anim="stage-below" className="invisible flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-9">
        <p className="text-body-sm" aria-live="polite">{added > 0 ? t("added", { count: added }) : ""}</p>
        <TransitionLink href={localizedPath("gallery", locale)} className="text-button ml-auto inline-flex min-h-11 items-center gap-2 rounded-sm text-primary">
          {t("seeGallery")}
          <IconArrow className="h-4 w-4 shrink-0" />
        </TransitionLink>
      </div>
    </div>
  )
}
