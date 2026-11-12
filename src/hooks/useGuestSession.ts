import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"
import { ensureGuestSession } from "@/services/auth"

// The guest's anonymous user id. Never changes during a visit, so it is never refetched.
export const useGuestSession = () =>
  useQuery({ queryKey: queryKeys.session, queryFn: ensureGuestSession, staleTime: Infinity, gcTime: Infinity })
