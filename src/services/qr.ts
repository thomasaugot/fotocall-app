import { QR_MARGIN_MODULES, QR_PNG_SIZE } from "@/constants/admin"
import type { QrColors } from "@/types/admin"
import { dataUrlToBlob } from "@/utils/data-url"

// qrcode is imported on demand: it lives in the lazy admin chunk only.
const options = (colors: QrColors) => ({
  errorCorrectionLevel: "M" as const,
  margin: QR_MARGIN_MODULES,
  color: { dark: colors.dark, light: colors.light },
})

export const qrSvg = async (text: string, colors: QrColors): Promise<string> => {
  const QRCode = await import("qrcode")
  return QRCode.toString(text, { ...options(colors), type: "svg" })
}

export const qrPng = async (text: string, colors: QrColors, size = QR_PNG_SIZE): Promise<Blob> => {
  const QRCode = await import("qrcode")
  return dataUrlToBlob(await QRCode.toDataURL(text, { ...options(colors), width: size }))
}
