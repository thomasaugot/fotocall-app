import { useEffect, useRef, useState } from "react"
import type { CameraError, CameraFacing } from "@/types/camera"
import { logger } from "@/utils/logger"

const stop = (stream: MediaStream | null) => stream?.getTracks().forEach((track) => track.stop())

// Live camera for the viewfinder. Nothing is requested until `enabled` (a tap), so the permission
// prompt never appears on page load. Every state comes from the async answer, keyed by the
// request it answers: switching camera or retrying never shows the previous stream's state.
export const useCameraStream = (facing: CameraFacing, enabled: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [answer, setAnswer] = useState<{ key: string; ok: boolean } | null>(null)
  const supported = !!navigator.mediaDevices?.getUserMedia
  const key = `${facing}:${attempt}`

  useEffect(() => {
    if (!enabled || !supported) return
    const video = videoRef.current
    let cancelled = false
    let stream: MediaStream | null = null
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing, width: { ideal: 1440 }, height: { ideal: 1920 } }, audio: false })
      .then((granted) => {
        if (cancelled) return stop(granted)
        stream = granted
        if (video) video.srcObject = granted
        setAnswer({ key, ok: true })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        logger.warn("camera unavailable", error)
        setAnswer({ key, ok: false })
      })
    return () => {
      cancelled = true
      stop(stream)
      if (video) video.srcObject = null
    }
  }, [enabled, supported, facing, key])

  const current = answer?.key === key ? answer : null
  const error: CameraError | null = !supported ? "unsupported" : current && !current.ok ? "denied" : null

  return { videoRef, ready: enabled && !!current?.ok, error, retry: () => setAttempt((n) => n + 1) }
}
