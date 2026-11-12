import { describe, expect, it, vi } from "vitest"

const calls: string[] = []
vi.mock("@/services/auth", () => ({ ensureGuestSession: vi.fn(async () => { calls.push("session"); return "uid" }) }))
vi.mock("@/services/photos", () => ({ listPhotos: vi.fn(async () => { calls.push("list"); return [] }) }))

const { photosQuery, PHOTOS_REFRESH_MS } = await import("@/services/photo-queries")

describe("photosQuery", () => {
  it("uses the shared photos key, so uploads and deletes invalidate it", () => {
    expect(photosQuery().queryKey).toEqual(["photos"])
  })

  it("signs the guest in before reading (RLS: authenticated only)", async () => {
    const fn = photosQuery().queryFn as () => Promise<unknown>
    await expect(fn()).resolves.toEqual([])
    expect(calls).toEqual(["session", "list"])
  })

  it("refreshes live, well inside the signed-URL lifetime", async () => {
    const { SIGNED_URL_SECONDS } = await import("@/constants/upload-limits")
    expect(photosQuery().refetchInterval).toBe(PHOTOS_REFRESH_MS)
    expect(PHOTOS_REFRESH_MS).toBeLessThan(SIGNED_URL_SECONDS * 1000)
  })
})
