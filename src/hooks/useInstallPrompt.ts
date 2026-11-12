import { useEffect, useState, useSyncExternalStore } from "react"
import type { BeforeInstallPromptEvent } from "@/types/install-prompt"
import { pickInstallOffer, readInstallDismissed, storeInstallDismissed } from "@/utils/install-prompt"
import { logger } from "@/utils/logger"

const STANDALONE = "(display-mode: standalone)"
const subscribeStandalone = (onChange: () => void) => {
  const media = window.matchMedia(STANDALONE)
  media.addEventListener("change", onChange)
  window.addEventListener("appinstalled", onChange)
  return () => {
    media.removeEventListener("change", onChange)
    window.removeEventListener("appinstalled", onChange)
  }
}
const readStandalone = () => window.matchMedia(STANDALONE).matches

export const useInstallPrompt = () => {
  const standalone = useSyncExternalStore(subscribeStandalone, readStandalone)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => readInstallDismissed(localStorage))

  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const installed = () => setDeferred(null)
    window.addEventListener("beforeinstallprompt", capture)
    window.addEventListener("appinstalled", installed)
    return () => {
      window.removeEventListener("beforeinstallprompt", capture)
      window.removeEventListener("appinstalled", installed)
    }
  }, [])

  const offer = pickInstallOffer({
    standalone, dismissed, hasPrompt: deferred !== null, userAgent: navigator.userAgent,
  })

  const install = async () => {
    if (!deferred) return
    try {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome === "dismissed") {
        storeInstallDismissed(localStorage)
        setDismissed(true)
      }
    } catch (error) {
      logger.warn("install prompt failed", error)
    } finally {
      setDeferred(null)
    }
  }

  const dismiss = () => {
    storeInstallDismissed(localStorage)
    setDismissed(true)
  }

  return { offer, install, dismiss }
}
