import { AxeBuilder } from "@axe-core/playwright"
import { expect, test } from "./fixtures"
import { ROUTES, waitForPageReady } from "./routes"

// Chromium only: axe's results do not depend on the engine.
test.skip(({ browserName }) => browserName !== "chromium", "axe runs in Chromium only")

for (const route of ROUTES) {
  test(`${route.name}: no serious or critical WCAG 2.2 AA violation`, async ({ page }) => {
    await page.goto(route.path)
    await waitForPageReady(page)
    // Entrance fades finished: axe reads half-faded text as low contrast.
    await page.waitForFunction(() => getComputedStyle(document.getElementById("main-content") as HTMLElement).opacity === "1")
    // …and every GSAP entrance inside the page too (a visible data-anim target mid-fade fails contrast).
    await page.waitForFunction(() => [...document.querySelectorAll<HTMLElement>("[data-anim]")].every((el) => {
      const style = getComputedStyle(el)
      return style.visibility === "hidden" || style.opacity === "1"
    }))
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
    const blocking = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
    expect(blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
  })
}
