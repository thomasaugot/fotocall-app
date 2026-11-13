import { describe, expect, it } from "vitest"
import { countGuests, countHidden, filterPhotos, selectionHides } from "@/utils/admin-stats"

describe("countGuests", () => {
  it("counts distinct owners", () => expect(countGuests([{ ownerId: "a" }, { ownerId: "a" }, { ownerId: "b" }])).toBe(2))
  it("is 0 for no photos", () => expect(countGuests([])).toBe(0))
})

describe("hidden photos", () => {
  const photos = [{ id: "1", hidden: false }, { id: "2", hidden: true }, { id: "3", hidden: true }]
  it("counts them", () => expect(countHidden(photos)).toBe(2))
  it("filters to them, or shows all", () => {
    expect(filterPhotos(photos, "hidden").map((p) => p.id)).toEqual(["2", "3"])
    expect(filterPhotos(photos, "all")).toHaveLength(3)
  })
  it("a selection hides unless every photo in it is already hidden", () => {
    expect(selectionHides(photos)).toBe(true)
    expect(selectionHides(photos.slice(1))).toBe(false)
    expect(selectionHides([])).toBe(false)
  })
})

describe("morePhotosFrom", () => {
  const photos = [{ id: "1", ownerId: "a" }, { id: "2", ownerId: "b" }, { id: "3", ownerId: "a" }, { id: "4", ownerId: "a" }]
  it("lists the same guest's other photos, capped", async () => {
    const { morePhotosFrom } = await import("@/utils/admin-stats")
    expect(morePhotosFrom(photos, photos[0], 5).map((p) => p.id)).toEqual(["3", "4"])
    expect(morePhotosFrom(photos, photos[0], 1).map((p) => p.id)).toEqual(["3"])
    expect(morePhotosFrom(photos, photos[1], 5)).toEqual([])
  })
})
