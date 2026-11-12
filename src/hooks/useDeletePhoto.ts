import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { queryKeys } from "@/constants/query-keys"
import { deletePhoto } from "@/services/photos"
import { showToast } from "@/stores/toast-store"
import { logger } from "@/utils/logger"

// RLS lets a guest delete only their own photos; the UI offers it only on those.
export const useDeletePhoto = () => {
  const t = useTranslations("gallery.delete")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
      showToast(t("success"), "success")
    },
    onError: (error) => {
      logger.error("photo delete failed", error)
      showToast(t("error"), "error")
    },
  })
}
