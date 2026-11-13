// no-unit-test: decodes and re-encodes through createImageBitmap and canvas, browser-only APIs
import { ENCODE_QUALITY, MAX_DIMENSION, MAX_STORED_BYTES, STORED_MIME, THUMB_DIMENSION, THUMB_QUALITY } from "@/constants/upload-limits"
import type { PreparedImage, PreparedPhoto } from "@/types/photo"
import { fitWithin } from "@/utils/image-file"

const encode = (canvas: HTMLCanvasElement, mime: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality))

// Resized and re-encoded before storage, never stored as uploaded (10-SEO). Re-encoding also
// drops EXIF, so a guest's GPS position never reaches the album.
export const prepareImage = async (file: File): Promise<PreparedImage> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_DIMENSION)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D context unavailable")
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // Safari cannot encode WebP: toBlob silently returns PNG, so fall back to JPEG.
  let blob = await encode(canvas, STORED_MIME.webp, ENCODE_QUALITY.webp)
  let mime: string = STORED_MIME.webp
  let quality: number = ENCODE_QUALITY.webp
  if (!blob || blob.type !== STORED_MIME.webp) {
    mime = STORED_MIME.jpeg
    quality = ENCODE_QUALITY.jpeg
    blob = await encode(canvas, mime, quality)
  }
  while (blob && blob.size > MAX_STORED_BYTES && quality > ENCODE_QUALITY.floor) {
    quality -= ENCODE_QUALITY.step
    blob = await encode(canvas, mime, quality)
  }
  if (!blob || blob.size > MAX_STORED_BYTES) throw new Error("Image could not be compressed under the limit")
  return { blob, mime, width, height }
}

// The grid copy: same picture, 720 px on its long side, light. WebP, JPEG on Safari.
const prepareThumb = async (bitmap: ImageBitmap): Promise<PreparedImage> => {
  const { width, height } = fitWithin(bitmap.width, bitmap.height, THUMB_DIMENSION)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D context unavailable")
  context.drawImage(bitmap, 0, 0, width, height)
  let blob = await encode(canvas, STORED_MIME.webp, THUMB_QUALITY)
  let mime: string = STORED_MIME.webp
  if (!blob || blob.type !== STORED_MIME.webp) {
    mime = STORED_MIME.jpeg
    blob = await encode(canvas, mime, THUMB_QUALITY)
  }
  if (!blob) throw new Error("Thumbnail could not be encoded")
  return { blob, mime, width, height }
}

// What an upload stores: the full photo (viewer, download) and its grid copy.
export const preparePhoto = async (file: File): Promise<PreparedPhoto> => {
  const full = await prepareImage(file)
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  try {
    return { ...full, thumb: await prepareThumb(bitmap) }
  } finally {
    bitmap.close()
  }
}
