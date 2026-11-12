import { queryOptions } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"
import { ensureGuestSession } from "@/services/auth"
import { listPhotos } from "@/services/photos"

// Live data during the party: other guests keep adding photos (14-PERFORMANCE, "Live" row).
// Polled every 30 s only while the tab is visible (TanStack pauses it in the background); our own
// uploads and deletes invalidate it at once. 30 s stays far under the 1 h signed-URL lifetime.
export const PHOTOS_REFRESH_MS = 30_000

// Reading needs a session (RLS: authenticated only), so the first read signs the guest in.
export const photosQuery = () =>
  queryOptions({
    queryKey: queryKeys.photos.all,
    queryFn: async () => {
      await ensureGuestSession()
      return listPhotos()
    },
    staleTime: PHOTOS_REFRESH_MS,
    refetchInterval: PHOTOS_REFRESH_MS,
  })
