import { describe, expect, it } from "vitest"
import { readQrColors } from "@/utils/qr-colors"

const style = (tokens: Record<string, string>) => ({ getPropertyValue: (n: string) => tokens[n] ?? "" })
const resolve = (css: string) => (css === "dark" ? { r: 10, g: 10, b: 10 } : css === "light" ? { r: 250, g: 250, b: 250 } : { r: 20, g: 20, b: 20 })

describe("readQrColors", () => {
  it("reads the text and surface tokens", () =>
    expect(readQrColors(style({ "--color-text": "dark", "--color-surface": "light" }), resolve)).toEqual({ dark: "#0a0a0a", light: "#fafafa" }))
  it("fails on a missing token", () => expect(() => readQrColors(style({ "--color-text": "dark" }), resolve)).toThrow(/empty/))
  it("refuses a pair too close to scan", () =>
    expect(() => readQrColors(style({ "--color-text": "dark", "--color-surface": "near" }), resolve)).toThrow(/scan/))
})
