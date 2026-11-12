import { describe, expect, it } from "vitest"
import { localizedPath, routeKeyFromPath } from "@/i18n/paths"

describe("localizedPath", () => {
  it("builds unprefixed paths for the default locale", () => {
    expect(localizedPath("home", "es")).toBe("/")
    expect(localizedPath("gallery", "es")).toBe("/galeria")
  })
})

describe("routeKeyFromPath", () => {
  it("maps a path back to its route key, ignoring query, hash and trailing slash", () => {
    expect(routeKeyFromPath("/")).toBe("home")
    expect(routeKeyFromPath("/galeria")).toBe("gallery")
    expect(routeKeyFromPath("/galeria/?x=1#top")).toBe("gallery")
  })

  it("returns null for an unknown path", () => {
    expect(routeKeyFromPath("/nope")).toBeNull()
  })
})
