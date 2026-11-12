import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"
import { getAdminSession } from "@/services/admin-auth"

// Who is on this device: an admin, or anyone else (guest, nobody). Changes only by signing in or out.
export const useAdminSession = () =>
  useQuery({ queryKey: queryKeys.adminSession, queryFn: getAdminSession, staleTime: Infinity, gcTime: Infinity })
