import { describe, expect, it } from "vitest"
import { isReducedMotion } from "@/utils/reduced-motion"

const el = (motion?: string) => ({ dataset: motion ? { motion } : {} })
const media = (matches: boolean) => () => ({ matches })

describe("isReducedMotion", () => {
  it("follows the app preference written on <html> once the provider has run", () => {
    expect(isReducedMotion(el("reduced"), media(false))).toBe(true)
    expect(isReducedMotion(el("full"), media(true))).toBe(false)
  })

  it("falls back to the system setting before the provider has run", () => {
    expect(isReducedMotion(el(), media(true))).toBe(true)
    expect(isReducedMotion(el(), media(false))).toBe(false)
  })
})
