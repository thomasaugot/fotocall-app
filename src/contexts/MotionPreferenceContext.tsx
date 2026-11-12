import { createContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import type { MotionPreference } from "@/types/motion"
import { readMotionPreference, storeMotionPreference } from "@/utils/motion-preference"

type MotionPreferenceValue = {
  preference: MotionPreference
  setPreference: (value: MotionPreference) => void
}

export const MotionPreferenceContext = createContext<MotionPreferenceValue | null>(null)

const QUERY = "(prefers-reduced-motion: reduce)"

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export const MotionPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const systemReduced = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches)
  const [override, setOverride] = useState(() => readMotionPreference(localStorage))
  const preference: MotionPreference = override ?? (systemReduced ? "reduced" : "full")

  useEffect(() => {
    document.documentElement.dataset.motion = preference
  }, [preference])

  const setPreference = (value: MotionPreference) => {
    setOverride(value)
    storeMotionPreference(localStorage, value)
  }

  return (
    <MotionPreferenceContext value={{ preference, setPreference }}>
      {children}
    </MotionPreferenceContext>
  )
}
