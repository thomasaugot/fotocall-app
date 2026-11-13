// The framed QR card, as print geometry (3:4, like a party table card). Pure numbers, so the
// drawing code stays simple and the proportions are tested. All values in canvas pixels.
export const QR_CARD = { width: 1800, height: 2400 } as const

export interface QrCardLayout {
  card: { x: number; y: number; w: number; h: number; radius: number }
  occasion: { y: number; size: number }
  title: { y: number; size: number }
  qr: { x: number; y: number; size: number }
  call: { y: number; size: number }
  lens: { cx: number; cy: number; r: number }
}

export const qrCardLayout = (width: number = QR_CARD.width, height: number = QR_CARD.height): QrCardLayout => {
  const margin = Math.round(width * 0.07)
  const card = { x: margin, y: margin, w: width - margin * 2, h: height - margin * 2, radius: Math.round(width * 0.04) }
  const qrSize = Math.round(card.w * 0.66)
  const top = card.y + Math.round(card.h * 0.1)
  return {
    card,
    occasion: { y: top, size: Math.round(width * 0.026) },
    title: { y: top + Math.round(width * 0.13), size: Math.round(width * 0.1) },
    qr: { x: Math.round((width - qrSize) / 2), y: top + Math.round(width * 0.2), size: qrSize },
    call: { y: top + Math.round(width * 0.2) + qrSize + Math.round(width * 0.11), size: Math.round(width * 0.05) },
    lens: { cx: Math.round(width / 2), cy: top + Math.round(width * 0.2) + qrSize + Math.round(width * 0.2), r: Math.round(width * 0.016) },
  }
}
