import { beforeEach, describe, expect, it } from "vitest"
import { showToast, useToastStore } from "@/stores/toast-store"

beforeEach(() => useToastStore.setState({ toasts: [] }))

describe("toast store", () => {
  it("adds a toast with an id and defaults to info", () => {
    showToast("Foto subida")
    const [toast] = useToastStore.getState().toasts
    expect(toast.message).toBe("Foto subida")
    expect(toast.type).toBe("info")
    expect(toast.id).toBeTruthy()
  })

  it("drops an identical message + type pushed twice (StrictMode double effects)", () => {
    showToast("Foto subida", "success")
    showToast("Foto subida", "success")
    expect(useToastStore.getState().toasts).toHaveLength(1)
  })

  it("keeps the same message when the type differs", () => {
    showToast("Revisa la foto", "warning")
    showToast("Revisa la foto", "error")
    expect(useToastStore.getState().toasts).toHaveLength(2)
  })

  it("dismisses by id", () => {
    showToast("Uno", "info")
    showToast("Dos", "info")
    const [first] = useToastStore.getState().toasts
    useToastStore.getState().dismiss(first.id)
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(["Dos"])
  })
})
