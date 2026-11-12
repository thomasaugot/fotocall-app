---
paths:
  - "src/**"
  - ".github/**"
  - "vite.config.*"
---

# MONITORING.md — Know Before the Client Does (Vite + React)

A section that crashes silently, a deploy that serves a blank page, a site that is down at
night: without monitoring, the client reports all of these. Every production project gets
the three pieces below.

---

## Error tracking — Sentry

`@sentry/react`, wired by hand. **Off unless `VITE_SENTRY_DSN` is set, and only in production
builds**, so dev, tests and CI never report.

**The SDK is a DYNAMIC import.** `@sentry/react` is ~100 KB gzip: imported statically it pushed
the first page to 208 KB and failed the 200 KB budget (14-PERFORMANCE) on Scoreboard, Nov 2026.
Loaded on demand it costs the first page nothing, and a build without a DSN never downloads it.
Errors raised before it arrives are queued (capped) and flushed once it lands.

```ts
// src/utils/error-reporter.ts — pure, unit-tested: queue until the sink loads, then flush
export const createErrorReporter = () => {
  let sink: ErrorSink | null = null; let enabled = false
  const queue: Array<[unknown, ErrorContext | undefined]> = []
  return {
    start: (load: () => Promise<ErrorSink>) => { enabled = true; return load()
      .then((s) => { sink = s; queue.splice(0).forEach(([e, x]) => s.captureException(e, { extra: x })) })
      .catch(() => { enabled = false; queue.length = 0 }) },
    report: (error: unknown, extra?: ErrorContext) => {
      if (sink) return sink.captureException(error, { extra })
      if (enabled && queue.length < 20) queue.push([error, extra])
    },
  }
}

// src/lib/sentry.ts — the ONLY file that names @sentry/react, and only inside import()
export const sentryEnabled = !!appConfig.sentryDsn && appConfig.isProd
const reporter = createErrorReporter()
export const startErrorReporting = () => {
  if (!sentryEnabled || !appConfig.sentryDsn) return
  const dsn = appConfig.sentryDsn
  void reporter.start(async () => {
    const Sentry = await import("@sentry/react")
    Sentry.init({
      dsn, environment: appConfig.siteUrl, tracesSampleRate: 0.1,
      // Sentry ≥ 11: `sendDefaultPii` is gone — turn every personal-data category off instead
      dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
      integrations: [Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes })],
    })
    return Sentry
  })
}
export const reportError = (error: unknown, extra?: ErrorContext) => reporter.report(error, extra)

// src/main.tsx — first line of the app, before createRoot
startErrorReporting()
createRoot(root, {
  onUncaughtError: (error, info) => reportError(error, { componentStack: info.componentStack }),
}).render(<StrictMode><RouterProvider router={router} /></StrictMode>)
```

- Everything else calls `reportError()`, never `Sentry.*`: a static `import * as Sentry`
  anywhere in `src/` puts the whole SDK back in the first page.
- No `Sentry.wrapCreateBrowserRouterV7` / `Sentry.ErrorBoundary`: both are static imports.
  The tracing integration above already names routes; the top-level boundary is our own
  `AppErrorBoundary` calling `reportError`.

- `VITE_SENTRY_DSN` is public by design (a DSN only accepts events). It is read through
  `src/config/app.config.ts` like every env var, and set in the **host's build environment** —
  it is baked in at build time, so changing it needs a rebuild, not a restart.
- Never send personal data: `dataCollection` all off (Sentry ≥ 11; `sendDefaultPii: false` before), and no names, emails or free text in
  `extra`/breadcrumbs (11-SECURITY.md → Logging).
- `connect-src` in the CSP must allow the Sentry ingest host (11-SECURITY.md).


### Noise, alerts, releases — make every event worth reading

```ts
// in Sentry.init — events that are never our bug, and burn the free quota (~5k/month)
ignoreErrors: [
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications",
  "AbortError",                 // navigation cancelled a request
  "Non-Error promise rejection captured",
],
denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//],
```

- **Release = the commit SHA**, set at build, so every event says which deploy produced it
  and Sentry flags "new in this release" / "regressed in this release". `sentryVitePlugin({ release: { name: process.env.GIT_SHA } })` injects it into the
  bundle; the SDK picks it up — no `release` in `Sentry.init` by hand.
- **Alert rules, configured on day one** — nobody opens a dashboard on their own:
  new issue → email (or Slack) immediately; regression of a resolved issue → immediately;
  weekly digest of the top issues. An error tracker without alerts is a log nobody reads.
- Add a filter only for errors you have read and understood. Never ignore a whole category
  "to calm the noise" — that is how a real bug hides for months.

### Source maps — uploaded, never published

Without source maps every stack trace is minified noise. Published source maps hand your
source code to anyone. So: generate them hidden, upload them at build, delete them.

```ts
// vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin"

// Maps ONLY when they can be uploaded: without a token the plugin does nothing, so "hidden"
// maps stay in dist/ and the Dockerfile's no-.map check fails the build (Scoreboard, Nov 2026).
const sentryUpload = process.env.SENTRY_AUTH_TOKEN
  ? [sentryVitePlugin({                  // LAST plugin
      org: "<org>", project: "<project>",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: { filesToDeleteAfterUpload: ["./dist/**/*.map"] },
    })]
  : []

export default defineConfig({
  build: { sourcemap: process.env.SENTRY_AUTH_TOKEN ? "hidden" : false },
  plugins: [react(), tailwindcss(), ...sentryUpload],
})
```

- `SENTRY_AUTH_TOKEN` is a **build secret** (CI / host build env). Never `VITE_`-prefixed —
  that would put it in the bundle.
- After a build: `find dist -name "*.map"` must print nothing.

### Verify on the live site

In the console, `setTimeout(() => { throw new Error("Sentry test") })` — a bare `throw` in the
console is not captured. Check the issue shows readable file names and line numbers (source
maps worked), then resolve it.

---

## Stale tabs after a deploy — reload once, never a blank page

Every deploy renames the JS chunks (content hashes) and the old ones are gone. A visitor who
kept the app open clicks a lazy route, the browser asks for the OLD chunk, gets a 404, and the
page stays blank: `Failed to fetch dynamically imported module`. With lazy routes this
happens after EVERY deploy, to everyone with an open tab.

```ts
// src/main.tsx — one reload per 10 s at most, so a genuinely missing chunk cannot loop
window.addEventListener("vite:preloadError", (event) => {
  const key = "chunk-reload-at"
  const last = Number(sessionStorage.getItem(key) ?? 0)
  if (Date.now() - last < 10_000) return        // already tried: let RouteError show it
  event.preventDefault()                         // not a bug — do not report it
  sessionStorage.setItem(key, String(Date.now()))
  window.location.reload()
})
```

A reload fetches the new `index.html`, which points at the new chunks. Keep the old chunks
deployable for a while if the host allows it (some keep previous assets by default), but never
rely on it alone.

---

## Error boundaries report — they never swallow

A section `ErrorBoundary` that renders nothing on error hides the bug from everyone. It must
report:

```tsx
componentDidCatch(error: Error, info: React.ErrorInfo) {
  logger.error(`Error in ${this.props.section}`, error)
  reportError(error, { section: this.props.section, componentStack: info.componentStack })
}
```

Plus, at the top of the tree:

- **`RouteError`** — the router's `errorElement` (04-CLIENT_SERVER.md) reports
  `useRouteError()` with `reportError` in an effect.
- **`AppErrorBoundary`** (our own class component, calling `reportError`) around `<RouterProvider>` in `main.tsx`, with a short fallback in
  the site's language and a reload button. It renders OUTSIDE the IntlProvider (that lives in the
  router), so it imports the default locale's JSON directly and uses a plain `<a href="/">` — the last net for anything that breaks outside
  the routes (providers, the layout itself).

---

## Uptime — `.github/workflows/uptime.yml`

Every 10 minutes, `curl` the homepage (3 attempts, 20 s apart). A failed run emails whoever
last edited the schedule. `SITE_URL` comes from a repository variable with the production URL
as default. This pings production read-only — it is the one standing exception, agreed when
the workflow is added.

**A SPA can be "up" and blank.** The host serves a perfect `index.html` while its JS bundle
404s (a half-finished deploy, a purged asset) — the visitor gets an empty page and a naive
check stays green. So the check asserts three things:

```bash
html=$(curl -fsS "$SITE_URL")
echo "$html" | grep -q "<title>[^<]*$BRAND"                        # 1. the right page
js=$(echo "$html" | grep -oE '/assets/index-[^"]+\.js' | head -1)
curl -fsS -o /dev/null "$SITE_URL$js"                             # 2. its bundle loads
[ -z "$HEALTH_URL" ] || curl -fsS -o /dev/null "$HEALTH_URL"      # 3. the backend answers (if any)
```

---

## Backups

Confirm the project's data (database, storage, CMS dataset) is backed up and where — and on a
free tier, check whether backups are included at all; if not, schedule a dump. Don't add a
second backup job if one already runs elsewhere — a redundant job that fails weekly is noise.

---

## Before calling a deploy done

- [ ] DSN in the host's build env, test error received with readable stack, test issue resolved
- [ ] No `.map` file in the deployed `dist/`
- [ ] Error boundaries and `RouteError` report through `reportError`
- [ ] `@sentry/react` appears ONLY inside `import()` in `src/lib/sentry.ts` (`grep -rn "@sentry/react" src`)
- [ ] Uptime workflow green on its first manual run
- [ ] Backups confirmed (not necessarily added)
