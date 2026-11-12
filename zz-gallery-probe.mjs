// THROWAWAY: screenshots of /galeria with mocked Supabase. Deleted after use.
import { chromium } from "@playwright/test"
import { readFileSync } from "node:fs"
const OUT = process.env.OUT
const BASE = "http://localhost:5311"
const GUEST = "00000000-0000-4000-8000-000000000001"
const NAMES = ["Tía Carmen", "Abuela Lola", "Pablo", "Marta y Luis", "Tío Paco", "Lucía", "Los primos de Valencia", "Abuelo Manolo", "Inés"]
const SHAPES = [[1536, 2048], [1536, 2048], [2048, 1536], [1536, 2048], [1600, 1600], [1536, 2048], [1536, 2048], [2048, 1152], [1536, 2048]]
const N = Number(process.env.N ?? 23)
const now = Date.now()
const rows = Array.from({ length: N }, (_, i) => {
  const [w, h] = SHAPES[i % SHAPES.length]
  return { id: `ph-${String(N - i).padStart(4, "0")}-aaaa`, owner_id: i % 4 === 0 ? GUEST : `g-${i % 5}`, guest_name: NAMES[i % NAMES.length],
    storage_path: `u/${N - i}_${w}x${h}.webp`, width: w, height: h, created_at: new Date(now - (i * i * 4 + 2) * 60_000).toISOString() }
})
const cache = new Map()
const mock = async (page, empty) => {
  await page.route(/\/auth\/v1\//, (r) => r.fulfill({ json: { access_token: "t", token_type: "bearer", expires_in: 3600, refresh_token: "r", user: { id: GUEST, aud: "authenticated", role: "authenticated", is_anonymous: true } } }))
  await page.route(/\/rest\/v1\//, (r) => r.fulfill({ json: empty ? [] : rows }))
  await page.route(/\/storage\/v1\/object\/sign\/photos$/, (r) => r.fulfill({ json: rows.map((x) => ({ path: x.storage_path, signedURL: `/object/sign/photos/${x.storage_path}?token=x`, error: null })) }))
  await page.route(/\/storage\/v1\/object\/sign\/photos\/u\//, async (r) => {
    const m = /u\/(\d+)_(\d+)x(\d+)/.exec(r.request().url())
    const key = m[0]
    const ratio = Number(m[2]) / Number(m[3])
    const shape = ratio < 0.9 ? "p" : ratio > 1.5 ? "w" : ratio > 1.15 ? "l" : "s"
    if (!cache.has(key)) cache.set(key, readFileSync(`${process.env.IMG}/${shape}${(Number(m[1]) % 12) + 1}.jpg`))
    await r.fulfill({ body: cache.get(key), contentType: "image/jpeg" })
  })
}
const ready = (page) => page.waitForFunction(() => window.__loadingComplete === true, null, { timeout: 20000 })
const settle = (page) => page.waitForFunction(() => document.getAnimations().length === 0 && [...document.querySelectorAll("main img")].filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => i.complete))
const browser = await chromium.launch()
const errors = []
for (const [name, width, height] of [["390", 390, 844], ["360", 360, 740], ["768", 768, 1024], ["1440", 1440, 900]].filter((v) => !process.env.ONLY || process.env.ONLY === v[0])) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: width < 800, timezoneId: "Europe/Madrid", locale: "es-ES" })
  const page = await ctx.newPage()
  page.on("pageerror", (e) => errors.push(`${name} pageerror ${e.message}`))
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(`${name} console ${m.text()} @ ${JSON.stringify(m.location())} step=${globalThis.step}`) })
  await mock(page, false)
  await page.goto(`${BASE}/galeria`)
  await ready(page)
  await page.waitForTimeout(1600); await settle(page)
  await page.screenshot({ path: `${OUT}/album-${name}.png` })
  // scroll through so lazy prints load and mount, then a full-page capture
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += height * 0.7) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(450) }
  await page.waitForTimeout(900)
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-anim]")].filter((e) => getComputedStyle(e).visibility === "hidden" && !e.closest("dialog")).length)
  if (hidden) errors.push(`${name}: ${hidden} data-anim still hidden after scrolling`)
  await page.screenshot({ path: `${OUT}/album-${name}-full.png`, fullPage: true })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  if (overflow > 0) errors.push(`${name}: horizontal overflow ${overflow}px`)
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(500)
  // viewer: own photo (first row is the guest's)
  await page.locator("main figure button").first().click()
  await page.waitForSelector("dialog[open]"); await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/viewer-${name}.png` })
  await page.keyboard.press("ArrowRight"); await page.waitForTimeout(1100)
  await page.screenshot({ path: `${OUT}/viewer-${name}-next.png` })
  await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(900)
  await page.getByRole("button", { name: "Eliminar" }).click(); await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/viewer-${name}-confirm.png` })
  await ctx.close()
  const ectx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: "es-ES" })
  const epage = await ectx.newPage()
  await mock(epage, true)
  await epage.goto(`${BASE}/galeria`); await ready(epage); await epage.waitForTimeout(1800)
  await epage.screenshot({ path: `${OUT}/empty-${name}.png` })
  await ectx.close()
}
await browser.close()
console.log(errors.length ? errors.join("\n") : "no page errors, no hidden targets, no overflow")
