import { useMutation } from "@tanstack/react-query"
import { sendAdminLink } from "@/services/admin-auth"
import { logger } from "@/utils/logger"

// The link brings the admin back to this same page, signed in.
export const useAdminLink = () =>
  useMutation({
    mutationFn: (email: string) => sendAdminLink(email, `${window.location.origin}${window.location.pathname}`),
    onError: (error) => logger.warn("admin link not sent", error),
  })
