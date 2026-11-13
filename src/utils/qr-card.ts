// no-unit-test: draws on a canvas and waits on document.fonts, browser-only (geometry is tested in qr-card-layout)
import type { QrCardLayout } from "@/utils/qr-card-layout"

export interface QrCardContent {
  occasion: string
  title: string
  call: string
  qr: HTMLImageElement
}

// The theme tokens read at runtime: no colour is written here.
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const display = (size: number) => `italic 600 ${size}px "Cormorant Variable", Georgia, serif`
const sans = (size: number, weight = 500) => `${weight} ${size}px "Figtree Variable", Arial, sans-serif`

// The olive branch of the home page (ui/OliveBranch): a curved stem and nine leaves, in a 100×100 box.
const LEAVES = [[16, 82, -62], [30, 86, 18], [28, 66, -70], [44, 72, 12], [42, 50, -76], [58, 58, 6], [58, 36, -82], [72, 44, -4], [78, 22, -58]] as const

const drawBranch = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, mirror: boolean) => {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(mirror ? -scale : scale, scale)
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(6, 96)
  ctx.bezierCurveTo(30, 78, 58, 54, 84, 12)
  ctx.stroke()
  for (const [lx, ly, angle] of LEAVES) {
    ctx.beginPath()
    ctx.ellipse(lx, ly, 8.5, 2.6, (angle * Math.PI) / 180, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

// Paper ground, a white card with a soft shadow, the occasion, the name, the QR, the call to
// action, the address, and the gold lens of the logo at the foot.
export const drawQrCard = async (layout: QrCardLayout, size: { width: number; height: number }, content: QrCardContent): Promise<Blob> => {
  await Promise.all([document.fonts.load(display(64)), document.fonts.load(sans(32)), document.fonts.load(sans(32, 600))])
  const canvas = document.createElement("canvas")
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")
  const { card } = layout

  ctx.fillStyle = token("--color-bg")
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.save()
  ctx.shadowColor = "rgba(20, 28, 46, 0.14)"
  ctx.shadowBlur = size.width * 0.04
  ctx.shadowOffsetY = size.width * 0.012
  ctx.fillStyle = token("--color-surface")
  roundRect(ctx, card.x, card.y, card.w, card.h, card.radius)
  ctx.fill()
  ctx.restore()

  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  const cx = size.width / 2
  ctx.fillStyle = token("--color-text-subtle")
  ctx.font = sans(layout.occasion.size, 600)
  ctx.letterSpacing = `${Math.round(layout.occasion.size * 0.18)}px`
  ctx.fillText(content.occasion.toUpperCase(), cx, layout.occasion.y)
  ctx.letterSpacing = "0px"

  ctx.fillStyle = token("--color-text")
  ctx.font = display(layout.title.size)
  ctx.fillText(content.title, cx, layout.title.y)

  ctx.drawImage(content.qr, layout.qr.x, layout.qr.y, layout.qr.size, layout.qr.size)

  ctx.font = display(layout.call.size)
  ctx.fillText(content.call, cx, layout.call.y)

  ctx.fillStyle = token("--color-gold")
  ctx.strokeStyle = token("--color-gold")
  const branch = layout.lens.r * 5.5
  drawBranch(ctx, layout.lens.cx - layout.lens.r * 2.2 - branch, layout.lens.cy - branch * 0.5, branch / 100, false)
  drawBranch(ctx, layout.lens.cx + layout.lens.r * 2.2 + branch, layout.lens.cy - branch * 0.5, branch / 100, true)
  ctx.beginPath()
  ctx.arc(layout.lens.cx, layout.lens.cy, layout.lens.r, 0, Math.PI * 2)
  ctx.fill()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
  if (!blob) throw new Error("QR card could not be encoded")
  return blob
}
