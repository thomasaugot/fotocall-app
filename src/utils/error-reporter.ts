import type { ErrorContext, ErrorSink } from "@/types/error-reporter"

const MAX_QUEUED = 20

// The SDK is loaded on demand (13-MONITORING): errors raised before it lands wait here, capped,
// and are flushed once it arrives. A failed load drops them; reporting must never break the app.
export const createErrorReporter = () => {
  let sink: ErrorSink | null = null
  let enabled = false
  const queue: Array<[unknown, ErrorContext | undefined]> = []

  return {
    start: (load: () => Promise<ErrorSink>): Promise<void> => {
      enabled = true
      return load()
        .then((loaded) => {
          sink = loaded
          queue.splice(0).forEach(([error, extra]) => loaded.captureException(error, { extra }))
        })
        .catch(() => {
          enabled = false
          queue.length = 0
        })
    },
    report: (error: unknown, extra?: ErrorContext): void => {
      if (sink) {
        sink.captureException(error, { extra })
        return
      }
      if (enabled && queue.length < MAX_QUEUED) queue.push([error, extra])
    },
  }
}
