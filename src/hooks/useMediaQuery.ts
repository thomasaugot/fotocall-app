import { useSyncExternalStore } from "react"

type Breakpoint = "desktop" | "tablet" | "mobile"

const QUERIES: [Breakpoint, string][] = [["desktop", "(min-width: 1280px)"], ["tablet", "(min-width: 768px)"]]

const subscribe = (onChange: () => void) => {
  const medias = QUERIES.map(([, q]) => window.matchMedia(q))
  medias.forEach((m) => m.addEventListener("change", onChange))
  return () => medias.forEach((m) => m.removeEventListener("change", onChange))
}

const get = (): Breakpoint => QUERIES.find(([, q]) => window.matchMedia(q).matches)?.[0] ?? "mobile"

export const useBreakpoint = () => useSyncExternalStore(subscribe, get)
