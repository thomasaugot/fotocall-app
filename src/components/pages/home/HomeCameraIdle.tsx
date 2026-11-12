import { useTranslations } from "use-intl"
import { HomeLibraryUpload } from "@/components/pages/home/HomeLibraryUpload"
import { BrandMark } from "@/components/ui/BrandMark"
import { Button } from "@/components/ui/Button"
import { IconCamera } from "@/components/ui/Icons"
import type { CameraError } from "@/types/camera"

interface Props {
  error: CameraError | null
  uploading: boolean
  onOpen: () => void
  onRetry: () => void
  onFiles: (files: File[]) => void
}

// The print before the camera is on: the mark at the top, both ways in under the thumb.
// The camera is never asked for on load; "Abrir la cámara" is the tap that asks.
export const HomeCameraIdle = ({ error, uploading, onOpen, onRetry, onFiles }: Props) => {
  const t = useTranslations("home")
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between gap-7 p-6 pt-10 text-center">
      <BrandMark className="h-16 w-16" />
      {error ? (
        <p role="alert" className="text-body max-w-[26ch]">{t(`camera.${error}`)}</p>
      ) : (
        <p className="text-body max-w-[22ch]">{t("intro.ready")}</p>
      )}
      <div className="flex w-full flex-col gap-3">
        {!error && (
          <Button size="lg" className="w-full" icon={<IconCamera className="h-5 w-5" />} onClick={onOpen}>{t("camera.open")}</Button>
        )}
        {error === "denied" && (
          <Button size="lg" className="w-full" onClick={onRetry}>{t("camera.retry")}</Button>
        )}
        <HomeLibraryUpload compact={false} disabled={uploading} onFiles={onFiles} />
      </div>
    </div>
  )
}
