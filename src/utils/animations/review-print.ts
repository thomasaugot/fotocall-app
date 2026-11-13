import { gsap } from "@/lib/gsap"

// The photo under review lands like a print laid on the table: a small drop and a turn.
export function initReviewPrint(root: HTMLElement, reduced: boolean): () => void {
  const ctx = gsap.context(() => {
    const print = root.querySelector('[data-anim="review-print"]')
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(print, { autoAlpha: 1 })
      return
    }
    gsap.fromTo(print, { autoAlpha: 0, y: 40, rotation: -7, scale: 0.94 },
      { autoAlpha: 1, y: 0, rotation: -1.5, scale: 1, duration: 0.6, ease: "back.out(1.4)" })
  }, root)
  return () => ctx.revert()
}
