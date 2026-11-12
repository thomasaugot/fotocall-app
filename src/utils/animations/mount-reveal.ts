import { gsap } from "@/lib/gsap"

const PRINT = "[data-anim='mounted-photo']"
const MOUNT = "[data-anim='mount']"

// Prints are mounted on the page as they come into view: the print settles, then its corner
// mounts close on it. Prints added later (load more, a guest's new photo) are picked up too, and
// the ones already mounted are never replayed. Both targets ship `invisible`.
export function initMountReveal(root: HTMLElement, reducedByUser: boolean): () => void {
  const mm = gsap.matchMedia(root)
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", reducedBySystem: "(prefers-reduced-motion: reduce)" },
    (context) => {
      const reduced = reducedByUser || !!context.conditions?.reducedBySystem

      const mountPrints = (prints: Element[]) => {
        context.add(() => {
          prints.forEach((print, index) => {
            const mounts = print.querySelectorAll(MOUNT)
            if (reduced) {
              gsap.set([print, ...mounts], { autoAlpha: 1 })
              return
            }
            gsap.timeline({ delay: Math.min(index, 5) * 0.08 })
              .fromTo(print, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" })
              .fromTo(mounts, { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
          })
        })
      }

      const watched = new WeakSet<Element>()
      const inView = new IntersectionObserver((entries) => {
        const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
        arriving.forEach((print) => inView.unobserve(print))
        if (arriving.length > 0) mountPrints(arriving)
      }, { rootMargin: "0px 0px -6% 0px" })

      const watch = (print: Element) => {
        if (watched.has(print)) return
        watched.add(print)
        inView.observe(print)
      }
      root.querySelectorAll(PRINT).forEach(watch)

      const added = new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(PRINT)) watch(node)
          node.querySelectorAll(PRINT).forEach(watch)
        }))
      })
      added.observe(root, { childList: true, subtree: true })

      return () => {
        inView.disconnect()
        added.disconnect()
      }
    },
  )
  return () => mm.revert()
}
