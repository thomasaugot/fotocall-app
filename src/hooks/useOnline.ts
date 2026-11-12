import { useSyncExternalStore } from "react"
import { onlineManager } from "@tanstack/react-query"

// TanStack's own online state: the same signal that pauses and resumes the queries.
export const useOnline = () =>
  useSyncExternalStore((onChange) => onlineManager.subscribe(onChange), () => onlineManager.isOnline())
