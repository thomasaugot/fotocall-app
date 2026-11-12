import { expect, test } from "./fixtures"
import { ROUTES, waitForPageReady } from "./routes"

// Local only (`npm run test:visual`): baselines are rendered on macOS, Linux fonts differ.
for (const route of ROUTES) {
  test(`${route.name} looks unchanged`, { tag: "@visual" }, async ({ page }) => {
    await page.goto(route.path)
    await waitForPageReady(page)
    await page.mouse.move(200, 300)
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 600)   // play scroll-triggered entrances
    await page.mouse.wheel(0, -100_000)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true })
  })
}
