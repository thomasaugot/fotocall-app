import { describe, expect, it } from "vitest"
import { dueItems, isAlreadyStored, isPermanentFailure, nextAttemptAt, queueCounts } from "@/utils/upload-queue"

describe("nextAttemptAt", () => {
  it("backs off, capped at two minutes", () => {
    expect(nextAttemptAt(1, 0)).toBe(4_000)
    expect(nextAttemptAt(2, 0)).toBe(8_000)
    expect(nextAttemptAt(30, 0)).toBe(120_000)
  })
})

describe("dueItems", () => {
  const item = (createdAt: string, nextAttemptAt: number, stuck = false) => ({ createdAt, nextAttemptAt, stuck })
  it("keeps the ones due and not stuck, oldest first", () => {
    const items = [item("b", 0), item("a", 0), item("c", 999), item("d", 0, true)]
    expect(dueItems(items, 100).map((i) => i.createdAt)).toEqual(["a", "b"])
  })
})

describe("queueCounts", () => {
  it("separates waiting from stuck", () =>
    expect(queueCounts([{ stuck: false }, { stuck: true }, { stuck: false }])).toEqual({ waiting: 2, stuck: 1 }))
})

describe("failure kinds", () => {
  it("never treats the network as permanent", () => {
    expect(isPermanentFailure(new TypeError("Failed to fetch"))).toBe(false)
    expect(isPermanentFailure({ statusCode: "503" })).toBe(false)
  })
  it("treats policy and file refusals as permanent", () => {
    expect(isPermanentFailure({ code: "42501" })).toBe(true)
    expect(isPermanentFailure({ statusCode: "413" })).toBe(true)
  })
  it("recognises what an earlier attempt already stored", () => {
    expect(isAlreadyStored({ code: "23505" })).toBe(true)
    expect(isAlreadyStored({ statusCode: "409", message: "The resource already exists" })).toBe(true)
    expect(isAlreadyStored({ code: "42501" })).toBe(false)
  })
})
