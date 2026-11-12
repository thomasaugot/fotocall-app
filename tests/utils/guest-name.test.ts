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

describe("guest name storage", () => {
  const memory = () => {
    const map = new Map<string, string>()
    return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) }
  }
  it("round-trips a normalised name", async () => {
    const { readGuestName, storeGuestName } = await import("@/utils/guest-name")
    const storage = memory()
    expect(readGuestName(storage)).toBe("")
    storeGuestName(storage, "  Tía   Carmen ")
    expect(readGuestName(storage)).toBe("Tía Carmen")
  })
  it("ignores a stored value the database would refuse, and blocked storage", async () => {
    const { readGuestName, storeGuestName } = await import("@/utils/guest-name")
    const storage = memory()
    storage.setItem("guest-name", "   ")
    expect(readGuestName(storage)).toBe("")
    const blocked = { getItem: () => { throw new Error("x") }, setItem: () => { throw new Error("x") } }
    expect(readGuestName(blocked)).toBe("")
    expect(() => storeGuestName(blocked, "Ana")).not.toThrow()
  })
})
