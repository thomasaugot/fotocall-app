import { describe, expect, it } from "vitest"
import { useUploadQueueStore } from "@/stores/upload-queue-store"

describe("upload queue store", () => {
  it("starts empty and records counts and sending", () => {
    expect(useUploadQueueStore.getState().counts).toEqual({ waiting: 0, stuck: 0 })
    useUploadQueueStore.getState().setCounts({ waiting: 2, stuck: 1 })
    useUploadQueueStore.getState().setSending(true)
    expect(useUploadQueueStore.getState()).toMatchObject({ counts: { waiting: 2, stuck: 1 }, sending: true })
  })
})
