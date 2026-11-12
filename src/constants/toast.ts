import type { ToastType } from "@/types/toast"

// An error must be read before it can be acted on; a success only confirms.
export const TOAST_DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 5000,
  warning: 7000,
  error: 9000,
}
