import { describe, expect, it } from "vitest"
import type { Photo } from "@/types/photo"
import { ownPhotos } from "@/utils/own-photos"

const photo = (id: string, ownerId: string) => ({ id, ownerId }) as Photo

describe("ownPhotos", () => {
  const album = [photo("a", "me"), photo("b", "other"), photo("c", "me")]
  it("keeps only this guest's photos, in album order", () => {
    expect(ownPhotos(album, "me").map((p) => p.id)).toEqual(["a", "c"])
  })
  it("is empty without a session or before the album loads", () => {
    expect(ownPhotos(album, null)).toEqual([])
    expect(ownPhotos(undefined, "me")).toEqual([])
  })
})
