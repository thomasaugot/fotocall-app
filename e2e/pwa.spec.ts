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
