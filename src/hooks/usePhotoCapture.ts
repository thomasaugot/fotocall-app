import { useEffect, useRef, useState } from "react"
import { useTranslations } from "use-intl"
import { useCameraStream } from "@/hooks/useCameraStream"
import { useUploadPhoto } from "@/hooks/useUploadPhoto"
import { showToast } from "@/stores/toast-store"
import type { CameraFacing } from "@/types/camera"
import { captureFrame } from "@/utils/camera-capture"
import { logger } from "@/utils/logger"

interface Preview { file: File; url: string }

// The photocall: camera on/off and facing, the shot waiting for "Añadir al álbum", uploads from
// the phone's library, and how many photos this guest added during this visit.
export const usePhotoCapture = (guestName: string) => {
  const t = useTranslations("home.camera")
  const [cameraOn, setCameraOn] = useState(false)
  const [facing, setFacing] = useState<CameraFacing>("user")
  const [preview, setPreview] = useState<Preview | null>(null)
  const [added, setAdded] = useState(0)
  const camera = useCameraStream(facing, cameraOn)
  const upload = useUploadPhoto()
  const previewUrl = useRef<string | null>(null)

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
  }, [])

  const show = (next: Preview | null) => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = next?.url ?? null
    setPreview(next)
  }

  const capture = async () => {
    const video = camera.videoRef.current
    if (!video || !camera.ready) return
    try {
      const file = await captureFrame(video, facing === "user")
      show({ file, url: URL.createObjectURL(file) })
    } catch (error) {
      logger.error("capture failed", error)
      showToast(t("captureError"), "error")
    }
  }

  const keep = async () => {
    if (!preview) return
    try {
      await upload.mutateAsync({ file: preview.file, guestName })
      setAdded((n) => n + 1)
      show(null)
    } catch (error) {
      logger.warn("photo kept on screen after a failed upload", error)
    }
  }

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        await upload.mutateAsync({ file, guestName })
        setAdded((n) => n + 1)
      } catch (error) {
        logger.warn("library upload skipped", error)
      }
    }
  }

  return {
    videoRef: camera.videoRef,
    cameraReady: camera.ready,
    cameraError: camera.error,
    retryCamera: camera.retry,
    cameraOn,
    openCamera: () => setCameraOn(true),
    facing,
    switchCamera: () => setFacing((f) => (f === "user" ? "environment" : "user")),
    preview,
    capture,
    retake: () => show(null),
    keep,
    uploadFiles,
    uploading: upload.isPending,
    added,
  }
}
