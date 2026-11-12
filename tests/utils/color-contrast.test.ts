import { describe, expect, it } from "vitest"
import { contrastRatio, rgbToHex } from "@/utils/color-contrast"

describe("color-contrast", () => {
  it("black on white is 21", () => expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 0))
  it("is symmetric", () => {
    const a = { r: 43, g: 33, b: 24 }, b = { r: 255, g: 253, b: 248 }
    expect(contrastRatio(a, b)).toBe(contrastRatio(b, a))
  })
  it("same colour is 1", () => expect(contrastRatio({ r: 9, g: 9, b: 9 }, { r: 9, g: 9, b: 9 })).toBe(1))
  it("writes hex", () => expect(rgbToHex({ r: 43, g: 33, b: 24 })).toBe("#2b2118"))
})
