import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/app.config", () => ({ appConfig: { isDev: true } }))

const { createLogger } = await import("@/utils/logger")

const sink = () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() })

describe("createLogger", () => {
  it("forwards every level to the sink when enabled", () => {
    const out = sink()
    const log = createLogger(true, out)
    log.debug("d"); log.info("i"); log.warn("w"); log.error("e", 1)
    expect(out.debug).toHaveBeenCalledWith("d")
    expect(out.info).toHaveBeenCalledWith("i")
    expect(out.warn).toHaveBeenCalledWith("w")
    expect(out.error).toHaveBeenCalledWith("e", 1)
  })

  it("writes nothing when disabled", () => {
    const out = sink()
    const log = createLogger(false, out)
    log.debug("d"); log.info("i"); log.warn("w"); log.error("e")
    Object.values(out).forEach((fn) => expect(fn).not.toHaveBeenCalled())
  })
})
