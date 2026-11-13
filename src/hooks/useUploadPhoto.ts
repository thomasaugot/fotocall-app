import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "use-intl"
import { queryKeys } from "@/constants/query-keys"
import { INVALID_IMAGE } from "@/constants/upload-limits"
import { ensureGuestSession, labelGuest } from "@/services/auth"
import { uploadPhoto } from "@/services/photos"
import { showToast } from "@/stores/toast-store"
import { normalizeGuestName } from "@/utils/guest-name"
import { isAcceptedImage } from "@/utils/image-file"
import { preparePhoto } from "@/utils/image-resize"
import { logger } from "@/utils/logger"

export const useUploadPhoto = () => {
  const t = useTranslations("home.upload")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, guestName }: { file: File; guestName: string }) => {
      if (!isAcceptedImage(file)) throw new Error(INVALID_IMAGE)
      const ownerId = await queryClient.fetchQuery({
        queryKey: queryKeys.session, queryFn: ensureGuestSession, staleTime: Infinity,
      })
      const image = await preparePhoto(file)
      const name = normalizeGuestName(guestName)
      await uploadPhoto({ ...image, ownerId, guestName: name })
      labelGuest(name).catch((error: unknown) => logger.warn("guest name not written on the account", error))
    },
    // Success is celebrated on screen (HomeCelebration), so no toast on top of it.
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
    },
    onError: (error) => {
      logger.error("photo upload failed", error)
      showToast(error instanceof Error && error.message === INVALID_IMAGE ? t("invalid") : t("error"), "error")
    },
  })
}
