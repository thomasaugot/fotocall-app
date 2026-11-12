import { describe, expect, it } from "vitest"
import { countGuests } from "@/utils/admin-stats"

describe("countGuests", () => {
  it("counts distinct owners", () => expect(countGuests([{ ownerId: "a" }, { ownerId: "a" }, { ownerId: "b" }])).toBe(2))
  it("is 0 for no photos", () => expect(countGuests([])).toBe(0))
})
