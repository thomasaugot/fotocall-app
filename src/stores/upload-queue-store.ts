import { create } from "zustand"
import type { QueueCounts } from "@/types/upload-queue"

// What the phone still holds for the album, for the status chip. The queue itself lives in
// IndexedDB (services/upload-queue); this is only its last known shape.
type UploadQueueState = {
  counts: QueueCounts
  sending: boolean
  setCounts: (counts: QueueCounts) => void
  setSending: (sending: boolean) => void
}

export const useUploadQueueStore = create<UploadQueueState>()((set) => ({
  counts: { waiting: 0, stuck: 0 },
  sending: false,
  setCounts: (counts) => set({ counts }),
  setSending: (sending) => set({ sending }),
}))
