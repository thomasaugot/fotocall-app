// Every capture is a 3:4 portrait: natural for a phone held upright, and the album grid stays even.
export const CAPTURE_RATIO = 3 / 4

export interface CropRect { sx: number; sy: number; sw: number; sh: number }

// The largest centred rectangle of `ratio` (width / height) inside the source: "object-fit: cover".
export const coverCrop = (srcWidth: number, srcHeight: number, ratio: number): CropRect => {
  if (srcWidth <= 0 || srcHeight <= 0) return { sx: 0, sy: 0, sw: 0, sh: 0 }
  const srcRatio = srcWidth / srcHeight
  if (srcRatio > ratio) {
    const sw = srcHeight * ratio
    return { sx: (srcWidth - sw) / 2, sy: 0, sw, sh: srcHeight }
  }
  const sh = srcWidth / ratio
  return { sx: 0, sy: (srcHeight - sh) / 2, sw: srcWidth, sh }
}
