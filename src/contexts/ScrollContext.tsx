import { createContext, useEffect, useRef, type ReactNode } from "react"
import { SCROLL_FREEZE_FAILSAFE_MS, SCROLL_QUIET_MS } from "@/constants/scroll"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { Lenis } from "@/lib/lenis"
import { useBreakpoint } from "@/hooks/useMediaQuery"
import { isDeliberateWheel } from "@/utils/scroll-freeze"

type ScrollValue = {
  scrollToTop: () => void
  scrollToTopSmooth: () => void
  scrollToY: (y: number) => void
  freezeScroll: () => void
  lockScroll: () => () => void
}

export const ScrollContext = createContext<ScrollValue | null>(null)

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const breakpoint = useBreakpoint()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
  }, [])

  // Desktop only (≥ 1280px): touch devices keep native scrolling.
  useEffect(() => {
    if (breakpoint !== "desktop") return
    const lenis = new Lenis()
    lenisRef.current = lenis
    const tick = (time: number) => lenis.raf(time * 1000)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [breakpoint])

  // Lenis skips a scrollTo to where it believes it already is: always write the document too.
  const scrollToY = (y: number) => {
    lenisRef.current?.scrollTo(y, { immediate: true, force: true })
    window.scrollTo(0, y)
  }
  const scrollToTop = () => scrollToY(0)
  const scrollToTopSmooth = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Held only while a trackpad glide from the previous page is still decaying.
  const freezeScroll = () => {
    const lenis = lenisRef.current
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    let previousDelta = Infinity
    let released = false
    let quiet = window.setTimeout(() => release(), SCROLL_QUIET_MS)
    const failsafe = window.setTimeout(() => release(), SCROLL_FREEZE_FAILSAFE_MS)

    const onWheel = (event: WheelEvent) => {
      if (isDeliberateWheel(event.deltaY, previousDelta)) return release()
      previousDelta = event.deltaY
      window.clearTimeout(quiet)
      quiet = window.setTimeout(() => release(), SCROLL_QUIET_MS)
    }
    const onTouch = () => release()

    function release() {
      if (released) return
      released = true
      window.clearTimeout(quiet)
      window.clearTimeout(failsafe)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouch)
      html.style.overflow = previousOverflow
      lenis?.start()
    }

    lenis?.stop()
    html.style.overflow = "hidden"
    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouch, { passive: true })
  }

  // <dialog> does not lock the page behind it: stop Lenis and the document until unlocked.
  const lockScroll = () => {
    const lenis = lenisRef.current
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    lenis?.stop()
    html.style.overflow = "hidden"
    return () => {
      html.style.overflow = previousOverflow
      lenis?.start()
    }
  }

  return (
    <ScrollContext value={{ scrollToTop, scrollToTopSmooth, scrollToY, freezeScroll, lockScroll }}>
      {children}
    </ScrollContext>
  )
}
