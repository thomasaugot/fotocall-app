// no-unit-test: draws a live <video> frame through a canvas, browser-only APIs
import { CAPTURE_RATIO, coverCrop } from "@/utils/capture-crop"

const MAX_HEIGHT = 2048

// What the guest saw is what they get: the selfie camera is mirrored on screen, so the capture
// is mirrored too. The album re-encodes it afterwards (prepareImage), so JPEG here is a carrier.
export const captureFrame = async (video: HTMLVideoElement, mirror: boolean): Promise<File> => {
  const { sx, sy, sw, sh } = coverCrop(video.videoWidth, video.videoHeight, CAPTURE_RATIO)
  if (!sw || !sh) throw new Error("Camera has no frame yet")
  const scale = Math.min(1, MAX_HEIGHT / sh)
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(sw * scale)
  canvas.height = Math.round(sh * scale)
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D context unavailable")
  if (mirror) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
  }
  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))
  if (!blob) throw new Error("Capture could not be encoded")
  return new File([blob], "foto.jpg", { type: "image/jpeg" })
}
