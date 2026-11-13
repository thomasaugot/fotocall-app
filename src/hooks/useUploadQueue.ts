import { useEffect } from "react"
import { queryKeys } from "@/constants/query-keys"
import { queryClient } from "@/lib/query-client"
import { processQueue, refreshCounts, type QueueListener } from "@/services/upload-queue"
import { useUploadQueueStore } from "@/stores/upload-queue-store"
import { logger } from "@/utils/logger"
import { queueAvailable } from "@/utils/upload-queue-db"

const RETRY_EVERY_MS = 15_000

const listener: QueueListener = {
  onChange: (counts) => useUploadQueueStore.getState().setCounts(counts),
  onSending: (sending) => useUploadQueueStore.getState().setSending(sending),
  onUploaded: () => void queryClient.invalidateQueries({ queryKey: queryKeys.photos.all }),
}

// Send whatever the phone holds, now. Safe to call any time: one run at a time.
export const runUploadQueue = (): Promise<void> =>
  queueAvailable() ? processQueue(listener).catch((error: unknown) => logger.warn("upload queue run failed", error)) : Promise.resolve()

// Mounted once (Providers): picks the queue up on load (photos left from a closed app), when the
// connection comes back, when the app returns to the foreground, and every 15 s.
export const useUploadQueue = () => {
  const counts = useUploadQueueStore((s) => s.counts)
  const sending = useUploadQueueStore((s) => s.sending)

  useEffect(() => {
    if (!queueAvailable()) return
    void refreshCounts(listener).then(runUploadQueue)
    const onVisible = () => { if (document.visibilityState === "visible") void runUploadQueue() }
    const timer = window.setInterval(() => void runUploadQueue(), RETRY_EVERY_MS)
    window.addEventListener("online", runUploadQueue)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("online", runUploadQueue)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return { counts, sending }
}
