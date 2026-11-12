import { defineConfig, devices } from "@playwright/test"

const PORT = 5299
const CI = !!process.env.CI

// CI runs mobile + desktop (Chromium) + iphone (WebKit); all seven run locally.
const CI_PROJECTS = new Set(["mobile", "desktop", "iphone"])

const projects = [
  { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
  { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
  { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  { name: "iphone", use: { ...devices["iPhone 15"] } },
  { name: "ipad-mini", use: { ...devices["iPad Mini"] } },
  { name: "ipad-pro-landscape", use: { ...devices["iPad Pro 11 landscape"] } },
  { name: "ipad-13-landscape", use: { ...devices["iPad Pro 11 landscape"], viewport: { width: 1376, height: 1032 } } },
]

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  retries: CI ? 2 : 0,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  projects: CI ? projects.filter((p) => CI_PROJECTS.has(p.name)) : projects,
  // Its OWN Vite server in test mode, never Thomas's `npm run dev`.
  webServer: {
    command: `npx vite --mode test --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
