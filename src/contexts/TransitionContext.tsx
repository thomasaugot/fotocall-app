import { createContext, useRef, useState, type ReactNode } from "react"
import { useNavigate } from "react-router"
import { exitPage, killAllAnimations } from "@/utils/animations/page-transitions"
import { preloadRoute } from "@/utils/preload-route"

type TransitionValue = {
  isTransitioning: boolean
  registerRef: (el: HTMLElement | null) => void
  navigateTo: (href: string) => Promise<void>
  resetTransition: () => void
}

export const TransitionContext = createContext<TransitionValue | null>(null)

const FALLBACK_MS = 600

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const busyRef = useRef(false)
  const pageRef = useRef<HTMLElement | null>(null)

  const registerRef = (el: HTMLElement | null) => { pageRef.current = el }

  const resetTransition = () => {
    busyRef.current = false
    setIsTransitioning(false)
  }

  const navigateTo = async (href: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setIsTransitioning(true)
    const page = pageRef.current
    await Promise.all([page ? exitPage(page) : Promise.resolve(), preloadRoute(href)])
    killAllAnimations(pageRef.current)
    navigate(href)
    window.setTimeout(resetTransition, FALLBACK_MS)
  }

  return (
    <TransitionContext value={{ isTransitioning, registerRef, navigateTo, resetTransition }}>
      {children}
    </TransitionContext>
  )
}
