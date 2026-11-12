import { gsap } from "@/lib/gsap"

// A small element falls a few pixels into place. Target ships `invisible` in its JSX.
export function initDropIn(root: HTMLElement, reducedByUser: boolean): () => void {
  const mm = gsap.matchMedia(root)
  mm.add({ reducedBySystem: "(prefers-reduced-motion: reduce)" }, (context) => {
    const { reducedBySystem } = context.conditions ?? {}
    const target = root.querySelector("[data-anim='drop-in']") ?? root
    if (reducedByUser || reducedBySystem) {
      gsap.set(target, { autoAlpha: 1 })
      return
    }
    gsap.fromTo(target, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" })
  })
  return () => mm.revert()
}
