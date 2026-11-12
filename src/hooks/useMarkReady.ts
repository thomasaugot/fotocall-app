import { use } from "react"
import { AppReadyContext } from "@/contexts/AppReadyContext"

export const useMarkReady = () => {
  const ctx = use(AppReadyContext)
  if (!ctx) throw new Error("useMarkReady must be used inside <AppReadyProvider>")
  return ctx.markReady
}
