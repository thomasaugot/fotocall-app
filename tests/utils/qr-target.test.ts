import { describe, expect, it } from "vitest"
import { normalizeQrTarget } from "@/utils/qr-target"

describe("normalizeQrTarget", () => {
  it("accepts and normalises http(s)", () => expect(normalizeQrTarget(" https://fotocall.test ")).toBe("https://fotocall.test/"))
  it("refuses other schemes", () => expect(normalizeQrTarget("javascript:alert(1)")).toBeNull())
  it("refuses text and empty", () => {
    expect(normalizeQrTarget("fotocall")).toBeNull()
    expect(normalizeQrTarget("  ")).toBeNull()
  })
})
