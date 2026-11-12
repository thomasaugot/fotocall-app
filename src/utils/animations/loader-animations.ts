import { gsap } from "@/lib/gsap"

const q = (root: HTMLElement, name: string) => root.querySelector<HTMLElement | SVGElement>(`[data-anim="${name}"]`)
const part = (root: HTMLElement, name: string) => root.querySelector<SVGElement>(`[data-part="${name}"]`)

const isReduced = (reducedByUser: boolean) =>
  reducedByUser || window.matchMedia("(prefers-reduced-motion: reduce)").matches

// The camera settles, its gold lens lights up; the name rises underneath.
export function initLoader(root: HTMLElement, reducedByUser: boolean): () => void {
  const ctx = gsap.context(() => {
    const mark = q(root, "loader-mark")
    const word = q(root, "loader-word")
    const gloria = q(root, "loader-gloria")
    const line = q(root, "loader-line")
    gsap.set(line, { scaleX: 0 })   // sync GSAP with the class before any tween

    if (isReduced(reducedByUser)) {
      gsap.set([mark, word, gloria, q(root, "loader-track")], { autoAlpha: 1 })
      return
    }
    gsap.timeline()
      .set(mark, { autoAlpha: 1 })
      .fromTo(part(root, "cup"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
      .fromTo(part(root, "host"), { autoAlpha: 0, scale: 0, svgOrigin: "50 56" }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.5)" }, 0.7)
      .fromTo(gloria, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 0.22, scale: 1, duration: 1.6, ease: "power3.out" }, 0.6)
      .fromTo(word, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.6)
      .fromTo(q(root, "loader-track"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.8)
  }, root)
  return () => ctx.revert()
}

// Only ever forward: power2.out, never an inOut ease (it reads as the bar going back).
export function tickProgress(root: HTMLElement, target: number, duration: number): void {
  gsap.to(q(root, "loader-line"), { scaleX: target, duration, ease: "power2.out" })
}

export function exitLoader(root: HTMLElement, reducedByUser: boolean, onComplete: () => void): void {
  const line = q(root, "loader-line")
  gsap.killTweensOf(line)   // stop tickProgress before filling to 1
  if (isReduced(reducedByUser)) {
    gsap.set(line, { scaleX: 1 })
    gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete })
    return
  }
  gsap.timeline({ onComplete })
    .to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" })
    .to(q(root, "loader-gloria"), { scale: 2.4, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, "+=0.1")
    .to([q(root, "loader-mark"), q(root, "loader-word"), q(root, "loader-track")],
      { autoAlpha: 0, y: -12, duration: 0.4, ease: "power2.in" }, "<")
    .to(root, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
}
