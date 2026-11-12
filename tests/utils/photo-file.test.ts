import { describe, expect, it } from "vitest"
import { photoFileName, safeName, uniqueNames } from "@/utils/photo-file"

const p = (guestName: string, storagePath = "u/1.webp", createdAt = "2026-11-12T10:20:30.000Z") => ({ guestName, storagePath, createdAt })

describe("safeName", () => {
  it("strips accents and odd characters", () => expect(safeName("Tía Carmen/../!")).toBe("tia-carmen"))
  it("falls back when nothing is left", () => expect(safeName("///")).toBe("invitado"))
})

describe("photoFileName", () => {
  it("keeps the extension and numbers the file", () => expect(photoFileName(p("Ana", "u/1.jpeg"), 2)).toBe("ana-20261112102030-3.jpg"))
  it("defaults to webp", () => expect(photoFileName(p("Ana", "u/1"))).toBe("ana-20261112102030-1.webp"))
})

describe("uniqueNames", () => {
  it("never repeats a name, even for the same guest and second", () => {
    const names = uniqueNames([p("Ana"), p("Ana")])
    expect(new Set(names).size).toBe(2)
  })
})
