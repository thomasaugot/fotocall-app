import { gsap } from "@/lib/gsap"

// A photo arrives on show: it slides in from the side it was called from (or settles in place
// when it was just opened), then its corner mounts close on it. Targets ship `invisible`.
export function initPhotoArrive(root: HTMLElement, reducedByUser: boolean, direction: number): () => void {
  const mm = gsap.matchMedia(root)
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", reducedBySystem: "(prefers-reduced-motion: reduce)" },
    (context) => {
      const photo = root.querySelector("[data-anim='photo-arrive']")
      if (!photo) return
      const mounts = photo.querySelectorAll("[data-anim='mount']")
      if (reducedByUser || context.conditions?.reducedBySystem) {
        gsap.set([photo, ...mounts], { autoAlpha: 1 })
        return
      }
      gsap.timeline()
        .fromTo(photo,
          { autoAlpha: 0, x: direction * 28, scale: direction === 0 ? 0.97 : 1 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" })
        .fromTo(mounts, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "-=0.25")
    },
  )
  return () => mm.revert()
}
