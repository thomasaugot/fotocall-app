// Mirrors the bucket (5 MB, webp/jpeg) and the 60-per-guest cap in the photos migration.
export const MAX_INPUT_BYTES = 40 * 1024 * 1024
export const MAX_STORED_BYTES = 5 * 1024 * 1024
export const MAX_DIMENSION = 2048
// The small copy every grid shows (album, admin, peeks): ~10× lighter than the full photo, so a
// party of guests scrolling the album stays inside the free plan's monthly download allowance.
export const THUMB_DIMENSION = 720
export const THUMB_QUALITY = 0.74
export const MAX_PHOTOS_PER_GUEST = 60
export const GUEST_NAME_MAX = 60
export const SIGNED_URL_SECONDS = 60 * 60
export const ENCODE_QUALITY = { webp: 0.82, jpeg: 0.85, floor: 0.5, step: 0.1 } as const
export const STORED_MIME = { webp: "image/webp", jpeg: "image/jpeg" } as const
export const STORED_EXTENSION: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg" }

// Thrown before any work when the picked file is not an acceptable image.
export const INVALID_IMAGE = "invalid-image"
