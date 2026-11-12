import { ZIP_CONCURRENCY } from "@/constants/admin"
import type { Photo } from "@/types/photo"
import type { ZipFile } from "@/types/admin"
import { uniqueNames } from "@/utils/photo-file"

// Signed URLs only (private bucket); the app's CSP allows the Supabase origin in connect-src.
export const fetchPhotoBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Photo download failed: ${response.status}`)
  return response.blob()
}

export const fetchPhotoFiles = async (photos: Photo[]): Promise<ZipFile[]> => {
  const names = uniqueNames(photos)
  const files: ZipFile[] = new Array(photos.length)
  let next = 0
  const worker = async () => {
    while (next < photos.length) {
      const i = next++
      const blob = await fetchPhotoBlob(photos[i].url)
      files[i] = { name: names[i], data: new Uint8Array(await blob.arrayBuffer()) }
    }
  }
  await Promise.all(Array.from({ length: Math.min(ZIP_CONCURRENCY, photos.length) }, worker))
  return files
}

// Photos are already compressed (WebP/JPEG): stored, not deflated, so the zip is quick on a phone.
export const zipFiles = async (files: ZipFile[]): Promise<Blob> => {
  const { zipSync } = await import("fflate")
  const entries = Object.fromEntries(files.map((f) => [f.name, [f.data, { level: 0 }] as [Uint8Array, { level: 0 }]]))
  return new Blob([zipSync(entries) as Uint8Array<ArrayBuffer>], { type: "application/zip" })
}
