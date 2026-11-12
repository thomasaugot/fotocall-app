import { useState } from "react"
import { readGuestName, storeGuestName } from "@/utils/guest-name"

export const useGuestName = () => {
  const [name, setName] = useState(() => readGuestName(localStorage))
  const save = (next: string) => {
    storeGuestName(localStorage, next)
    setName(readGuestName(localStorage) || next.trim())
  }
  return { name, save }
}
