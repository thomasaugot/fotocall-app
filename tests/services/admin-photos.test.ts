import { beforeEach, describe, expect, it, vi } from "vitest"

let rowsResult: { data: unknown[] | null; error: unknown } = { data: [], error: null }
let removeResult: { error: unknown } = { error: null }
const calls: string[] = []
const query = {
  delete: vi.fn(() => query),
  in: vi.fn((_col: string, ids: string[]) => { calls.push(`in ${ids.join(",")}`); return query }),
  select: vi.fn(() => Promise.resolve(rowsResult)),
}
const bucket = { remove: vi.fn((paths: string[]) => { calls.push(`remove ${paths.join(",")}`); return Promise.resolve(removeResult) }) }
vi.mock("@/lib/supabase", () => ({ supabase: { from: vi.fn(() => query), storage: { from: vi.fn(() => bucket) } } }))

const { deletePhotos } = await import("@/services/admin-photos")
const photos = [{ id: "1", storagePath: "u/1.webp" }, { id: "2", storagePath: "u/2.webp" }]

beforeEach(() => {
  calls.length = 0
  rowsResult = { data: [{ id: "1" }, { id: "2" }], error: null }
  removeResult = { error: null }
})

describe("deletePhotos", () => {
  it("deletes rows first, then files", async () => {
    await deletePhotos(photos)
    expect(calls).toEqual(["in 1,2", "remove u/1.webp,u/2.webp"])
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
