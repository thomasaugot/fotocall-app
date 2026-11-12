import { QR_DARK_TOKEN, QR_LIGHT_TOKEN, QR_MIN_CONTRAST } from "@/constants/admin"
import type { QrColors } from "@/types/admin"
import { contrastRatio, rgbToHex, type Rgb } from "@/utils/color-contrast"

type TokenReader = { getPropertyValue: (name: string) => string }

// QR colours = the theme's text and surface tokens, read at runtime. Refuses a pair a phone
// could not scan (too little contrast) instead of printing a code that fails at the party.
export const readQrColors = (style: TokenReader, resolve: (css: string) => Rgb): QrColors => {
  const read = (token: string) => {
    const value = style.getPropertyValue(token).trim()
    if (!value) throw new Error(`Theme token ${token} is empty`)
    return resolve(value)
  }
  const dark = read(QR_DARK_TOKEN)
  const light = read(QR_LIGHT_TOKEN)
  if (contrastRatio(dark, light) < QR_MIN_CONTRAST) throw new Error("Theme colours are too close to scan")
  return { dark: rgbToHex(dark), light: rgbToHex(light) }
}
