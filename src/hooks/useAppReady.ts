import { use } from "react"
import { AppReadyContext } from "@/contexts/AppReadyContext"

const useAppReadyContext = () => {
  const ctx = use(AppReadyContext)
  if (!ctx) throw new Error("useAppReady must be used inside <AppReadyProvider>")
  return ctx
}

export const useAppReady = () => useAppReadyContext().appReady
export const useLoaderGone = () => useAppReadyContext().loaderGone
export const useMarkLoaderGone = () => useAppReadyContext().markLoaderGone
