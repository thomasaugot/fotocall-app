import { gsap, ScrollTrigger } from "@/lib/gsap"
import { isReducedMotion } from "@/utils/reduced-motion"

// will-change lives only for the tween: left on, it breaks position:fixed descendants.
const CLEAR = "opacity,transform,willChange"

// Reduced motion: the content still crossfades (no movement), so the change stays legible.
export const exitPage = (el: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    const reduced = isReducedMotion()
    gsap.killTweensOf(el, "y")
    gsap.to(el, {
      opacity: 0, y: reduced ? 0 : 6, duration: reduced ? 0.12 : 0.18, ease: "power2.in",
      willChange: "opacity, transform",
      onComplete: () => resolve(),
      onInterrupt: () => resolve(),
    })
  })

export const enterPage = (el: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    const reduced = isReducedMotion()
    const done = () => {
      gsap.set(el, { clearProps: CLEAR })
      resolve()
    }
    if (reduced) gsap.set(el, { y: 0 })
    gsap.to(el, {
      opacity: 1, y: 0, duration: reduced ? 0.16 : 0.32, ease: "power3.out", willChange: "opacity, transform",
      onComplete: done,
      onInterrupt: done,
    })
  })

export const killAllAnimations = (el: HTMLElement | null): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  if (!el) return
  gsap.killTweensOf(el.querySelectorAll("*"))
}
