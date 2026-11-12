import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { fetchPhotoBlob } from "@/services/photo-files"
import { showToast } from "@/stores/toast-store"
import type { Photo } from "@/types/photo"
import { downloadBlob } from "@/utils/download-blob"
import { logger } from "@/utils/logger"
import { photoFileName } from "@/utils/photo-file"

export const useDownloadPhoto = () => {
  const t = useTranslations("admin.download")
  return useMutation({
    mutationFn: async (photo: Photo) => downloadBlob(await fetchPhotoBlob(photo.url), photoFileName(photo)),
    onSuccess: () => showToast(t("oneSuccess"), "success"),
    onError: (error) => {
      logger.error("photo download failed", error)
      showToast(t("error"), "error")
    },
  })
}
