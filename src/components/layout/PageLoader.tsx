import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react"
import { BrandMark } from "@/components/ui/BrandMark"
import { Gloria } from "@/components/ui/Gloria"
import { useAppReady, useMarkLoaderGone } from "@/hooks/useAppReady"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { announce } from "@/utils/announce"
import { exitLoader, initLoader, tickProgress } from "@/utils/animations/loader-animations"
import { useTranslations } from "use-intl"

const MIN_DURATION = 1800

// The camera settles, its gold lens lights up, faint rays behind; a gold bar fills under the name.
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
      className="z-loader fixed inset-0 flex flex-col items-center justify-center gap-8 overflow-hidden bg-bg px-8 pb-[8svh]"
    >
      <div className="relative flex items-center justify-center">
        <div data-anim="loader-gloria" className="invisible absolute">
          <Gloria className="h-[34rem] w-[34rem]" />
        </div>
        <div data-anim="loader-mark" className="invisible relative">
          <BrandMark className="h-28 w-28" />
        </div>
      </div>
      <p data-anim="loader-word" className="invisible relative text-hero"><em>{t("brand")}</em></p>
      <div data-anim="loader-track" aria-hidden="true" className="invisible relative h-0.5 w-28 overflow-hidden rounded-full bg-border">
        <div data-anim="loader-line" className="absolute inset-0 origin-left rounded-full bg-gold [transform:scaleX(0)]" />
      </div>
    </div>
  )
}
