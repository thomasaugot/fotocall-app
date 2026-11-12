import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/app.config", () => ({ appConfig: { isDev: false } }))

const { readMotionPreference, storeMotionPreference } = await import("@/utils/motion-preference")

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = { ...initial }
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => { data[k] = v },
    data,
  }
}

const throwing = {
  getItem: () => { throw new Error("blocked") },
  setItem: () => { throw new Error("blocked") },
}

describe("readMotionPreference", () => {
  it("returns a stored valid value", () => {
    expect(readMotionPreference(memoryStorage({ "motion-preference": "reduced" }))).toBe("reduced")
    expect(readMotionPreference(memoryStorage({ "motion-preference": "full" }))).toBe("full")
  })

  it("returns null for nothing stored or an unknown value", () => {
    expect(readMotionPreference(memoryStorage())).toBeNull()
    expect(readMotionPreference(memoryStorage({ "motion-preference": "fast" }))).toBeNull()
  })

  it("returns null when storage throws", () => {
    expect(readMotionPreference(throwing)).toBeNull()
  })
})

describe("storeMotionPreference", () => {
  it("writes the value under the motion key", () => {
    const storage = memoryStorage()
    storeMotionPreference(storage, "reduced")
    expect(storage.data["motion-preference"]).toBe("reduced")
  })

  it("does not throw when storage is blocked", () => {
    expect(() => storeMotionPreference(throwing, "full")).not.toThrow()
  })
})
