import { beforeEach, describe, expect, it, vi } from "vitest"

const calls: string[] = []
let tableResult: { data: unknown; error: unknown } = { data: [], error: null }
let insertResult: { error: unknown } = { error: null }
let uploadResult: { error: unknown } = { error: null }
let signedResult: { data: unknown; error: unknown } = { data: [], error: null }

const query = {
  select: vi.fn(() => query),
  order: vi.fn(() => Promise.resolve(tableResult)),
  insert: vi.fn((row: unknown) => { calls.push(`insert ${JSON.stringify(row)}`); return Promise.resolve(insertResult) }),
  delete: vi.fn(() => query),
  eq: vi.fn(() => query),
}
const bucket = {
  upload: vi.fn((path: string) => { calls.push(`upload ${path}`); return Promise.resolve(uploadResult) }),
  remove: vi.fn((paths: string[]) => { calls.push(`remove ${paths.join(",")}`); return Promise.resolve({ error: null }) }),
  createSignedUrls: vi.fn(() => Promise.resolve(signedResult)),
}
vi.mock("@/lib/supabase", () => ({
  supabase: { from: vi.fn(() => query), storage: { from: vi.fn(() => bucket) } },
}))

const { deletePhoto, listPhotos, uploadPhoto } = await import("@/services/photos")

beforeEach(() => {
  calls.length = 0
  vi.clearAllMocks()
  tableResult = { data: [], error: null }
  insertResult = { error: null }
  uploadResult = { error: null }
  signedResult = { data: [], error: null }
})

const row = (id: string) => ({
  id, owner_id: "o1", guest_name: "Tía Carmen", storage_path: `o1/${id}.webp`, thumb_path: id === "a" ? "o1/thumb-a.webp" : null,
  width: 800, height: 600, created_at: "2026-11-12T10:00:00Z", hidden: false,
})

describe("listPhotos", () => {
  it("returns newest first with a signed URL each, dropping rows whose URL failed", async () => {
    tableResult = { data: [row("a"), row("b")], error: null }
    signedResult = { data: [
      { path: "o1/a.webp", signedUrl: "https://signed/a" },
      { path: "o1/thumb-a.webp", signedUrl: "https://signed/thumb-a" },
      { path: "o1/b.webp", signedUrl: null, error: "x" },
    ], error: null }
    const photos = await listPhotos()
    expect(query.order).toHaveBeenCalledWith("created_at", { ascending: false })
    expect(photos).toEqual([{
      id: "a", ownerId: "o1", guestName: "Tía Carmen", url: "https://signed/a", thumbUrl: "https://signed/thumb-a",
      storagePath: "o1/a.webp", thumbPath: "o1/thumb-a.webp", width: 800, height: 600, createdAt: "2026-11-12T10:00:00Z", hidden: false,
    }])
  })

  it("skips signing when the album is empty", async () => {
    await expect(listPhotos()).resolves.toEqual([])
    expect(bucket.createSignedUrls).not.toHaveBeenCalled()
  })

  it("throws on a query error instead of returning a cached fallback", async () => {
    tableResult = { data: null, error: new Error("boom") }
    await expect(listPhotos()).rejects.toThrow("boom")
  })
})

describe("uploadPhoto", () => {
  const input = { ownerId: "o1", guestName: "Abuela Lola", blob: new Blob(["x"]), mime: "image/webp", width: 800, height: 600, thumb: { blob: new Blob(["t"]), mime: "image/webp", width: 400, height: 300 } }

  it("uploads the photo and its grid copy into the owner's folder, then records both", async () => {
    await uploadPhoto(input)
    expect(calls[0]).toMatch(/^upload o1\/[0-9a-f-]{36}\.webp$/)
    expect(calls[1]).toMatch(/^upload o1\/thumb-[0-9a-f-]{36}\.webp$/)
    expect(calls[2]).toContain('"guest_name":"Abuela Lola"')
    expect(calls[2]).toContain(calls[0].replace("upload ", ""))
    expect(calls[2]).toContain(calls[1].replace("upload ", ""))
  })

  it("removes both uploaded files when the row is refused, and throws", async () => {
    insertResult = { error: new Error("cap reached") }
    await expect(uploadPhoto(input)).rejects.toThrow("cap reached")
    expect(calls[3]).toBe(`remove ${calls[0].replace("upload ", "")},${calls[1].replace("upload ", "")}`)
  })

  it("never records a row when the upload fails", async () => {
    uploadResult = { error: new Error("too large") }
    await expect(uploadPhoto(input)).rejects.toThrow("too large")
    expect(query.insert).not.toHaveBeenCalled()
  })
})

describe("deletePhoto", () => {
  it("deletes the row, then the file", async () => {
    query.eq.mockImplementationOnce(() => Promise.resolve({ error: null }) as never)
    await deletePhoto({ id: "a", storagePath: "o1/a.webp", thumbPath: "o1/thumb-a.webp" })
    expect(query.eq).toHaveBeenCalledWith("id", "a")
    expect(calls).toEqual(["remove o1/a.webp,o1/thumb-a.webp"])
  })
})
