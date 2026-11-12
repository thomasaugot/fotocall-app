import { describe, expect, it } from "vitest"
import { dataUrlToBlob, svgToDataUrl } from "@/utils/data-url"

describe("dataUrlToBlob", () => {
  it("decodes base64 with its type", async () => {
    const blob = dataUrlToBlob("data:image/png;base64,AQID")
    expect(blob.type).toBe("image/png")
    expect([...new Uint8Array(await blob.arrayBuffer())]).toEqual([1, 2, 3])
  })
  it("refuses anything else", () => expect(() => dataUrlToBlob("https://x.test/a.png")).toThrow())
})

describe("svgToDataUrl", () => {
  it("encodes the svg", () => expect(svgToDataUrl("<svg a='1'/>")).toBe("data:image/svg+xml;charset=utf-8,%3Csvg%20a%3D'1'%2F%3E"))
})
