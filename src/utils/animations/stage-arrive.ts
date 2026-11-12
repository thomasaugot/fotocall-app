import { gsap } from "@/lib/gsap"

// The home entrance: the rays open behind the window, the window rises, the branches grow in.
export function initStageArrive(root: HTMLElement, reducedByUser: boolean): () => void {
  const mm = gsap.matchMedia(root)
  mm.add({ reducedBySystem: "(prefers-reduced-motion: reduce)", any: "all" }, (context) => {
    const { reducedBySystem } = context.conditions ?? {}
    const arch = root.querySelector('[data-anim="stage-arch"]')
    const gloria = root.querySelector('[data-anim="stage-gloria"]')
    const branches = root.querySelectorAll('[data-anim="stage-branch"]')
    const below = root.querySelectorAll('[data-anim="stage-below"]')
    if (reducedByUser || reducedBySystem) {
      gsap.set([arch, branches, below], { autoAlpha: 1 })
      gsap.set(gloria, { autoAlpha: 0.2 })
      return
    }
    gsap.timeline()
      .fromTo(gloria, { autoAlpha: 0, scale: 0.5, rotation: -30 }, { autoAlpha: 0.2, scale: 1, rotation: 0, duration: 1.4, ease: "power3.out" }, 0)
      .fromTo(arch, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" }, 0.1)
      .fromTo(branches, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 100%" },
        { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)", stagger: 0.1 }, 0.5)
      .fromTo(below, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 }, 0.6)
  })
  return () => mm.revert()
}
