import { describe, expect, it } from "vitest"
import { findLocale, findRouteKey } from "@/utils/route-handles"

const matches = (...handles: unknown[]) => handles.map((handle) => ({ handle }))

describe("findLocale", () => {
  it("reads the locale from the matched locale branch", () => {
    expect(findLocale(matches(undefined, { locale: "es" }, { routeKey: "home" }))).toBe("es")
  })

  it("falls back to the default locale", () => {
    expect(findLocale(matches(undefined, { locale: "xx" }))).toBe("es")
    expect(findLocale([])).toBe("es")
  })
})

describe("findRouteKey", () => {
  it("reads the deepest route key", () => {
    expect(findRouteKey(matches({ locale: "es" }, { routeKey: "gallery" }))).toBe("gallery")
  })

  it("returns null when the matched page has none (404)", () => {
    expect(findRouteKey(matches({ locale: "es" }, undefined))).toBeNull()
    expect(findRouteKey(matches({ routeKey: "nope" }))).toBeNull()
  })
})
