import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { queryKeys } from "@/constants/query-keys"
import { deletePhotos } from "@/services/admin-photos"
import { showToast } from "@/stores/toast-store"
import { logger } from "@/utils/logger"

export const useAdminDeletePhotos = () => {
  const t = useTranslations("admin.delete")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePhotos,
    onSuccess: (_, photos) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
      showToast(t("success", { count: photos.length }), "success")
    },
    onError: (error) => {
      logger.error("admin delete failed", error)
      // A partial failure leaves some photos gone: the album must show what is left.
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
      showToast(t("error"), "error")
    },
  })
}
