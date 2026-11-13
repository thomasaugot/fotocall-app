import { ensureGuestSession, labelGuest } from "@/services/auth"
import { uploadQueuedPhoto } from "@/services/photos"
import type { PreparedPhoto } from "@/types/photo"
import type { QueuedPhoto } from "@/types/upload-queue"
import { storagePathFor } from "@/utils/image-file"
import { logger } from "@/utils/logger"
import { dropQueued, readQueue, saveQueued } from "@/utils/upload-queue-db"
import { dueItems, isPermanentFailure, nextAttemptAt, queueCounts } from "@/utils/upload-queue"

export interface QueueListener {
  onChange: (counts: ReturnType<typeof queueCounts>) => void
  onSending: (sending: boolean) => void
  onUploaded: (id: string) => void
}

// The photo is safe on the phone from this moment: the album gets it as soon as there is a connection.
export const enqueuePhoto = async (photo: PreparedPhoto, guestName: string, now = Date.now()): Promise<string> => {
  const { thumb, ...full } = photo
  const item: QueuedPhoto = {
    id: crypto.randomUUID(), createdAt: new Date(now).toISOString(), guestName, full, thumb,
    ownerId: null, path: null, thumbPath: null, attempts: 0, nextAttemptAt: now, lastError: null, stuck: false,
  }
  await saveQueued(item)
  return item.id
}

let running: Promise<void> | null = null

// One run at a time, oldest photo first. Network trouble only delays a photo (growing pauses);
// a refusal no retry can fix marks it "stuck" for the guest to retry or drop.
export const processQueue = (listener: QueueListener): Promise<void> => {
  running ??= (async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return
    const due = dueItems(await readQueue(), Date.now())
    if (due.length === 0) return
    listener.onSending(true)
    for (const item of due) {
      let current = item
      try {
        const ownerId = await ensureGuestSession()
        if (!current.path || !current.thumbPath || current.ownerId !== ownerId) {
          current = {
            ...current, ownerId,
            path: storagePathFor(ownerId, current.full.mime),
            thumbPath: storagePathFor(ownerId, current.thumb.mime, "thumb-"),
          }
          await saveQueued(current)
        }
        await uploadQueuedPhoto({ ...current, ownerId, path: current.path as string, thumbPath: current.thumbPath as string })
        await dropQueued(current.id)
        listener.onUploaded(current.id)
        labelGuest(current.guestName).catch((error: unknown) => logger.warn("guest name not written on the account", error))
      } catch (error) {
        const attempts = current.attempts + 1
        logger.warn("queued photo not sent yet", error)
        await saveQueued({
          ...current, attempts, nextAttemptAt: nextAttemptAt(attempts, Date.now()),
          lastError: error instanceof Error ? error.message : String((error as { message?: string })?.message ?? error),
          stuck: isPermanentFailure(error),
        })
      }
    }
  })().finally(async () => {
    running = null
    listener.onSending(false)
    listener.onChange(queueCounts(await readQueue()))
  })
  return running
}

export const refreshCounts = async (listener: Pick<QueueListener, "onChange">): Promise<void> =>
  listener.onChange(queueCounts(await readQueue()))

// The guest's answer to a stuck photo: try again now, or let it go.
export const retryStuck = async (): Promise<void> => {
  for (const item of await readQueue()) if (item.stuck) await saveQueued({ ...item, stuck: false, nextAttemptAt: 0 })
}
export const discardStuck = async (): Promise<void> => {
  for (const item of await readQueue()) if (item.stuck) await dropQueued(item.id)
}

// Whether these photos have left the phone yet (the review waits briefly for them).
export const stillQueued = async (ids: string[]): Promise<string[]> => {
  const present = new Set((await readQueue()).map((item) => item.id))
  return ids.filter((id) => present.has(id))
}
