import { beforeEach, describe, expect, it, vi } from "vitest"

let rowsResult: { data: unknown[] | null; error: unknown } = { data: [], error: null }
let removeResult: { error: unknown } = { error: null }
const calls: string[] = []
const query = {
  delete: vi.fn(() => query),
  update: vi.fn((values: unknown) => { calls.push(`update ${JSON.stringify(values)}`); return query }),
  in: vi.fn((_col: string, ids: string[]) => { calls.push(`in ${ids.join(",")}`); return query }),
  select: vi.fn(() => Promise.resolve(rowsResult)),
}
const bucket = { remove: vi.fn((paths: string[]) => { calls.push(`remove ${paths.join(",")}`); return Promise.resolve(removeResult) }) }
vi.mock("@/lib/supabase", () => ({ supabase: { from: vi.fn(() => query), storage: { from: vi.fn(() => bucket) } } }))

const { deletePhotos, setPhotosHidden } = await import("@/services/admin-photos")
const photos = [{ id: "1", storagePath: "u/1.webp", thumbPath: "u/thumb-1.webp" }, { id: "2", storagePath: "u/2.webp", thumbPath: null }]

beforeEach(() => {
  calls.length = 0
  rowsResult = { data: [{ id: "1" }, { id: "2" }], error: null }
  removeResult = { error: null }
})

describe("deletePhotos", () => {
  it("deletes rows first, then files", async () => {
    await deletePhotos(photos)
    expect(calls).toEqual(["in 1,2", "remove u/1.webp,u/thumb-1.webp,u/2.webp"])
  })
  it("does nothing for an empty list", async () => {
    await deletePhotos([])
    expect(calls).toEqual([])
  })
  it("throws, and keeps the files, when RLS hid some rows", async () => {
    rowsResult = { data: [{ id: "1" }], error: null }
    await expect(deletePhotos(photos)).rejects.toThrow()
    expect(calls.some((c) => c.startsWith("remove"))).toBe(false)
  })
  it("throws on a row error and on a file error", async () => {
    rowsResult = { data: null, error: new Error("rls") }
    await expect(deletePhotos(photos)).rejects.toThrow()
    rowsResult = { data: [{ id: "1" }, { id: "2" }], error: null }
    removeResult = { error: new Error("storage") }
    await expect(deletePhotos(photos)).rejects.toThrow()
  })
})

describe("setPhotosHidden", () => {
  it("updates only the hidden flag of the given photos", async () => {
    await setPhotosHidden(["1", "2"], true)
    expect(calls).toEqual(['update {"hidden":true}', "in 1,2"])
  })
  it("throws when the database refused some rows (not an admin)", async () => {
    rowsResult = { data: [{ id: "1" }], error: null }
    await expect(setPhotosHidden(["1", "2"], false)).rejects.toThrow(/Not every photo/)
  })
  it("does nothing for an empty list", async () => {
    await setPhotosHidden([], true)
    expect(calls).toEqual([])
  })
})
