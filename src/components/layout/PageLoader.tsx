import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react"
import { useAppReady, useMarkLoaderGone } from "@/hooks/useAppReady"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { announce } from "@/utils/announce"
import { exitLoader, initLoader, tickProgress } from "@/utils/animations/loader-animations"
import { useTranslations } from "use-intl"

const MIN_DURATION = 1800

export function PageLoader() {
  const t = useTranslations()
  const appReady = useAppReady()
  const markLoaderGone = useMarkLoaderGone()
  const { preference } = useMotionPreference()
  const reduced = preference === "reduced"
  const [visible, setVisible] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const startTime = useRef(0)
  const readyFired = useRef(false)

  const start = useEffectEvent((root: HTMLElement) => {
    startTime.current = Date.now()
    const cleanup = initLoader(root, reduced)
    tickProgress(root, 0.85, MIN_DURATION / 1000 - 0.5)
    return cleanup
  })

  // Not useGSAPAnimations: that hook waits for appReady, and the loader is what plays before it.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return start(root)
  }, [])

  const finish = useEffectEvent(() => {
    setVisible(false)
    markLoaderGone()
    window.__loadingComplete = true
    announce(t("loader.ready"), "polite")
  })

  useEffect(() => {
    if (!appReady || readyFired.current) return
    readyFired.current = true
    const remaining = Math.max(0, MIN_DURATION - (Date.now() - startTime.current))
    const timer = window.setTimeout(() => {
      const root = rootRef.current
      if (!root) return
      exitLoader(root, reduced, finish)
    }, remaining)
    return () => window.clearTimeout(timer)
  }, [appReady, reduced])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label={t("loader.label")}
      className="z-loader fixed inset-0 flex items-center justify-center bg-bg px-6"
    >
      <div className="flex items-center gap-5">
        <svg data-anim="loader-mark" aria-hidden="true" viewBox="0 0 100 100" className="invisible h-20 w-20 shrink-0 -rotate-90 text-primary">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={1.5} />
          <circle
            data-ring
            cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth={1.5}
            pathLength={1} strokeDasharray={1} strokeDashoffset={1}
          />
        </svg>
        <div className="flex flex-col gap-3">
          <p data-anim="loader-word" className="invisible text-title text-text">{t("brand")}</p>
          <div data-anim="loader-track" aria-hidden="true" className="invisible relative h-px w-full overflow-hidden bg-border">
            <div data-anim="loader-line" className="absolute inset-0 origin-left bg-primary [transform:scaleX(0)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
