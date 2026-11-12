import type { Page } from "@playwright/test"
import { expect, test } from "./fixtures"
import { waitForPageReady } from "./routes"

// Pages are still short. Make HOME long (and only home) so a stale scroll position would show:
// the long-page → short-page hop is exactly where it broke before (06-TRANSITIONS).
// The style follows the page RENDERED in <main> (its <h1>), never the URL: the URL changes before
// React swaps the page, and a page that shrank early made WebKit clamp and save a wrong position.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const sync = () => {
      const title = document.querySelector("main h1")?.textContent ?? ""
      document.documentElement.toggleAttribute("data-e2e-home", title === "Mi fotocall")
    }
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style")
      style.textContent = "html[data-e2e-home] main { min-height: 400vh }"
      document.head.append(style)
      new MutationObserver(sync).observe(document.body, { childList: true, subtree: true, characterData: true })
      sync()
    })
  })
})

// Scroll like a person: wheel, polled (Lenis re-measures a page that grew ~250ms later).
// Touch devices have no wheel (and no Lenis below 1280px): a native scroll step stands in.
const scrollPast = async (page: Page, y: number, isMobile: boolean) => {
  await page.mouse.move(200, 300)
  await expect(async () => {
    if (isMobile) await page.evaluate(() => scrollBy(0, 400))
    else await page.mouse.wheel(0, 400)
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(y)
  }).toPass({ timeout: 10_000 })
}

// evaluate-click so Playwright does not scroll the page to the link first.
const clickNav = (page: Page, href: string) =>
  page.locator(`nav a[href="${href}"]`).evaluate((a: HTMLAnchorElement) => a.click())

// Landed = new path AND enterPage finished (it clears <main>'s inline opacity/transform).
// Focus alone is not enough: <main> keeps focus from the previous hop, and a click during a
// transition is ignored by design (no queuing, 06-TRANSITIONS).
const landed = async (page: Page, path: string) => {
  await page.waitForFunction((p) => location.pathname === p, path)
  await page.waitForFunction(() => {
    const main = document.getElementById("main-content")
    return document.activeElement === main && main?.style.opacity === "" && main.style.transform === ""
  })
}

test("every link navigation lands at the top, over 12 hops including long → short", async ({ page, isMobile }) => {
  await page.goto("/")
  await waitForPageReady(page)
  for (let hop = 0; hop < 6; hop++) {
    await scrollPast(page, 1200, isMobile)
    await clickNav(page, "/galeria")
    await landed(page, "/galeria")
    expect(await page.evaluate(() => scrollY)).toBe(0)

    await clickNav(page, "/")
    await landed(page, "/")
    expect(await page.evaluate(() => scrollY)).toBe(0)
  }
})

test("back restores the scroll position the page was left at", async ({ page, isMobile }) => {
  await page.goto("/")
  await waitForPageReady(page)
  await scrollPast(page, 900, isMobile)
  // Wheel scrolling is smooth (Lenis on desktop, the browser below): read it once it has stopped.
  let left = -1
  await expect.poll(async () => {
    const now = await page.evaluate(() => scrollY)
    const settled = now === left
    left = now
    return settled
  }, { intervals: [150] }).toBe(true)
  await clickNav(page, "/galeria")
  await landed(page, "/galeria")
  await page.goBack()
  await page.waitForFunction(() => location.pathname === "/")
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThanOrEqual(left - 2)
  expect(Math.abs((await page.evaluate(() => scrollY)) - left)).toBeLessThanOrEqual(2)
})

test("a deep route opened directly renders, and an unknown URL shows the 404 page", async ({ page }) => {
  await page.goto("/galeria")
  await waitForPageReady(page)
  await expect(page.locator("h1")).toHaveText("Galería")
  await page.goto("/no/existe/nada")
  await waitForPageReady(page)
  await expect(page.locator("h1")).toHaveText("Esta página no existe")
})

test("switching breakpoints never reloads the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await waitForPageReady(page)
  await page.evaluate(() => { (window as Window & { __sameDocument?: boolean }).__sameDocument = true })
  for (const width of [390, 768, 1440, 1024]) await page.setViewportSize({ width, height: 900 })
  expect(await page.evaluate(() => (window as Window & { __sameDocument?: boolean }).__sameDocument)).toBe(true)
})
