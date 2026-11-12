import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/app.config", () => ({ appConfig: { isDev: false } }))

const { pickBrowserLocale, readLanguagePreference, storeLanguagePreference } =
  await import("@/utils/language-preference")

const memoryStorage = () => {
  const data: Record<string, string> = {}
  return { getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => { data[k] = v }, data }
}
const throwing = { getItem: () => { throw new Error("x") }, setItem: () => { throw new Error("x") } }

describe("pickBrowserLocale", () => {
  it("returns the first browser language that is supported, by its base tag", () => {
    expect(pickBrowserLocale(["fr-FR", "es-ES", "en"], ["es", "en"])).toBe("es")
    expect(pickBrowserLocale(["EN-gb"], ["es", "en"])).toBe("en")
  })

  it("returns null when nothing matches", () => {
    expect(pickBrowserLocale(["fr", "de"], ["es"])).toBeNull()
    expect(pickBrowserLocale([], ["es"])).toBeNull()
  })
})

describe("language preference storage", () => {
  it("round-trips a supported locale", () => {
    const storage = memoryStorage()
    storeLanguagePreference(storage, "es")
    expect(readLanguagePreference(storage)).toBe("es")
  })

  it("ignores an unsupported stored value", () => {
    const storage = memoryStorage()
    storage.setItem("preferred-language", "xx")
    expect(readLanguagePreference(storage)).toBeNull()
  })

  it("survives blocked storage", () => {
    expect(readLanguagePreference(throwing)).toBeNull()
    expect(() => storeLanguagePreference(throwing, "es")).not.toThrow()
  })
})
