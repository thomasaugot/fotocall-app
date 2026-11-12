import { test as base, expect } from "@playwright/test"

const GUEST_ID = "00000000-0000-4000-8000-000000000001"

// The database API is mocked: an E2E test never writes a real record, local or Cloud.
export const test = base.extend<{ mockBackend: void }>({
  mockBackend: [
    async ({ page }, use) => {
      await page.route(/\/auth\/v1\//, (route) =>
        route.fulfill({
          json: {
            access_token: "test-token", token_type: "bearer", expires_in: 3600, refresh_token: "test-refresh",
            user: { id: GUEST_ID, aud: "authenticated", role: "authenticated", is_anonymous: true },
          },
        }))
      await page.route(/\/rest\/v1\//, (route) => route.fulfill({ json: [] }))
      await page.route(/\/storage\/v1\//, (route) => route.fulfill({ json: [] }))
      await use()
    },
    { auto: true },
  ],
})

export { expect }
