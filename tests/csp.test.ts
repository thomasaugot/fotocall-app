import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

// Vercel sends the headers from vercel.json. The CSP pins index.html's inline pre-paint script by
// hash: if the script changes, this test fails and prints the new hash to put in vercel.json.
const html = readFileSync("index.html", "utf8")
const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const headers = Object.fromEntries(vercel.headers.flatMap((h) => h.headers).map((h) => [h.key, h.value]))
const csp = headers["Content-Security-Policy"] ?? ""

describe("security headers (vercel.json)", () => {
  it("allows every inline script of index.html by its sha256, and nothing inline otherwise", () => {
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
    expect(scripts.length).toBeGreaterThan(0)
    for (const script of scripts) {
      const hash = `'sha256-${createHash("sha256").update(script).digest("base64")}'`
      expect(csp, `add ${hash} to script-src in vercel.json`).toContain(hash)
    }
    const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? ""
    expect(scriptSrc).not.toMatch(/unsafe-inline|unsafe-eval/)
  })

  it("sends the full set on every path", () => {
    expect(vercel.headers[0].source).toBe("/(.*)")
    for (const key of ["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options",
      "Referrer-Policy", "Permissions-Policy", "Content-Security-Policy"]) {
      expect(headers[key], key).toBeTruthy()
    }
  })
})
