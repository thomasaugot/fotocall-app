import { gsap } from "@/lib/gsap"

// The frosted ground lives on its own layer: never tween background on the transformed <header>.
export function fadeNavBackground(header: HTMLElement, solid: boolean): void {
  const bg = header.querySelector("[data-anim='nav-bg']")
  if (!bg) return
  gsap.to(bg, { autoAlpha: solid ? 1 : 0, duration: 0.4, ease: "power2.out", overwrite: true })
}
