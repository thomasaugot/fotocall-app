import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { ZIP_FILE } from "@/constants/admin"
import { fetchPhotoFiles, zipFiles } from "@/services/photo-files"
import { showToast } from "@/stores/toast-store"
import type { Photo } from "@/types/photo"
import { downloadBlob } from "@/utils/download-blob"
import { logger } from "@/utils/logger"

export const useDownloadAllPhotos = () => {
  const t = useTranslations("admin.download")
  return useMutation({
    mutationFn: async (photos: Photo[]) => downloadBlob(await zipFiles(await fetchPhotoFiles(photos)), ZIP_FILE),
    onSuccess: (_, photos) => showToast(t("allSuccess", { count: photos.length }), "success"),
    onError: (error) => {
      logger.error("zip download failed", error)
      showToast(t("error"), "error")
    },
  })
}
