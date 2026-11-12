import { describe, expect, it, vi } from "vitest"

const error = vi.fn()
vi.mock("@/utils/logger", () => ({ logger: { error } }))

const { createMessageFallback, handleIntlError } = await import("@/utils/intl-handlers")

describe("createMessageFallback", () => {
  it("shows the key path in development", () => {
    expect(createMessageFallback(true)({ namespace: "home", key: "title" })).toBe("home.title")
    expect(createMessageFallback(true)({ key: "brand" })).toBe("brand")
  })

  it("shows nothing to visitors in production", () => {
    expect(createMessageFallback(false)({ namespace: "home", key: "title" })).toBe("")
  })
})

describe("handleIntlError", () => {
  it("logs through the logger, never throws", () => {
    const failure = new Error("MISSING_MESSAGE")
    expect(() => handleIntlError(failure)).not.toThrow()
    expect(error).toHaveBeenCalledWith("i18n", failure)
  })
})
