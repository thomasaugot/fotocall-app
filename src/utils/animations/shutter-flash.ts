import { gsap } from "@/lib/gsap"

// The click of a shutter, felt on screen: a short white flash over the viewfinder.
export const flashShutter = (root: HTMLElement, reduced: boolean): void => {
  const flash = root.querySelector('[data-anim="shutter-flash"]')
  if (!flash || reduced) return
  gsap.killTweensOf(flash)
  gsap.fromTo(flash, { autoAlpha: 0.85 }, { autoAlpha: 0, duration: 0.45, ease: "power2.out" })
}
