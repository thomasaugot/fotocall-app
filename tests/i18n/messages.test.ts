import { describe, expect, it } from "vitest"
import { fileKey, loadMessages } from "@/i18n/messages"

describe("fileKey", () => {
  it("names a namespace after its file", () => {
    expect(fileKey("/src/locales/es/gallery.json")).toBe("gallery")
    expect(fileKey("/src/locales/es/common.json")).toBe("common")
  })
})

describe("loadMessages", () => {
  it("spreads common.json at the root and namespaces every other file", async () => {
    const messages = await loadMessages("es")
    expect(messages).toHaveProperty("brand")
    expect(messages).toHaveProperty("nav.home")
    expect(messages).toHaveProperty("home.title")
    expect(messages).toHaveProperty("gallery.title")
    expect(messages).not.toHaveProperty("common")
  })
})
