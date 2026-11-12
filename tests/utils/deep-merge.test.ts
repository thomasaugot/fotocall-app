import { describe, expect, it } from "vitest"
import { deepMerge } from "@/utils/deep-merge"

describe("deepMerge", () => {
  it("merges nested objects, the override winning per key", () => {
    const base = { nav: { home: "Inicio", gallery: "Galería" }, brand: "Mi fotocall" }
    const over = { nav: { home: "Home" } }
    expect(deepMerge(base, over)).toEqual({ nav: { home: "Home", gallery: "Galería" }, brand: "Mi fotocall" })
  })

  it("replaces arrays and scalars instead of merging them", () => {
    expect(deepMerge({ a: [1, 2], b: "x" }, { a: [3], b: "y" })).toEqual({ a: [3], b: "y" })
  })

  it("does not mutate its inputs", () => {
    const base = { nav: { home: "Inicio" } }
    deepMerge(base, { nav: { home: "Home" } })
    expect(base.nav.home).toBe("Inicio")
  })
})
