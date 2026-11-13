import { afterEach, describe, expect, it, vi } from "vitest"
import { unzipSync } from "fflate"
import { fetchPhotoBlob, fetchPhotoFiles, zipFiles } from "@/services/photo-files"

afterEach(() => vi.unstubAllGlobals())

const photo = (n: number) => ({
  id: String(n), ownerId: "o", guestName: "Ana", url: `https://x.test/${n}`, storagePath: `o/${n}.webp`, width: 1, height: 1, createdAt: "2026-11-12T10:00:00Z", hidden: false, thumbUrl: "t", thumbPath: null,
})

describe("fetchPhotoBlob", () => {
  it("throws on a failed download", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 403 })))
    await expect(fetchPhotoBlob("https://x.test/a")).rejects.toThrow(/403/)
  })
})

describe("fetchPhotoFiles + zipFiles", () => {
  it("keeps the photo order and zips every file", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, blob: async () => new Blob([url]) })))
    const files = await fetchPhotoFiles([1, 2, 3].map(photo))
    expect(files.map((f) => new TextDecoder().decode(f.data))).toEqual(["https://x.test/1", "https://x.test/2", "https://x.test/3"])
    const zip = await zipFiles(files)
    const entries = unzipSync(new Uint8Array(await zip.arrayBuffer()))
    expect(Object.keys(entries)).toEqual(files.map((f) => f.name))
  })
})
