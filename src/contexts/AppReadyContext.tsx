import { createContext, useEffect, useState, type ReactNode } from "react"

type AppReadyValue = {
  appReady: boolean
  loaderGone: boolean
  markReady: () => void
  markLoaderGone: () => void
}

export const AppReadyContext = createContext<AppReadyValue | null>(null)

export const AppReadyProvider = ({ children }: { children: ReactNode }) => {
  const [appReady, setAppReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)

  useEffect(() => {
    if (appReady) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previous }
  }, [appReady])

  const markReady = () => setAppReady(true)
  const markLoaderGone = () => setLoaderGone(true)

  return (
    <AppReadyContext value={{ appReady, loaderGone, markReady, markLoaderGone }}>
      {children}
    </AppReadyContext>
  )
}
