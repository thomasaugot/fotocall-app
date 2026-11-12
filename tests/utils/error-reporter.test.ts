import { describe, expect, it, vi } from "vitest"
import { createErrorReporter } from "@/utils/error-reporter"

const sinkMock = () => ({ captureException: vi.fn() })

describe("createErrorReporter", () => {
  it("drops everything while never started (no DSN, dev, tests)", () => {
    const reporter = createErrorReporter()
    expect(() => reporter.report(new Error("x"))).not.toThrow()
  })

  it("queues errors raised before the SDK lands, then flushes them in order", async () => {
    const reporter = createErrorReporter()
    const sink = sinkMock()
    let resolve: (s: typeof sink) => void = () => {}
    const started = reporter.start(() => new Promise((r) => { resolve = r }))
    reporter.report("first", { section: "a" })
    reporter.report("second")
    expect(sink.captureException).not.toHaveBeenCalled()
    resolve(sink)
    await started
    expect(sink.captureException.mock.calls).toEqual([
      ["first", { extra: { section: "a" } }],
      ["second", { extra: undefined }],
    ])
  })

  it("sends straight to the sink once loaded", async () => {
    const reporter = createErrorReporter()
    const sink = sinkMock()
    await reporter.start(async () => sink)
    reporter.report("now")
    expect(sink.captureException).toHaveBeenCalledWith("now", { extra: undefined })
  })

  it("caps the queue at 20", async () => {
    const reporter = createErrorReporter()
    const sink = sinkMock()
    let resolve: (s: typeof sink) => void = () => {}
    const started = reporter.start(() => new Promise((r) => { resolve = r }))
    for (let i = 0; i < 30; i++) reporter.report(i)
    resolve(sink)
    await started
    expect(sink.captureException).toHaveBeenCalledTimes(20)
  })

  it("never throws when the SDK fails to load, and stops queueing", async () => {
    const reporter = createErrorReporter()
    reporter.report("before")
    await expect(reporter.start(() => Promise.reject(new Error("blocked")))).resolves.toBeUndefined()
    expect(() => reporter.report("after")).not.toThrow()
  })
})
