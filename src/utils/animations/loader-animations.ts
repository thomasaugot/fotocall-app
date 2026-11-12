import { gsap } from "@/lib/gsap"

const q = (root: HTMLElement, name: string) => root.querySelector<HTMLElement | SVGElement>(`[data-anim="${name}"]`)

const isReduced = (reducedByUser: boolean) =>
  reducedByUser || window.matchMedia("(prefers-reduced-motion: reduce)").matches

// The ring (Host and lens at once) draws itself, then the wordmark and the bar track appear.
export function initLoader(root: HTMLElement, reducedByUser: boolean): () => void {
  const ctx = gsap.context(() => {
    const mark = q(root, "loader-mark")
    const ring = mark?.querySelector("[data-ring]") ?? null
    const word = q(root, "loader-word")
    const track = q(root, "loader-track")
    const line = q(root, "loader-line")
    gsap.set(line, { scaleX: 0 })          // sync GSAP with the [transform:scaleX(0)] class

    if (isReduced(reducedByUser)) {
      gsap.set(ring, { strokeDashoffset: 0 })
      gsap.set([mark, word, track], { autoAlpha: 1 })
      return
    }
    gsap.timeline()
      .set(mark, { autoAlpha: 1 })
      .to(ring, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .fromTo(word, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, 0.45)
      .fromTo(track, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.6)
  }, root)
  return () => ctx.revert()
}

// Only ever left → right: power2.out, never an inOut ease (it reads as the bar going back).
export function tickProgress(root: HTMLElement, targetScale: number, duration: number): void {
  gsap.to(q(root, "loader-line"), { scaleX: targetScale, duration, ease: "power2.out" })
}

export function exitLoader(root: HTMLElement, reducedByUser: boolean, onComplete: () => void): void {
  const line = q(root, "loader-line")
  gsap.killTweensOf(line)                  // stop tickProgress before filling to 1
  if (isReduced(reducedByUser)) {
    gsap.set(line, { scaleX: 1 })
    gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete })
    return
  }
  gsap.timeline({ onComplete })
    .to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" })
    .to([q(root, "loader-mark"), q(root, "loader-word"), q(root, "loader-track")],
      { autoAlpha: 0, scale: 0.97, duration: 0.4, ease: "power2.in" }, "+=0.05")
    .to(root, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "-=0.15")
}
