import { useEffect, useRef, useState } from "react"
import { useTranslations } from "use-intl"
import { useCameraStream } from "@/hooks/useCameraStream"
import { runUploadQueue } from "@/hooks/useUploadQueue"
import { enqueuePhoto, stillQueued } from "@/services/upload-queue"
import { isAcceptedImage } from "@/utils/image-file"
import { preparePhoto } from "@/utils/image-resize"
import { normalizeGuestName } from "@/utils/guest-name"
import { showToast } from "@/stores/toast-store"
import type { CameraFacing } from "@/types/camera"
import { captureFrame } from "@/utils/camera-capture"
import { logger } from "@/utils/logger"

interface Preview { file: File; url: string }

// The photocall: camera on/off and facing, then a REVIEW before anything reaches the album: the
// shot just taken, or the photos picked from the phone. The guest drops the ones they don't want
// and adds the rest. Also counts how many photos this guest added during this visit.
type Source = "camera" | "library"

// How long the review waits for the photos to reach the album before calling them "saved".
const WAIT_FOR_UPLOAD_MS = 8_000

export const usePhotoCapture = (guestName: string) => {
  const t = useTranslations("home.camera")
  const [cameraOn, setCameraOn] = useState(false)
  const [facing, setFacing] = useState<CameraFacing>("user")
  const [review, setReview] = useState<{ items: Preview[]; source: Source } | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [added, setAdded] = useState(0)
  const [celebration, setCelebration] = useState<{ count: number; url: string; queued: number } | null>(null)
  const [failures, setFailures] = useState(0)
  const camera = useCameraStream(facing, cameraOn)
  const urls = useRef(new Set<string>())

  useEffect(() => () => {
    for (const url of urls.current) URL.revokeObjectURL(url)
  }, [])

  const toPreview = (file: File): Preview => {
    const url = URL.createObjectURL(file)
    urls.current.add(url)
    return { file, url }
  }
  const release = (items: Preview[]) => {
    for (const item of items) {
      URL.revokeObjectURL(item.url)
      urls.current.delete(item.url)
    }
  }

  const capture = async () => {
    const video = camera.videoRef.current
    if (!video || !camera.ready) return
    try {
      const file = await captureFrame(video, facing === "user")
      setReview({ items: [toPreview(file)], source: "camera" })
    } catch (error) {
      logger.error("capture failed", error)
      showToast(t("captureError"), "error")
    }
  }

  const reviewFiles = (files: File[]) => {
    if (review) release(review.items)
    setReview({ items: files.map(toPreview), source: "library" })
  }

  const removeAt = (index: number) => {
    if (!review) return
    const gone = review.items[index]
    if (gone) release([gone])
    const items = review.items.filter((_, i) => i !== index)
    setReview(items.length ? { ...review, items } : null)
  }

  const discard = () => {
    if (review) release(review.items)
    setReview(null)
  }

  // Each photo is prepared and SAVED ON THE PHONE first (the upload queue), so nothing is lost on
  // a bad connection; then the queue sends them. The review waits a few seconds for them: what is
  // still on the phone after that is celebrated as "saved, will join the album on its own".
  const keepAll = async () => {
    if (!review) return
    const total = review.items.length
    const refused: Preview[] = []
    const saved: Preview[] = []
    const ids: string[] = []
    const name = normalizeGuestName(guestName)
    for (const [i, item] of review.items.entries()) {
      setProgress({ current: i + 1, total })
      try {
        if (!isAcceptedImage(item.file)) throw new Error("invalid image")
        ids.push(await enqueuePhoto(await preparePhoto(item.file), name))
        saved.push(item)
      } catch (error) {
        logger.warn("photo could not be prepared", error)
        refused.push(item)
      }
    }
    if (ids.length) {
      await Promise.race([runUploadQueue(), new Promise((resolve) => setTimeout(resolve, WAIT_FOR_UPLOAD_MS))])
    }
    const queued = ids.length ? (await stillQueued(ids)).length : 0
    setProgress(null)
    setAdded((n) => n + saved.length)
    const hero = saved.at(-1)
    release(saved.slice(0, -1))
    if (refused.length) {
      setFailures((n) => n + 1)
      setReview({ ...review, items: refused })
      if (hero) release([hero])
      return
    }
    setReview(null)
    if (hero) setCelebration({ count: saved.length, url: hero.url, queued })
  }

  const endCelebration = () => {
    if (celebration) release([{ url: celebration.url } as Preview])
    setCelebration(null)
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
    capture,
    review,
    reviewFiles,
    removeAt,
    discard,
    keepAll,
    celebration,
    endCelebration,
    failures,
    progress,
    uploading: progress !== null,
    added,
  }
}
