import { describe, expect, it } from "vitest"
import { notBefore, photoTimeKind } from "@/utils/photo-time"

const ZONE = "Europe/Madrid"

describe("photoTimeKind", () => {
  it("is relative under an hour", () => {
    expect(photoTimeKind("2026-05-09T11:30:00Z", new Date("2026-05-09T12:10:00Z"), ZONE)).toBe("relative")
  })

  it("is the time of day later the same day", () => {
    expect(photoTimeKind("2026-05-09T10:00:00Z", new Date("2026-05-09T18:00:00Z"), ZONE)).toBe("time")
  })

  it("names the day once the day has changed in the event's zone", () => {
    // 21:30Z is 23:30 in Madrid on the 9th; 22:40Z is 00:40 on the 10th.
    expect(photoTimeKind("2026-05-09T21:30:00Z", new Date("2026-05-09T22:40:00Z"), ZONE)).toBe("day")
    expect(photoTimeKind("2026-05-09T10:00:00Z", new Date("2026-05-11T10:00:00Z"), ZONE)).toBe("day")
  })

  it("stays relative when the phone clock runs behind", () => {
    expect(photoTimeKind("2026-05-09T12:05:00Z", new Date("2026-05-09T12:00:00Z"), ZONE)).toBe("relative")
  })
})

describe("notBefore", () => {
  it("never returns a moment earlier than the photo", () => {
    const taken = "2026-05-09T12:05:00Z"
    expect(notBefore(new Date("2026-05-09T12:00:00Z"), taken).toISOString()).toBe("2026-05-09T12:05:00.000Z")
    expect(notBefore(new Date("2026-05-09T12:30:00Z"), taken).toISOString()).toBe("2026-05-09T12:30:00.000Z")
  })
})
