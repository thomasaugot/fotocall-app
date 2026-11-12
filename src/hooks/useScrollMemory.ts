import { useEffect, useLayoutEffect, useRef } from "react"
import { saveScroll } from "@/utils/scroll-memory"

// Call BEFORE PageShell's pre-paint scrollToTop: the key must already be the new entry's,
// or the jump to the top of the new page is saved under the page being left.
export const useScrollMemory = (locationKey: string) => {
  const keyRef = useRef(locationKey)

  useLayoutEffect(() => {
    keyRef.current = locationKey
  }, [locationKey])

  useEffect(() => {
    const onScroll = () => saveScroll(sessionStorage, keyRef.current, window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
}
