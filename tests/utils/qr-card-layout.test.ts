import { describe, expect, it } from "vitest"
import { QR_CARD, qrCardLayout } from "@/utils/qr-card-layout"

describe("qrCardLayout", () => {
  const l = qrCardLayout()
  it("centres a big QR inside the card", () => {
    expect(l.qr.x * 2 + l.qr.size).toBe(QR_CARD.width)
    expect(l.qr.size).toBeGreaterThan(QR_CARD.width * 0.5)
  })
  it("stacks occasion, title, QR, call and the gold dot top to bottom, all inside the card", () => {
    const ys = [l.occasion.y, l.title.y, l.qr.y, l.call.y, l.lens.cy]
    expect([...ys].sort((a, b) => a - b)).toEqual(ys)
    expect(l.lens.cy + l.lens.r).toBeLessThan(l.card.y + l.card.h)
  })
})
