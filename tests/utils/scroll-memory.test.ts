import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/app.config", () => ({ appConfig: { isDev: false } }))

const { readScroll, saveScroll } = await import("@/utils/scroll-memory")

const memoryStorage = () => {
  const data: Record<string, string> = {}
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => { data[k] = v },
  }
}

const throwing = {
  getItem: () => { throw new Error("blocked") },
  setItem: () => { throw new Error("blocked") },
}

describe("scroll memory", () => {
  it("round-trips a position per history key", () => {
    const storage = memoryStorage()
    saveScroll(storage, "abc", 812)
    saveScroll(storage, "def", 0)
    expect(readScroll(storage, "abc")).toBe(812)
    expect(readScroll(storage, "def")).toBe(0)
  })

  it("returns null for an unknown key or a corrupt value", () => {
    const storage = memoryStorage()
    expect(readScroll(storage, "missing")).toBeNull()
    storage.setItem("scroll:bad", "NaN-ish")
    expect(readScroll(storage, "bad")).toBeNull()
  })

  it("survives blocked storage", () => {
    expect(() => saveScroll(throwing, "k", 10)).not.toThrow()
    expect(readScroll(throwing, "k")).toBeNull()
  })
})
