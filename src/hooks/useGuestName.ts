import { useState } from "react"
import { labelGuest } from "@/services/auth"
import { readGuestName, storeGuestName } from "@/utils/guest-name"
import { logger } from "@/utils/logger"

export const useGuestName = () => {
  const [name, setName] = useState(() => readGuestName(localStorage))
  const save = (next: string) => {
    storeGuestName(localStorage, next)
    const saved = readGuestName(localStorage) || next.trim()
    setName(saved)
    labelGuest(saved).catch((error: unknown) => logger.warn("guest name not written on the account", error))
  }
  return { name, save }
}
