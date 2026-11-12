import { useRef, type PointerEvent } from "react"
import { swipeMove } from "@/utils/photo-viewer"

// Touch drag left / right on an element. The element carries `touch-pan-y`, so the browser keeps
// vertical scrolling and hands us the sideways drags.
export const useSwipe = (onPrev: () => void, onNext: () => void) => {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    start.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const from = start.current
    start.current = null
    if (!from) return
    const move = swipeMove(event.clientX - from.x, event.clientY - from.y)
    if (move === "next") onNext()
    else if (move === "prev") onPrev()
  }
  const onPointerCancel = () => {
    start.current = null
  }

  return { onPointerDown, onPointerUp, onPointerCancel }
}
