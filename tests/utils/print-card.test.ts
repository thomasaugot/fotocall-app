import { describe, expect, it } from "vitest"
import { buildPrintCardHtml, escapeHtml } from "@/utils/print-card"

const colors = { dark: "#111111", light: "#ffffff" }

describe("buildPrintCardHtml", () => {
  it("escapes every interpolated value", () => {
    const html = buildPrintCardHtml("<svg/>", { title: "<b>x</b>", appName: "A&B", url: 'https://x.test/?a="1"' }, colors, "es")
    expect(html).not.toContain("<b>x</b>")
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;")
    expect(html).toContain("A&amp;B")
    expect(html).toContain("&quot;1&quot;")
  })
  it("embeds the svg and the theme colours", () => {
    const html = buildPrintCardHtml("<svg id='qr'/>", { title: "t", appName: "a", url: "u" }, colors, "es")
    expect(html).toContain("<svg id='qr'/>")
    expect(html).toContain("#111111")
  })
  it("escapeHtml handles quotes", () => expect(escapeHtml(`'"`)).toBe("&#39;&quot;"))
})
