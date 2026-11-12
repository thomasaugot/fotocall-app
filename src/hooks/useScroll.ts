import { use } from "react"
import { ScrollContext } from "@/contexts/ScrollContext"

export const useScroll = () => {
  const ctx = use(ScrollContext)
  if (!ctx) throw new Error("useScroll must be used inside <ScrollProvider>")
  return ctx
}
