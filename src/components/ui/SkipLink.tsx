import type { MouseEvent } from "react"
import { useTranslations } from "use-intl"

// First focusable element. Moved off-screen with a transform (not sr-only): .sr-only is unlayered
// CSS and a layered `focus:not-sr-only` utility could never override it.
export function SkipLink({ targetId }: { targetId: string }) {
  const t = useTranslations()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId)
    if (!target) return
    event.preventDefault()
    target.focus({ preventScroll: true })
    target.scrollIntoView({ block: "start" })
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="keyboard-focus-ring text-button z-skip fixed top-3 left-4 -translate-y-[200%] rounded-full bg-text px-5 py-3 text-surface transition-transform duration-150 focus:translate-y-0"
    >
      {t("skipToContent")}
    </a>
  )
}
