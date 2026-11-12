import { expect, test } from "@playwright/test"
import { ROUTES } from "./routes"

// Against the deployed PREVIEW only (the Vite dev server does not send vercel.json headers).
// Never production: PREVIEW_URL must be a Vercel preview deployment.
const preview = process.env.PREVIEW_URL ?? ""
test.skip(!preview, "set PREVIEW_URL to a Vercel preview deployment to run")
test.skip(({ browserName }) => browserName !== "chromium", "headers do not depend on the engine")

test("every security header is sent", async ({ request }) => {
  const response = await request.get(preview)
  const headers = response.headers()
  for (const key of ["strict-transport-security", "x-content-type-options", "x-frame-options",
    "referrer-policy", "permissions-policy", "content-security-policy"]) {
    expect(headers[key], key).toBeTruthy()
  }
})

for (const route of ROUTES) {
  test(`${route.name}: zero CSP violations`, async ({ page }) => {
    const violations: string[] = []
    page.on("console", (m) => { if (/Content.Security.Policy/i.test(m.text())) violations.push(m.text()) })
    await page.goto(new URL(route.path, preview).toString())
    await page.waitForFunction(() => window.__loadingComplete === true, null, { timeout: 15_000 })
    expect(violations).toEqual([])
  })
}
