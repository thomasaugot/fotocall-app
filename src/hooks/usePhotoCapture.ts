import { useEffect, useRef, useState } from "react"
import { useTranslations } from "use-intl"
import { useCameraStream } from "@/hooks/useCameraStream"
import { useUploadPhoto } from "@/hooks/useUploadPhoto"
import { showToast } from "@/stores/toast-store"
import type { CameraFacing } from "@/types/camera"
import { captureFrame } from "@/utils/camera-capture"
import { logger } from "@/utils/logger"

interface Preview { file: File; url: string }

// The photocall: camera on/off and facing, then a REVIEW before anything reaches the album: the
// shot just taken, or the photos picked from the phone. The guest drops the ones they don't want
// and adds the rest. Also counts how many photos this guest added during this visit.
type Source = "camera" | "library"

export const usePhotoCapture = (guestName: string) => {
  const t = useTranslations("home.camera")
  const [cameraOn, setCameraOn] = useState(false)
  const [facing, setFacing] = useState<CameraFacing>("user")
  const [review, setReview] = useState<{ items: Preview[]; source: Source } | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [added, setAdded] = useState(0)
  const [celebration, setCelebration] = useState<{ count: number; url: string } | null>(null)
  const [failures, setFailures] = useState(0)
  const camera = useCameraStream(facing, cameraOn)
  const upload = useUploadPhoto()
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

  // One by one, so a failure keeps only the photos that did not make it on screen.
  const keepAll = async () => {
    if (!review) return
    const failed: Preview[] = []
    const done: Preview[] = []
    const total = review.items.length
    for (const [i, item] of review.items.entries()) {
      setProgress({ current: i + 1, total })
      try {
        await upload.mutateAsync({ file: item.file, guestName })
        setAdded((n) => n + 1)
        done.push(item)
      } catch (error) {
        logger.warn("photo kept in review after a failed upload", error)
        failed.push(item)
      }
    }
    setProgress(null)
    // The last photo that made it stays alive for the celebration; the others are released.
    const hero = done.at(-1)
    release(done.slice(0, -1))
    if (failed.length) {
      setFailures((n) => n + 1)
      setReview({ ...review, items: failed })
      if (hero) release([hero])
      return
    }
    setReview(null)
    if (hero) setCelebration({ count: done.length, url: hero.url })
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
    uploading: upload.isPending || progress !== null,
    added,
  }
}
