import { describe, expect, it } from "vitest"
import { isExternalHref, isSamePage, normalizePath, stripLocale } from "@/utils/paths"

describe("normalizePath", () => {
  it("strips query, hash and trailing slashes", () => {
    expect(normalizePath("/galeria?x=1#top")).toBe("/galeria")
    expect(normalizePath("/galeria/")).toBe("/galeria")
    expect(normalizePath("/")).toBe("/")
    expect(normalizePath("?x=1")).toBe("/")
  })
})

describe("stripLocale", () => {
  it("removes a locale prefix, leaving unprefixed paths alone", () => {
    expect(stripLocale("/es/galeria")).toBe("/galeria")
    expect(stripLocale("/es")).toBe("/")
    expect(stripLocale("/galeria")).toBe("/galeria")
    expect(stripLocale("/estrellas")).toBe("/estrellas")
  })
})

describe("isExternalHref", () => {
  it("detects http, mailto, tel and protocol-relative links", () => {
    expect(isExternalHref("https://example.com")).toBe(true)
    expect(isExternalHref("http://example.com")).toBe(true)
    expect(isExternalHref("mailto:a@b.c")).toBe(true)
    expect(isExternalHref("tel:+34600000000")).toBe(true)
    expect(isExternalHref("//cdn.example.com")).toBe(true)
  })

  it("treats app paths as internal", () => {
    expect(isExternalHref("/galeria")).toBe(false)
    expect(isExternalHref("/")).toBe(false)
  })
})

describe("isSamePage", () => {
  it("compares paths without query, hash, trailing slash or locale prefix", () => {
    expect(isSamePage("/galeria#foto", "/galeria")).toBe(true)
    expect(isSamePage("/galeria/", "/galeria")).toBe(true)
    expect(isSamePage("/galeria", "/es/galeria")).toBe(true)
    expect(isSamePage("/", "/galeria")).toBe(false)
  })
})
