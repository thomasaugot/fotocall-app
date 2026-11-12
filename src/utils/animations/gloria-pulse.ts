import { gsap } from "@/lib/gsap"

// A photo joined the album: the rays behind the window swell once, like a bell of light.
export const pulseGloria = (root: HTMLElement, reduced: boolean): void => {
  const gloria = root.querySelector('[data-anim="stage-gloria"]')
  if (!gloria || reduced) return
  gsap.killTweensOf(gloria)
  gsap.fromTo(gloria, { scale: 1, autoAlpha: 0.2 },
    { scale: 1.15, autoAlpha: 0.5, duration: 0.45, ease: "power2.out", yoyo: true, repeat: 1 })
}
