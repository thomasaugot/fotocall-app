import { describe, expect, it } from "vitest"
import { downloadHref, downloadName, isOwnPhoto, locatePhoto, swipeMove } from "@/utils/photo-viewer"
import type { Photo } from "@/types/photo"

const photo = (id: string, extra: Partial<Photo> = {}): Photo => ({
  id, ownerId: "guest-1", guestName: "Tía Carmen", url: `https://x.test/storage/v1/object/sign/photos/u/${id}.webp?token=abc`,
  storagePath: `u/${id}.webp`, width: 1536, height: 2048, createdAt: "2026-05-09T12:00:00Z", hidden: false, thumbUrl: "t", thumbPath: null, ...extra,
})

const photos = [photo("c3"), photo("b2"), photo("a1")]

describe("locatePhoto", () => {
  it("finds the photo with its neighbours", () => {
    const place = locatePhoto(photos, "b2")
    expect(place?.photo.id).toBe("b2")
    expect(place?.prev?.id).toBe("c3")
    expect(place?.next?.id).toBe("a1")
  })

  it("has no neighbour past either end", () => {
    expect(locatePhoto(photos, "c3")?.prev).toBeNull()
    expect(locatePhoto(photos, "a1")?.next).toBeNull()
  })

  it("is null when nothing is open or the photo is gone", () => {
    expect(locatePhoto(photos, null)).toBeNull()
    expect(locatePhoto(photos, "deleted")).toBeNull()
  })
})

describe("isOwnPhoto", () => {
  it("is true only for the guest who took it", () => {
    expect(isOwnPhoto(photo("a1"), "guest-1")).toBe(true)
    expect(isOwnPhoto(photo("a1"), "guest-2")).toBe(false)
    expect(isOwnPhoto(photo("a1"), null)).toBe(false)
    expect(isOwnPhoto(photo("a1"), undefined)).toBe(false)
  })
})

describe("downloadName", () => {
  it("builds a plain file name from the guest and the photo", () => {
    expect(downloadName(photo("0f3a9c21-aaaa"))).toBe("mi-fotocall-tia-carmen-0f3a9c21.webp")
  })

  it("keeps the stored extension and survives a name with no letters", () => {
    expect(downloadName(photo("0f3a9c21", { guestName: "🎉", storagePath: "u/x.jpg" }))).toBe("mi-fotocall-foto-0f3a9c21.jpg")
  })
})

describe("downloadHref", () => {
  it("adds the download name and keeps the signature", () => {
    const url = new URL(downloadHref(photo("0f3a9c21")))
    expect(url.searchParams.get("token")).toBe("abc")
    expect(url.searchParams.get("download")).toBe("mi-fotocall-tia-carmen-0f3a9c21.webp")
  })

  it("returns the url untouched when it cannot be parsed", () => {
    expect(downloadHref(photo("a1", { url: "not a url" }))).toBe("not a url")
  })
})

describe("swipeMove", () => {
  it("goes to the next photo on a drag to the left, the previous on a drag to the right", () => {
    expect(swipeMove(-80, 5)).toBe("next")
    expect(swipeMove(80, -5)).toBe("prev")
  })

  it("ignores short drags and vertical scrolls", () => {
    expect(swipeMove(-20, 0)).toBeNull()
    expect(swipeMove(-60, 90)).toBeNull()
  })
})
