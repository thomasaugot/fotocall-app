import { expect, test } from "@playwright/test"

// Service workers only exist in a PRODUCTION build: CI's `pwa` job builds, serves it with
// `vite preview` and sets PWA_URL. Chromium only (WebKit's worker support in Playwright is partial).
const base = process.env.PWA_URL

test.skip(!base, "needs PWA_URL (a vite preview of the production build)")
test.skip(({ browserName }) => browserName !== "chromium", "service workers: Chromium only")

test("manifest is complete and every icon loads", async ({ request }) => {
  const res = await request.get(`${base}/manifest.webmanifest`)
  expect(res.status()).toBe(200)
  const manifest = await res.json()
  expect(manifest).toMatchObject({ name: "Mi fotocall", short_name: "Mi fotocall", start_url: "/", display: "standalone" })
  const purposes = manifest.icons.map((i: { purpose: string }) => i.purpose)
  expect(purposes.filter((p: string) => p === "any")).toHaveLength(2)
  expect(purposes).toContain("maskable")
  for (const icon of manifest.icons) expect((await request.get(`${base}${icon.src}`)).status(), icon.src).toBe(200)
})

test("the worker registers, and the shell opens offline", async ({ page, context }) => {
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.goto(`${base}/`)
  await page.waitForFunction(() => window.__loadingComplete === true)
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
  // No clientsClaim (updates are offered, never forced): the worker controls the NEXT load.
  await page.reload()
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)

  await context.setOffline(true)
  await page.reload()
  await page.waitForFunction(() => window.__loadingComplete === true)
  await expect(page.locator("h1")).toHaveCount(1)
  await expect(page.getByText("Sin conexión")).toBeVisible()
  expect(errors).toEqual([])
})
