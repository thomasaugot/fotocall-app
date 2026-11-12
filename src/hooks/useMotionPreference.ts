import { use } from "react"
import { MotionPreferenceContext } from "@/contexts/MotionPreferenceContext"

export const useMotionPreference = () => {
  const ctx = use(MotionPreferenceContext)
  if (!ctx) throw new Error("useMotionPreference must be used inside <MotionPreferenceProvider>")
  return ctx
}
