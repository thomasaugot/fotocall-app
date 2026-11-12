import { create } from "zustand"
import type { Toast, ToastType } from "@/types/toast"

type ToastState = {
  toasts: Toast[]
  push: (message: string, type: ToastType) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  // Dedupe here, not at the call site: StrictMode and re-runs push the same message twice.
  push: (message, type) =>
    set((state) => {
      if (state.toasts.some((t) => t.message === message && t.type === type)) return state
      return { toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }] }
    }),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export const showToast = (message: string, type: ToastType = "info") =>
  useToastStore.getState().push(message, type)
