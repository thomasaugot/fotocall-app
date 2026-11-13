import { gsap } from "@/lib/gsap"

// A refusal everyone reads: the photo shakes its head, then the message drops in.
export const shakeNo = (root: HTMLElement, reduced: boolean): void => {
  const target = root.querySelector('[data-anim="review-photo"]')
  const message = root.querySelector('[data-anim="review-error"]')
  if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(message, { autoAlpha: 1 })
    return
  }
  gsap.timeline()
    .fromTo(target, { x: 0 }, { keyframes: { x: [0, -18, 16, -12, 9, -5, 0] }, duration: 0.55, ease: "power2.out" })
    .fromTo(message, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 0.1)
}
