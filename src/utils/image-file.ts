import { MAX_INPUT_BYTES, STORED_EXTENSION } from "@/constants/upload-limits"

// Checked before any decoding: the bucket still enforces its own size and type limits.
export const isAcceptedImage = (file: { type: string; size: number }): boolean =>
  file.type.startsWith("image/") && file.size > 0 && file.size <= MAX_INPUT_BYTES

export const fitWithin = (width: number, height: number, max: number) => {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

// The file name is generated, never the uploaded one (11-SECURITY → File uploads).
export const storagePathFor = (ownerId: string, mime: string, prefix = ""): string => {
  const ext = STORED_EXTENSION[mime]
  if (!ext) throw new Error(`Unsupported stored type: ${mime}`)
  return `${ownerId}/${prefix}${crypto.randomUUID()}.${ext}`
}

// Both files of a photo, for removal. Older photos have no grid copy.
export const photoFiles = (photo: { storagePath: string; thumbPath: string | null }): string[] =>
  photo.thumbPath ? [photo.storagePath, photo.thumbPath] : [photo.storagePath]
