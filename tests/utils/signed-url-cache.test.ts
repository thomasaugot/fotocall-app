import { beforeEach, describe, expect, it } from "vitest"
import { SIGNED_URL_REUSE_MS } from "@/constants/gallery"
import { forgetSignedUrls, keepSignedUrls } from "@/utils/signed-url-cache"
import type { Photo } from "@/types/photo"

const photo = (id: string, token: string): Photo => ({
  id, ownerId: "guest-1", guestName: "Ana", url: `https://x.test/${id}.webp?token=${token}`,
  storagePath: `u/${id}.webp`, width: 3, height: 4, createdAt: "2026-05-09T12:00:00Z", hidden: false, thumbUrl: "t", thumbPath: null,
})

describe("keepSignedUrls", () => {
  beforeEach(() => forgetSignedUrls())

  it("keeps the first signed url across refetches", () => {
    keepSignedUrls([photo("a", "one")], 0)
    const [again] = keepSignedUrls([photo("a", "two")], 30_000)
    expect(again.url).toContain("token=one")
  })

  it("takes the new url once the kept one nears its expiry", () => {
    keepSignedUrls([photo("a", "one")], 0)
    const [late] = keepSignedUrls([photo("a", "two")], SIGNED_URL_REUSE_MS)
    expect(late.url).toContain("token=two")
    const [after] = keepSignedUrls([photo("a", "three")], SIGNED_URL_REUSE_MS + 30_000)
    expect(after.url).toContain("token=two")
  })

  it("returns the same object when nothing changed, and forgets deleted photos", () => {
    const first = photo("a", "one")
    expect(keepSignedUrls([first], 0)[0]).toBe(first)
    keepSignedUrls([], 10)
    const [back] = keepSignedUrls([photo("a", "two")], 20)
    expect(back.url).toContain("token=two")
  })
})
