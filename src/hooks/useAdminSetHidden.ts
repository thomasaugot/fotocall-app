import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { queryKeys } from "@/constants/query-keys"
import { setPhotosHidden } from "@/services/admin-photos"
import { showToast } from "@/stores/toast-store"
import type { Photo } from "@/types/photo"
import { logger } from "@/utils/logger"

// Hide photos from the guests' album (or show them again). Usage: mutate({ ids, hidden }).
// The flag flips in the cache at once (no refetch, so no image reloads); a failure puts it back.
export const useAdminSetHidden = () => {
  const t = useTranslations("admin.hide")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, hidden }: { ids: string[]; hidden: boolean }) => setPhotosHidden(ids, hidden),
    onMutate: async ({ ids, hidden }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.photos.all })
      const before = queryClient.getQueryData<Photo[]>(queryKeys.photos.all)
      const flip = new Set(ids)
      queryClient.setQueryData<Photo[]>(queryKeys.photos.all, (photos) =>
        photos?.map((photo) => (flip.has(photo.id) ? { ...photo, hidden } : photo)))
      return { before }
    },
    onSuccess: (_, { ids, hidden }) => showToast(t(hidden ? "hidden" : "shown", { count: ids.length }), "success"),
    onError: (error, _, context) => {
      logger.error("admin hide/show failed", error)
      if (context?.before) queryClient.setQueryData(queryKeys.photos.all, context.before)
      showToast(t("error"), "error")
    },
  })
}
