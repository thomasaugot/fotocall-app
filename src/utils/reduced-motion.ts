const QUERY = "(prefers-reduced-motion: reduce)"

type DatasetHolder = { dataset: Record<string, string | undefined> }
type MatchMedia = (query: string) => { matches: boolean }

// MotionPreferenceProvider mirrors the effective preference (system + app override) on
// <html data-motion>, so animation files outside React can read it.
export const isReducedMotion = (
  root: DatasetHolder = document.documentElement,
  matchMedia: MatchMedia = (q) => window.matchMedia(q),
): boolean => {
  const stored = root.dataset.motion
  if (stored === "reduced") return true
  if (stored === "full") return false
  return matchMedia(QUERY).matches
}
