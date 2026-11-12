import { useEffect, useEffectEvent } from "react"

// Left / right arrow keys while something is on show (the photo viewer).
export const useArrowKeys = (enabled: boolean, onLeft: () => void, onRight: () => void) => {
  const handle = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.metaKey || event.ctrlKey) return
    if (event.key === "ArrowLeft") onLeft()
    else if (event.key === "ArrowRight") onRight()
  })

  useEffect(() => {
    if (!enabled) return
    const onKey = (event: KeyboardEvent) => handle(event)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [enabled])
}
