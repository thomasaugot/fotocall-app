import { describe, expect, it } from "vitest"
import { isDeliberateWheel } from "@/utils/scroll-freeze"

describe("isDeliberateWheel", () => {
  it("treats a decaying trackpad glide as glide", () => {
    expect(isDeliberateWheel(12, Infinity)).toBe(false)
    expect(isDeliberateWheel(8, 12)).toBe(false)
    expect(isDeliberateWheel(-3, -8)).toBe(false)
  })

  it("treats a growing delta as a deliberate scroll", () => {
    expect(isDeliberateWheel(14, 8)).toBe(true)
    expect(isDeliberateWheel(-14, -8)).toBe(true)
  })

  it("treats a mouse notch (40px or more) as deliberate", () => {
    expect(isDeliberateWheel(40, Infinity)).toBe(true)
    expect(isDeliberateWheel(-100, Infinity)).toBe(true)
  })
})
