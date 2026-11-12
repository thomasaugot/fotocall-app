import { expect, test } from "./fixtures"
import { ROUTES, waitForPageReady } from "./routes"

for (const route of ROUTES) {
  test(`${route.name}: renders with no error, failed request or console warning`, async ({ page }) => {
    const problems: string[] = []
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`))
    page.on("response", (response) => {
      if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`)
    })
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") problems.push(`console ${message.type()}: ${message.text()}`)
    })

    const response = await page.goto(route.path)
    expect(response?.status()).toBeLessThan(400)
    await waitForPageReady(page)
    expect(problems).toEqual([])
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("h1")).toHaveText(route.h1)
  })
}
