import { describe, expect, it } from "vitest"
import { isIosSafari, pickInstallOffer, readInstallDismissed, storeInstallDismissed } from "@/utils/install-prompt"

const IPHONE_SAFARI = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
const IPHONE_CHROME = IPHONE_SAFARI.replace("Version/18.0", "CriOS/130.0")
const ANDROID = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36"

describe("pickInstallOffer", () => {
  const base = { standalone: false, dismissed: false, hasPrompt: false, userAgent: ANDROID }
  it("offers the button when the browser offers install", () => {
    expect(pickInstallOffer({ ...base, hasPrompt: true })).toBe("prompt")
  })
  it("shows the hint on iOS Safari only", () => {
    expect(pickInstallOffer({ ...base, userAgent: IPHONE_SAFARI })).toBe("ios-hint")
    expect(pickInstallOffer({ ...base, userAgent: IPHONE_CHROME })).toBe("none")
    expect(pickInstallOffer(base)).toBe("none")
  })
  it("never once installed or dismissed", () => {
    expect(pickInstallOffer({ ...base, hasPrompt: true, standalone: true })).toBe("none")
    expect(pickInstallOffer({ ...base, userAgent: IPHONE_SAFARI, dismissed: true })).toBe("none")
  })
})

describe("isIosSafari", () => {
  it("tells Safari from other iOS browsers", () => {
    expect(isIosSafari(IPHONE_SAFARI)).toBe(true)
    expect(isIosSafari(IPHONE_CHROME)).toBe(false)
  })
})

describe("install dismissal storage", () => {
  it("round-trips, and survives blocked storage", () => {
    const map = new Map<string, string>()
    const storage = { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) }
    expect(readInstallDismissed(storage)).toBe(false)
    storeInstallDismissed(storage)
    expect(readInstallDismissed(storage)).toBe(true)
    const blocked = { getItem: () => { throw new Error("blocked") }, setItem: () => { throw new Error("blocked") } }
    expect(readInstallDismissed(blocked)).toBe(false)
    expect(() => storeInstallDismissed(blocked)).not.toThrow()
  })
})
