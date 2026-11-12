import { describe, expect, it } from "vitest"
import { qrPng, qrSvg } from "@/services/qr"

const colors = { dark: "#111111", light: "#fefefe" }

describe("qr", () => {
  it("makes an svg in the given colours", async () => {
    const svg = await qrSvg("https://fotocall.test/", colors)
    expect(svg).toContain("<svg")
    expect(svg.toLowerCase()).toContain("#111111")
    expect(svg.toLowerCase()).toContain("#fefefe")
  })
  it("makes a png blob", async () => {
    const blob = await qrPng("https://fotocall.test/", colors, 256)
    expect(blob.type).toBe("image/png")
    const bytes = new Uint8Array(await blob.arrayBuffer())
    expect([...bytes.slice(1, 4)]).toEqual([80, 78, 71])
  })
})
