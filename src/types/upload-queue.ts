import type { PreparedImage } from "@/types/photo"

// A photo waiting on the phone (IndexedDB) until it is safely in the album. Its row id and file
// paths are fixed on the first attempt, so a retry after a dropped connection never makes a copy.
export type QueuedPhoto = {
  id: string
  createdAt: string
  guestName: string
  full: PreparedImage
  thumb: PreparedImage
  ownerId: string | null
  path: string | null
  thumbPath: string | null
  attempts: number
  nextAttemptAt: number
  lastError: string | null
  // Refused for good (the 60-photo cap, a file the server rejects): waits for the guest.
  stuck: boolean
}

export type QueueCounts = { waiting: number; stuck: number }
