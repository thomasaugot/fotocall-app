export type ToastType = "success" | "error" | "warning" | "info"

export type Toast = {
  id: string
  message: string
  type: ToastType
}
