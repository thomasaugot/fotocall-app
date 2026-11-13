import { AxeBuilder } from "@axe-core/playwright"
import { expect, test } from "./fixtures"
import { waitForPageReady } from "./routes"

// A stored admin session (the browser keeps it in localStorage) and a mocked album: nothing real is touched.
const ADMIN = { id: "00000000-0000-4000-8000-0000000000aa", aud: "authenticated", role: "authenticated", is_anonymous: false, app_metadata: { role: "admin" }, user_metadata: {} }

test.describe("admin dashboard", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "chromium only")

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((user) => {
      localStorage.setItem("sb-127-auth-token", JSON.stringify({
        access_token: "test-token", refresh_token: "test-refresh", token_type: "bearer",
        expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user,
      }))
    }, ADMIN)
    await page.route(/\/rest\/v1\/photos/, (route) => route.fulfill({
      json: [{ id: "p1", owner_id: "o1", guest_name: "TEST - Tía Carmen", storage_path: "o1/p1.webp", width: 8, height: 8, created_at: "2026-11-12T10:00:00Z" }],
    }))
    await page.route(/\/storage\/v1\/object\/sign\//, (route) => route.fulfill({
      json: [{ path: "o1/p1.webp", signedURL: "/object/sign/photos/o1/p1.webp?token=t", error: null }],
    }))
  })

  test("shows the album, the selection and the QR, with no serious a11y violation", async ({ page }) => {
    await page.goto("/admin")
    await waitForPageReady(page)
    await expect(page.locator("h1")).toHaveText("El álbum")
    await expect(page.getByRole("checkbox", { name: "Seleccionar la foto de TEST - Tía Carmen" })).toBeAttached()
    await expect(page.getByRole("img", { name: /Código QR que abre/ })).toBeVisible()
    await page.getByRole("checkbox", { name: "Seleccionar todas" }).check({ force: true })
    await expect(page.getByText("1 foto seleccionada")).toBeVisible()
    await page.getByRole("button", { name: "Eliminar selección" }).click()
    await expect(page.getByRole("dialog", { name: "Eliminar fotos" })).toBeVisible()
    await page.keyboard.press("Escape")

    await page.waitForFunction(() => getComputedStyle(document.getElementById("main-content") as HTMLElement).opacity === "1")
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([])
  })
})
