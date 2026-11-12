import { useEffect, useEffectEvent, useLayoutEffect, useRef, type ReactNode } from "react"
import { useLocation, useNavigationType } from "react-router"
import { PAGE_LOADED_EVENT } from "@/constants/events"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { usePageReady } from "@/hooks/usePageReady"
import { usePageTransition } from "@/hooks/usePageTransition"
import { useScroll } from "@/hooks/useScroll"
import { useScrollMemory } from "@/hooks/useScrollMemory"
import { enterPage } from "@/utils/animations/page-transitions"
import { announce } from "@/utils/announce"
import { readScroll } from "@/utils/scroll-memory"

export const PageShell = ({ children }: { children: ReactNode }) => {
  usePageReady()
  const { pathname, key } = useLocation()
  const navigationType = useNavigationType()
  const { registerRef, resetTransition } = usePageTransition()
  const { scrollToTop, scrollToY, freezeScroll } = useScroll()
  const mainRef = useRef<HTMLElement>(null)
  const shownPath = useRef(pathname)
  const entering = useRef(false)
  const pageToken = useRef(0)

  useScrollMemory(key)

  const register = useEffectEvent((el: HTMLElement | null) => registerRef(el))
  useLayoutEffect(() => {
    register(mainRef.current)
    return () => register(null)
  }, [])

  const prePaint = useEffectEvent((el: HTMLElement) => {
    ScrollTrigger.clearScrollMemory("manual")
    gsap.killTweensOf(el)
    gsap.set(el, { opacity: 0, y: 28 })
    freezeScroll()
    scrollToTop()
  })

  // A navigation is "the pathname changed", never "not the first run" (StrictMode runs twice).
  useLayoutEffect(() => {
    const el = mainRef.current
    if (!el || pathname === shownPath.current) return
    shownPath.current = pathname
    pageToken.current += 1
    entering.current = true
    prePaint(el)
  }, [pathname])

  const afterEnter = useEffectEvent((el: HTMLElement) => {
    resetTransition()
    ScrollTrigger.clearScrollMemory("manual")
    ScrollTrigger.refresh()
    const saved = navigationType === "POP" ? readScroll(sessionStorage, key) : null
    if (saved !== null) scrollToY(saved)
    else scrollToTop()
    el.focus({ preventScroll: true })
    announce(document.title)
  })

  useEffect(() => {
    const el = mainRef.current
    if (!el || !entering.current) return
    entering.current = false
    let cancelled = false
    enterPage(el).then(() => {
      if (!cancelled) afterEnter(el)
    })
    return () => { cancelled = true }
  }, [pathname])

  // PageLoading handed over: the real page just replaced it in this commit, before paint.
  const replayEntrance = useEffectEvent(() => {
    const el = mainRef.current
    if (!el) return
    gsap.killTweensOf(el)
    gsap.set(el, { opacity: 0, y: 28 })
    const token = pageToken.current
    enterPage(el).then(() => {
      // Left the page mid-replay: the next page owns scroll and ScrollTrigger now.
      if (token !== pageToken.current) return
      resetTransition()
      ScrollTrigger.clearScrollMemory("manual")
      ScrollTrigger.refresh()
    })
  })

  useEffect(() => {
    const onLoaded = () => replayEntrance()
    window.addEventListener(PAGE_LOADED_EVENT, onLoaded)
    return () => window.removeEventListener(PAGE_LOADED_EVENT, onLoaded)
  }, [])

  return (
    <main ref={mainRef} id="main-content" tabIndex={-1} className="min-h-svh pt-16 outline-none">
      {children}
    </main>
  )
}
