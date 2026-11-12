import { useQuery } from "@tanstack/react-query"
import { photosQuery } from "@/services/photo-queries"
import { keepSignedUrls } from "@/utils/signed-url-cache"

// The album's photos (same cache entry as usePhotos), each keeping its first signed URL so the
// 30 s refresh adds new photos without downloading the old ones again.
export const useAlbumPhotos = () => useQuery({ ...photosQuery(), select: (photos) => keepSignedUrls(photos) })
