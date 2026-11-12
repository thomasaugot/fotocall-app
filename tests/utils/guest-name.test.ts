import { describe, expect, it } from "vitest"
import { isValidGuestName, normalizeGuestName } from "@/utils/guest-name"

describe("normalizeGuestName", () => {
  it("trims and collapses inner whitespace", () => {
    expect(normalizeGuestName("  Tía   Carmen ")).toBe("Tía Carmen")
  })

  it("caps the length at 60 characters", () => {
    expect(normalizeGuestName("a".repeat(80))).toHaveLength(60)
  })
})

describe("isValidGuestName", () => {
  it("accepts a real name", () => {
    expect(isValidGuestName("Abuela Lola")).toBe(true)
  })

  it("rejects empty or blank names and names over 60", () => {
    expect(isValidGuestName("")).toBe(false)
    expect(isValidGuestName("   ")).toBe(false)
    expect(isValidGuestName("a".repeat(61))).toBe(false)
  })
})
