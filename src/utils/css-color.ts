// no-unit-test: reads pixels from a canvas, which needs a real browser
import type { Rgb } from "@/utils/color-contrast"

// Any CSS colour (hex, rgb, oklch…) to rgb, by painting one pixel: the qrcode library only takes hex.
export const resolveCssColor = (value: string): Rgb => {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas is not available")
  ctx.fillStyle = "#000"
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return { r, g, b }
}
