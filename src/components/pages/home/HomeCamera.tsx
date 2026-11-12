import { useTranslations } from "use-intl"
import { HomeLibraryUpload } from "@/components/pages/home/HomeLibraryUpload"
import { HomeShutter } from "@/components/pages/home/HomeShutter"
import { Button } from "@/components/ui/Button"
import { IconSwitchCamera } from "@/components/ui/Icons"
import type { usePhotoCapture } from "@/hooks/usePhotoCapture"

interface Props {
  photocall: ReturnType<typeof usePhotoCapture>
  onShoot: () => void
  // The name form covers the camera while the name is edited: its keys must not take focus.
  locked: boolean
}

// The photo of the print while the camera is on: the live image, then the shot developing, with
// the keys on its lower edge, under the thumb. Shutter in the middle, the two quiet keys beside it.
export const HomeCamera = ({ photocall, onShoot, locked }: Props) => {
  const t = useTranslations("home.camera")
  const { videoRef, cameraReady, preview, facing, uploading } = photocall

  return (
    <div role="group" aria-label={t("label")} data-ground="ink" inert={locked} className="absolute inset-0 bg-ink">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""} ${preview ? "invisible" : ""}`}
      />
      {preview && (
        <img src={preview.url} alt={t("previewAlt")} width={3} height={4} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div data-anim="develop-veil" aria-hidden="true" className="invisible pointer-events-none absolute inset-0 bg-surface" />
      <div data-anim="shutter-flash" aria-hidden="true" className="invisible pointer-events-none absolute inset-0 bg-surface" />

      {preview ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-3">
          <Button variant="inverse" size="lg" className="flex-1 px-4" onClick={photocall.retake} disabled={uploading}>
            {t("retake")}
          </Button>
          <Button size="lg" className="flex-[1.7] px-4" loading={uploading} onClick={() => void photocall.keep()}>
            {t("keep")}
          </Button>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto_1fr] items-center px-4 pb-4">
          <div className="justify-self-start">
            <HomeLibraryUpload compact disabled={uploading} onFiles={(files) => void photocall.uploadFiles(files)} />
          </div>
          <HomeShutter label={t("shutter")} disabled={!cameraReady || uploading} onShoot={onShoot} />
          <Button
            variant="inverse"
            size="lg"
            className="justify-self-end"
            aria-label={t("switch")}
            icon={<IconSwitchCamera className="h-5 w-5" />}
            onClick={photocall.switchCamera}
          />
        </div>
      )}
    </div>
  )
}
