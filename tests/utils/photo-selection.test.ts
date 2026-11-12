import { describe, expect, it } from "vitest"
import { pruneSelection, selectionState, toggleId } from "@/utils/photo-selection"

describe("photo-selection", () => {
  it("toggles without mutating", () => {
    const base = new Set(["a"])
    expect([...toggleId(base, "b")]).toEqual(["a", "b"])
    expect([...toggleId(base, "a")]).toEqual([])
    expect([...base]).toEqual(["a"])
  })
  it("drops ids that no longer exist", () => expect([...pruneSelection(new Set(["a", "z"]), ["a", "b"])]).toEqual(["a"]))
  it("states", () => {
    expect(selectionState(0, 3)).toBe("none")
    expect(selectionState(2, 3)).toBe("some")
    expect(selectionState(3, 3)).toBe("all")
    expect(selectionState(0, 0)).toBe("none")
  })
})
