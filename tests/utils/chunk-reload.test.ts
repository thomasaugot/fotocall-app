import { describe, expect, it } from "vitest"
import { shouldReloadForChunk } from "@/utils/chunk-reload"

describe("shouldReloadForChunk", () => {
  it("reloads when it never reloaded before", () => {
    expect(shouldReloadForChunk(1_000_000, null)).toBe(true)
  })
  it("does not reload again within 10 s (no loop on a truly missing chunk)", () => {
    expect(shouldReloadForChunk(1_009_999, "1000000")).toBe(false)
  })
  it("reloads again once 10 s have passed (the next deploy)", () => {
    expect(shouldReloadForChunk(1_010_000, "1000000")).toBe(true)
  })
  it("reloads when the stored value is unreadable (never blocked for good)", () => {
    expect(shouldReloadForChunk(1_000_000, "garbage")).toBe(true)
  })
})
