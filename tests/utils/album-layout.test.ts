import { describe, expect, it } from "vitest"
import { albumCounts, composeAlbum, orientationOf } from "@/utils/album-layout"
import type { Photo } from "@/types/photo"

// n photos, newest first: id "p<n>" is the newest, "p1" the oldest.
const album = (n: number, owner = (i: number) => `guest-${i % 3}`): Photo[] =>
  Array.from({ length: n }, (_, k) => {
    const i = n - k
    return {
      id: `p${i}`, ownerId: owner(i), guestName: `Invitado ${i}`, url: `https://x.test/${i}.webp`,
      storagePath: `u/${i}.webp`, width: 1536, height: 2048, createdAt: new Date(2026, 4, 9, 12, i).toISOString(), hidden: false, thumbUrl: "t", thumbPath: null,
    }
  })

const ids = (leaf: { rows: { photos: { id: string }[] }[] }) => leaf.rows.map((row) => row.photos.map((p) => p.id))

describe("orientationOf", () => {
  it("sorts ratios into portrait, square-ish and landscape", () => {
    expect(orientationOf(1536, 2048)).toBe("portrait")
    expect(orientationOf(2048, 1536)).toBe("landscape")
    expect(orientationOf(1000, 1000)).toBe("square")
    expect(orientationOf(1100, 1000)).toBe("square")
  })

  it("falls back to portrait when a size is missing", () => {
    expect(orientationOf(0, 0)).toBe("portrait")
  })
})

describe("composeAlbum", () => {
  it("returns no leaf for an empty album", () => {
    expect(composeAlbum([])).toEqual([])
  })

  it("cuts leaves from the oldest photo and shows the newest leaf and print first", () => {
    const leaves = composeAlbum(album(10))
    // oldest leaf [1,2] = p1..p3, then [2,2] = p4..p7, then [2,1] = p8..p10
    expect(leaves.map(ids)).toEqual([
      [["p10", "p9"], ["p8"]],
      [["p7", "p6"], ["p5", "p4"]],
      [["p3"], ["p2", "p1"]],
    ])
    expect(leaves[0].rows.map((row) => row.kind)).toEqual(["duo", "solo"])
  })

  it("keeps every older leaf identical when a new photo arrives", () => {
    const before = composeAlbum(album(8))
    const after = composeAlbum(album(9))
    expect(after.slice(1).map(ids)).toEqual(before.slice(1).map(ids))
    expect(after.slice(1).map((leaf) => leaf.id)).toEqual(before.slice(1).map((leaf) => leaf.id))
    expect(after[0].id).toBe(before[0].id)
  })

  it("turns a half-filled pair into a single print", () => {
    const [leaf] = composeAlbum(album(4))
    expect(ids(leaf)).toEqual([["p4"]])
    expect(leaf.rows[0].kind).toBe("solo")
  })

  it("marks only the newest photos as priority and tags each orientation", () => {
    const photos = album(5)
    photos[1] = { ...photos[1], width: 2048, height: 1536 }
    const prints = composeAlbum(photos).flatMap((leaf) => leaf.rows.flatMap((row) => row.photos))
    expect(prints.filter((p) => p.priority).map((p) => p.id)).toEqual(["p5", "p4"])
    expect(prints.find((p) => p.id === "p4")?.orientation).toBe("landscape")
  })

  it("alternates the side prints lean to", () => {
    const leaves = composeAlbum(album(10))
    expect(leaves.at(-1)?.rows.map((row) => row.flip)).toEqual([false, true])
    expect(leaves.at(-2)?.rows.map((row) => row.flip)).toEqual([true, false])
  })
})

describe("albumCounts", () => {
  it("counts photos and the distinct guests behind them", () => {
    expect(albumCounts(album(7))).toEqual({ photos: 7, guests: 3 })
    expect(albumCounts([])).toEqual({ photos: 0, guests: 0 })
  })
})
