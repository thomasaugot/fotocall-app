import { describe, expect, it } from "vitest"
import { fitWithin, isAcceptedImage, storagePathFor, photoFiles } from "@/utils/image-file"

const file = (type: string, size: number) => ({ type, size })

describe("isAcceptedImage", () => {
  it("accepts camera photos of any image type within 40 MB", () => {
    expect(isAcceptedImage(file("image/jpeg", 4_000_000))).toBe(true)
    expect(isAcceptedImage(file("image/heic", 3_000_000))).toBe(true)
  })

  it("rejects non-images, empty files and anything over 40 MB", () => {
    expect(isAcceptedImage(file("application/pdf", 1000))).toBe(false)
    expect(isAcceptedImage(file("image/jpeg", 0))).toBe(false)
    expect(isAcceptedImage(file("image/jpeg", 40 * 1024 * 1024 + 1))).toBe(false)
  })
})

describe("fitWithin", () => {
  it("scales the long side down to the limit, keeping the ratio", () => {
    expect(fitWithin(4032, 3024, 2048)).toEqual({ width: 2048, height: 1536 })
    expect(fitWithin(3024, 4032, 2048)).toEqual({ width: 1536, height: 2048 })
  })

  it("never scales up", () => {
    expect(fitWithin(800, 600, 2048)).toEqual({ width: 800, height: 600 })
  })
})

describe("storagePathFor", () => {
  it("builds {owner}/{generated id}.{ext} and never uses the uploaded name", () => {
    const path = storagePathFor("owner-1", "image/webp")
    expect(path).toMatch(/^owner-1\/[0-9a-f-]{36}\.webp$/)
    expect(storagePathFor("owner-1", "image/jpeg")).toMatch(/\.jpg$/)
  })

  it("refuses a type the bucket does not accept", () => {
    expect(() => storagePathFor("owner-1", "image/png")).toThrow()
  })
})

describe("thumbnails", () => {
  it("prefixes the grid copy inside the owner's folder", () => {
    expect(storagePathFor("u1", "image/webp", "thumb-")).toMatch(/^u1\/thumb-[0-9a-f-]+\.webp$/)
  })
  it("lists both files of a photo, or just the full one for older photos", () => {
    expect(photoFiles({ storagePath: "u/a.webp", thumbPath: "u/thumb-a.webp" })).toEqual(["u/a.webp", "u/thumb-a.webp"])
    expect(photoFiles({ storagePath: "u/a.webp", thumbPath: null })).toEqual(["u/a.webp"])
  })
})
