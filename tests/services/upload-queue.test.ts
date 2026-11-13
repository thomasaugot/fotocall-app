import { beforeEach, describe, expect, it, vi } from "vitest"
import type { QueuedPhoto } from "@/types/upload-queue"

const db = new Map<string, QueuedPhoto>()
vi.mock("@/utils/upload-queue-db", () => ({
  readQueue: vi.fn(async () => [...db.values()]),
  saveQueued: vi.fn(async (item: QueuedPhoto) => { db.set(item.id, structuredClone(item)) }),
  dropQueued: vi.fn(async (id: string) => { db.delete(id) }),
}))
const upload = vi.fn()
vi.mock("@/services/photos", () => ({ uploadQueuedPhoto: (item: unknown) => upload(item) }))
vi.mock("@/services/auth", () => ({ ensureGuestSession: vi.fn(async () => "u1"), labelGuest: vi.fn(async () => undefined) }))

const { enqueuePhoto, processQueue, retryStuck, stillQueued } = await import("@/services/upload-queue")
const image = { blob: new Blob(["x"]), mime: "image/webp", width: 4, height: 3 }
const photo = { ...image, thumb: { ...image, width: 2 } }
const listener = () => ({ onChange: vi.fn(), onSending: vi.fn(), onUploaded: vi.fn() })

beforeEach(() => { db.clear(); upload.mockReset() })

describe("upload queue", () => {
  it("sends a queued photo and removes it from the phone", async () => {
    const id = await enqueuePhoto(photo, "Ana")
    upload.mockResolvedValue(undefined)
    const l = listener()
    await processQueue(l)
    expect(upload).toHaveBeenCalledTimes(1)
    expect(upload.mock.calls[0][0]).toMatchObject({ id, ownerId: "u1", guestName: "Ana" })
    expect(upload.mock.calls[0][0].path).toMatch(/^u1\//)
    expect(await stillQueued([id])).toEqual([])
    expect(l.onUploaded).toHaveBeenCalledWith(id)
  })

  it("keeps a photo after a network failure, with the SAME paths for the retry", async () => {
    const id = await enqueuePhoto(photo, "Ana")
    upload.mockRejectedValueOnce(new TypeError("Failed to fetch"))
    await processQueue(listener())
    const kept = db.get(id)
    expect(kept).toMatchObject({ attempts: 1, stuck: false })
    expect(kept?.nextAttemptAt).toBeGreaterThan(Date.now())

    db.set(id, { ...(kept as QueuedPhoto), nextAttemptAt: 0 })
    upload.mockResolvedValueOnce(undefined)
    await processQueue(listener())
    expect(upload.mock.calls[1][0].path).toBe(kept?.path)
    expect(upload.mock.calls[1][0].id).toBe(id)
    expect(db.has(id)).toBe(false)
  })

  it("marks a photo stuck when the server refuses it for good, and retries it on request", async () => {
    const id = await enqueuePhoto(photo, "Ana")
    upload.mockRejectedValueOnce({ code: "42501", message: "row-level security" })
    await processQueue(listener())
    expect(db.get(id)?.stuck).toBe(true)
    await retryStuck()
    expect(db.get(id)).toMatchObject({ stuck: false, nextAttemptAt: 0 })
  })

  it("does nothing while offline", async () => {
    await enqueuePhoto(photo, "Ana")
    vi.stubGlobal("navigator", { onLine: false })
    await processQueue(listener())
    expect(upload).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
