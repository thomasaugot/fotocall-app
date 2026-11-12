import { useEffect, useEffectEvent, useRef, type DependencyList } from "react"
import { useLocation } from "react-router"
import { useAppReady } from "@/hooks/useAppReady"

type AnimationFn = (root: HTMLElement) => (() => void) | void

type AnimationTiers = {
  critical?: AnimationFn[]
  raf?: AnimationFn[]
  timeout?: AnimationFn[]
}

// Returns the ONE root ref of the component; every target inside is found by data-anim.
// Gated on appReady, re-run on every navigation (pathname) and whenever `deps` change.
export const useGSAPAnimations = <T extends HTMLElement = HTMLElement>(
  factory: () => AnimationTiers,
  deps: DependencyList = [],
) => {
  const rootRef = useRef<T>(null)
  const appReady = useAppReady()
  const { pathname } = useLocation()
  const getTiers = useEffectEvent(factory)
  const depsKey = deps.map(String).join("|")

  useEffect(() => {
    const root = rootRef.current
    if (!appReady || !root) return
    const tiers = getTiers()
    const cleanups: Array<() => void> = []
    const run = (fns?: AnimationFn[]) =>
      fns?.forEach((fn) => {
        const cleanup = fn(root)
        if (cleanup) cleanups.push(cleanup)
      })

    run(tiers.critical)
    const frame = requestAnimationFrame(() => run(tiers.raf))
    const timer = setTimeout(() => run(tiers.timeout), 0)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [appReady, pathname, depsKey])

  return rootRef
}
