import { gsap } from "@/lib/gsap"

const COLOURS = ["var(--color-gold)", "var(--color-primary)", "var(--color-gold-light)", "var(--color-surface)"]

// A photo joins the album: the print drops onto the table and settles, a burst of gold and navy
// paper confetti flies out from behind it, the words rise. Reduced motion: everything just shows.
export function initCelebrate(root: HTMLElement, reduced: boolean): () => void {
  const ctx = gsap.context(() => {
    const print = root.querySelector('[data-anim="celebrate-print"]')
    const words = root.querySelectorAll('[data-anim="celebrate-words"]')
    const burst = root.querySelector<HTMLElement>('[data-anim="celebrate-burst"]')
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([print, words], { autoAlpha: 1 })
      return
    }
    const pieces: HTMLElement[] = []
    if (burst) {
      gsap.set(burst, { autoAlpha: 1 })
      for (let i = 0; i < 46; i++) {
        const piece = document.createElement("span")
        piece.className = "absolute top-1/2 left-1/2 block rounded-[2px]"
        piece.style.background = COLOURS[i % COLOURS.length]
        piece.style.width = `${6 + (i % 3) * 3}px`
        piece.style.height = `${10 + (i % 4) * 3}px`
        burst.append(piece)
        pieces.push(piece)
      }
    }
    gsap.timeline()
      .fromTo(print, { autoAlpha: 0, y: -140, rotation: -18, scale: 1.12 },
        { autoAlpha: 1, y: 0, rotation: -4, scale: 1, duration: 0.75, ease: "back.out(1.5)" })
      .add(() => {
        pieces.forEach((piece) => {
          const angle = Math.random() * Math.PI * 2
          const distance = 140 + Math.random() * 260
          gsap.fromTo(piece,
            { x: 0, y: 0, rotation: 0, autoAlpha: 1 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 80,
              rotation: Math.random() * 720 - 360,
              duration: 1.1 + Math.random() * 0.7,
              ease: "power3.out",
            })
          gsap.to(piece, { y: "+=220", autoAlpha: 0, duration: 1.4, delay: 0.9 + Math.random() * 0.5, ease: "power1.in" })
        })
      }, 0.45)
      .fromTo(words, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.55)
  }, root)
  return () => ctx.revert()
}
