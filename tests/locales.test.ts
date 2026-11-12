import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { defaultLocale, locales } from "@/config/i18n.config"

// tests/ mirrors src/: this one covers the src/locales/ folder. Every language has every key.
const root = join(process.cwd(), "src/locales")

const flatten = (value: unknown, prefix = ""): string[] =>
  typeof value === "object" && value !== null
    ? Object.entries(value).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
    : [prefix]

const filesOf = (locale: string) => readdirSync(join(root, locale)).filter((f) => f.endsWith(".json")).sort()
const keysOf = (locale: string, file: string) =>
  flatten(JSON.parse(readFileSync(join(root, locale, file), "utf8"))).sort()

describe("locale parity", () => {
  it("has a folder for every configured locale and no other", () => {
    expect(readdirSync(root).sort()).toEqual([...locales].sort())
  })

  for (const locale of locales.filter((l) => l !== defaultLocale)) {
    it(`${locale} has the same files as ${defaultLocale}`, () => {
      expect(filesOf(locale)).toEqual(filesOf(defaultLocale))
    })

    for (const file of filesOf(defaultLocale)) {
      it(`${locale}/${file} has exactly the keys of ${defaultLocale}/${file}`, () => {
        expect(keysOf(locale, file)).toEqual(keysOf(defaultLocale, file))
      })
    }
  }

  it(`${defaultLocale} has no empty strings`, () => {
    for (const file of filesOf(defaultLocale)) {
      const data = JSON.parse(readFileSync(join(root, defaultLocale, file), "utf8"))
      for (const key of flatten(data)) {
        const value = key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], data)
        expect(value, `${file} → ${key}`).not.toBe("")
      }
    }
  })
})
