import type { QueuedPhoto, QueueCounts } from "@/types/upload-queue"

const BASE_DELAY_MS = 4_000
const MAX_DELAY_MS = 120_000

// Retry soon at first, then less and less often, never more than every two minutes.
export const nextAttemptAt = (attempts: number, now: number): number =>
  now + Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** Math.max(0, attempts - 1))

export const isDue = (item: Pick<QueuedPhoto, "stuck" | "nextAttemptAt">, now: number): boolean =>
  !item.stuck && item.nextAttemptAt <= now

// The order photos go up in: oldest first, as they were taken.
export const dueItems = <T extends Pick<QueuedPhoto, "stuck" | "nextAttemptAt" | "createdAt">>(items: T[], now: number): T[] =>
  items.filter((item) => isDue(item, now)).sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export const queueCounts = (items: Pick<QueuedPhoto, "stuck">[]): QueueCounts => ({
  waiting: items.filter((item) => !item.stuck).length,
  stuck: items.filter((item) => item.stuck).length,
})

// A refusal no retry can fix: the database said no (policy, check, cap) or the bucket refused the file.
// Network trouble (fetch failed, timeouts, 5xx) is never permanent.
export const isPermanentFailure = (error: unknown): boolean => {
  const e = error as { code?: string; statusCode?: string | number; status?: number; message?: string } | null
  if (!e) return false
  const status = Number(e.statusCode ?? e.status)
  if (e.code === "42501" || e.code === "23514") return true
  if (status === 400 || status === 403 || status === 413 || status === 415) return true
  return false
}

// "Already there" answers mean an earlier attempt got through before the connection dropped.
export const isAlreadyStored = (error: unknown): boolean => {
  const e = error as { code?: string; statusCode?: string | number; message?: string } | null
  if (!e) return false
  return e.code === "23505" || String(e.statusCode) === "409" || /already exists|duplicate/i.test(e.message ?? "")
}
