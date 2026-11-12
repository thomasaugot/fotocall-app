import { use } from "react"
import { TransitionContext } from "@/contexts/TransitionContext"

// Named usePageTransition so it never shadows React's own useTransition.
export const usePageTransition = () => {
  const ctx = use(TransitionContext)
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>")
  return ctx
}
