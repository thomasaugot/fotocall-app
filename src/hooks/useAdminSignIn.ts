import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"
import { signInAdmin } from "@/services/admin-auth"
import { logger } from "@/utils/logger"

// One generic failure for the screen: it never says whether the password, the account or the role was wrong.
export const useAdminSignIn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: signInAdmin,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.adminSession, session)
      // The album was read as a guest (or not at all): read it again as the admin.
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all })
    },
    onError: (error) => logger.warn("admin sign-in failed", error),
  })
}
