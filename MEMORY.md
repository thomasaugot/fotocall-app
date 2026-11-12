# Mi fotocall Memory

## Project
- Name: Mi fotocall
- Domain: Vercel — `*.vercel.app` until a custom domain is chosen (to confirm)
- Default locale: es
- Locales: es
- i18n enabled: yes — full 09-I18N setup with a single locale, ready for more

## Routes (canonical slugs in default language)
- / — home: welcome, guest name, take or upload a photo
- /galeria — gallery of every guest's photos
- * — 404

## Design System
Values live in `src/styles/theme.css` — never copy hex or sizes here, they drift.
- Font(s): Cormorant (display, title, heading) + Figtree (everything else) — loaded via
  @fontsource-variable — why: Cormorant carries the ceremony (engraved invitation feel),
  Figtree stays legible on a phone in a dim venue.
- Palette intent: ivory paper ground (bg/surface), antique gold = primary actions,
  olive leaf = secondary accents, sepia ink = text. `border-strong` = field edges and any UI
  part that needs 3:1. `border` (1.4:1) is decorative only — never the sole edge of a control.
- Contrast checked 2026-11-12: every text/status token ≥ 4.5:1 on bg, surface and surface-2;
  on-primary on primary 5.8:1 (hover 7.5:1); border-strong ≥ 3.3:1.
- Light theme only. Mobile first: guests arrive from a QR code on their phone.

## Foundations (layout, contexts, lib — not every component)
- [x] src/main.tsx
- [x] src/app/router.tsx
- [x] src/config/app.config.ts
- [x] src/vite-env.d.ts
- [x] src/globals.css
- [x] src/styles/theme.css
- [x] src/styles/base.css
- [x] src/styles/animations.css
- [x] src/styles/accessibility.css
- [x] src/components/layout/Providers.tsx
- [x] src/components/layout/PageLoader.tsx
- [x] src/components/layout/PageShell.tsx
- [x] src/components/layout/Navbar.tsx
- [x] src/components/layout/Footer.tsx
- [x] src/contexts/AppReadyContext.tsx
- [x] src/contexts/TransitionContext.tsx
- [x] src/contexts/ScrollContext.tsx
- [x] src/hooks/useAppReady.ts
- [x] src/hooks/usePageReady.ts
- [x] src/hooks/usePageTransition.ts
- [x] src/lib/gsap.ts
- [x] src/lib/lenis.ts
- [x] src/utils/animations/page-transitions.ts
- [x] src/components/ui/TransitionLink.tsx

## Opt-in components (only if this project asked for them — delete the rest)
- none requested

## Session Log
- 2026-11-12 — Bootstrapped project (01-BOOTSTRAP steps 0–7)
- 2026-11-12 — Home photocall: name (remembered on the phone), live camera (front/back), 3:4 capture, preview, library uploads, album peek
- 2026-11-12 — PWA (vite-plugin-pwa): manifest, icons, update prompt, offline banner, install button
- 2026-11-12 — 15-CHECKLIST audit over all files: clean (structure, flicker audit, primitives, navigation, focus rings, env, tsc, lint)
- 2026-11-12 — 14-PERFORMANCE: photos query live (30 s, paused when hidden), gallery data prefetched on hover, PageLoading + entrance replay, `npm run analyze`
- 2026-11-12 — 13-MONITORING: Sentry (lazy SDK, boundaries report, chunk reload), uptime and backup workflows

## Decisions
- 2026-11-12 — Backend security (11): photos table + private bucket in
  `supabase/migrations/20261112120000_photos.sql` (the source of truth, idempotent). Every guest
  reads the whole album; a guest inserts/deletes only their own rows and files (path
  `{uid}/{uuid}.webp|jpg`); nobody updates; 60 photos per guest; bucket 5 MB, webp/jpeg only.
  Tested on the LOCAL stack with `npm run test:db` (14 tests, two guests + no session; proven to
  go red when the delete policy is loosened).
- 2026-11-12 — JPEG allowed next to WebP — why: Safari's canvas cannot encode WebP (toBlob
  silently returns PNG). Re-encoding also strips EXIF/GPS from guests' photos.
- 2026-11-12 — Anonymous sign-in rate limit 200/h per IP — why: the whole party shares the venue
  wifi IP; the default 30 would lock guests out mid-event.
- 2026-11-12 — Name "Mi fotocall", folder `fotocall-app` — why: Thomas's brief.
- 2026-11-12 — Fonts, palette, routes and architecture chosen by Claude — why: Thomas asked
  Claude to design them; all can change later.
- 2026-11-12 — Spanish only, but 09-I18N set up in full (use-intl, locale route branches,
  routeTranslations, type-checked keys, parity test) — why: Thomas, "just in case it becomes
  bigger". Adding a language = add it to `locales` + a column in `routeTranslations` + a
  `src/locales/<code>/` folder with the same files; the parity test lists what is missing.
- 2026-11-12 — Light theme only, dark-mode section of 03-CSS_TOKENS deleted — why: a single
  ivory "invitation" look; no theme toggle needed for a one-day event.
- 2026-11-12 — Backend: Supabase Cloud (not Galabase) — why: Thomas confirmed.
- 2026-11-12 — Host: Vercel — why: Thomas confirmed. SPA fallback via `vercel.json` rewrites.
- 2026-11-12 — Installable PWA (vite-plugin-pwa) — why: "a simple PWA" in the brief.
- 2026-11-12 — Treated as a PRIVATE app for SEO (noindex, `Disallow: /`) — why: family photos,
  reached only through the QR code; nothing should be indexed.
- 2026-11-12 — Guests get a Supabase anonymous session — why: RLS needs `auth.uid()` for
  ownership (11-SECURITY); guests have no accounts. Name is stored on each photo row.
- 2026-11-12 — Photos in a PRIVATE bucket, path `{uid}/{id}.webp`, served with signed URLs,
  resized to WebP in the browser before upload — why: 11-SECURITY storage rules + 10-SEO
  "user uploads are resized before storage".

- 2026-11-12 — Monitoring (13): Sentry project `team-galaga-sl/fotocall-app` (region de) created
  via the Sentry MCP; alert "fotocall-app — new or regressed issue" emails team-galaga-sl at once.
  Weekly digest = Sentry's default weekly report to members. SDK loaded by `import()` only in
  `src/lib/sentry.ts`; everything else calls `reportError()` (RouteError, AppErrorBoundary,
  createRoot onUncaughtError). Source maps: hidden + uploaded + deleted only when the deploy build
  has `SENTRY_AUTH_TOKEN`; release = `GIT_SHA`.
- 2026-11-12 — Backups: `.github/workflows/backup.yml` daily (03:17 UTC) runs
  `scripts/backup-photos.mjs` → photos rows + every bucket file as a 90-day artifact — why:
  Supabase never backs up Storage files, and the free plan has no DB backups. Tested on the LOCAL
  stack with a TEST photo (file + row saved), never run against production.
- 2026-11-12 — Uptime: `.github/workflows/uptime.yml` every 10 min: title "Mi fotocall", its
  `/assets/index-*.js` loads, Supabase `/auth/v1/health` answers.

- 2026-11-12 — PWA offline scope: APP SHELL. The worker precaches the built app (HTML, JS, CSS,
  fonts, icons); photos (private signed URLs) and Supabase answers are never cached. Offline =
  the app opens, "Sin conexión" banner, gallery waits for the network. Update offered
  (registerType prompt, hourly check), never forced. `navigator.storage.persist()` after the
  anonymous sign-in. Icons from `public/assets/icons/source.svg` (`npx pwa-assets-generator`,
  then the maskable file renamed `maskable-512x512.png`, favicon moved to `public/`).

- 2026-11-12 — Captures are 3:4 portrait and mirrored for the selfie camera (what the guest saw);
  logic from the DosxDos convention app (`useCameraStream`, cover crop), without its filters and
  MediaPipe segmentation. The guest name lives in localStorage (`guest-name`).

- 2026-11-12 — Admin area `/admin` (URL only, not in the navbar): the admin is a REAL Supabase user
  (email + password), email in the public `VITE_ADMIN_EMAIL`, the login asks for the password only.
  Role = `app_metadata.role = 'admin'` (only the service role writes it); `public.is_admin()` in
  `supabase/migrations/20261112180000_admin.sql` lets admins delete any photo row and any file in
  the bucket; guests unchanged. Created by hand: `npm run admin:create` (env SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD; refuses non-local URLs without
  `--allow-cloud`). Dashboard: photos grid (select, delete with confirmation, download one, ZIP of
  all via `fflate`), QR (`qrcode`, colours from the `--color-text` / `--color-surface` tokens read at
  runtime, PNG 2048 px, SVG, print card), sign-out (cache cleared + full reload). `fflate` and
  `qrcode` are dynamic imports reached only from the lazy admin chunk. Tested on the LOCAL stack in
  `tests/supabase/admin.test.ts` (proven red when `is_admin()` is loosened, restored).
- 2026-11-12 — OPEN DECISION, auth: the plan said `enable_signup = false`, but on the local stack
  GoTrue then answers 422 `signup_disabled` to ANONYMOUS sign-ins too (guests would be locked out).
  So `enable_signup` stays true with the email provider ON: anyone can create an email account,
  which is a non-admin session worth no more than a guest's. Options for Thomas: (a) accept it,
  (b) a `before insert` trigger on `auth.users` that refuses non-anonymous users without
  `raw_app_meta_data.role = 'admin'`. The email sign-up refusal test is an `it.todo` until decided.

- 2026-11-12 — Dev = LOCAL Supabase: `.env.development.local` (gitignored) points `npm run dev` at
  the Docker stack, where `npm run seed:photos` puts 36 TEST photos. Cloud is only used by the
  deployed build. Delete that file to run dev against Cloud.
- 2026-11-12 — Look (after 5 rejections, see design-log): warm-white paper, midnight navy, fine gold
  ornaments; logo = chalice + Host; camera in an arched window; generous spacing; light only.

## Deviations from spec
- No visible "Reducir animaciones" toggle (05 layer 2): removed at Thomas's request 2026-11-12.
  The system `prefers-reduced-motion` setting is still honoured everywhere.
- Button gained variant `bare` and size `xl` (the camera shutter); Input accepts `ref` (react-hook-form).
- PWA: no unit test of UpdatePrompt (no DOM test setup: components are not unit-tested here);
  the install decision lives in `utils/install-prompt.ts` (tested). PWA E2E (`e2e/pwa.spec.ts`)
  runs only in CI's `pwa` job on a production build (never built locally).
- E2E tall-home trick keys on the rendered `<main> h1`, not the URL: keyed on the URL it shrank
  the page before React swapped it and WebKit saved a clamped scroll (flaky back-restore, fixed).
- Deploy needs `checks` only (Thomas's global rule), so the `backend` (RLS) job reports
  alongside like E2E instead of blocking as the 12 table says.
- E2E navigation tests make HOME artificially tall (init script + `data-e2e-path` style) so
  long→short landing and back-restore are tested before the pages have real content. Touch
  projects (no wheel in mobile WebKit, no Lenis) scroll with a native `scrollBy`.
- CSP lives in `vercel.json` (Vercel has no `_headers`). The inline-script hash cannot be written
  by the build there, so `tests/csp.test.ts` recomputes it from index.html on every `npm test`
  and fails with the new hash if they differ: never silently broken.
- `Permissions-Policy` keeps `camera=(self)` (guests take photos); microphone/geolocation off.
- RLS tests run with `npm run test:db` (vitest.db.config.ts, `.env.test` → local stack) and are
  excluded from `npm test`, so the unit suite and the Stop hook never need Docker.
- `PageMeta` takes a `namespace` (home | gallery | notFound | routeError) instead of a
  `routeKey`, so the 404 and error pages get their own title too. Keys: `<namespace>.meta.*`.
- index.html's static `<title>` carries `data-prerendered` so main.tsx removes it before render
  (10-SEO); otherwise the first <title> wins and document.title never follows the page.
- The 404 and route-error copy live in `common.json` (`notFound`, `routeError`), not in page files.
- Missing-message handlers (`onError`, `getMessageFallback`) live in `utils/intl-handlers.ts`
  (tested) and are passed to `IntlProvider` in RootLayout.
- MotionPreferenceProvider mirrors the effective preference on `<html data-motion>`, read by
  `utils/reduced-motion.ts`, so GSAP files outside React (page transitions) honour the app
  toggle too. With reduced motion the page change is a short crossfade with no movement.
- The visible motion toggle (05 layer 2) is `ui/MotionToggle.tsx`, in the Footer.
- `SkipLink` hides off-screen with a transform, not `sr-only` + `focus:not-sr-only`: `.sr-only`
  in accessibility.css is unlayered CSS and a layered Tailwind utility can never override it.
- Semantic text classes in base.css are unlayered, so they beat colour utilities on the same
  element (`text-body text-primary` renders text colour). Put the colour on an inner span or use
  `.text-button`/`.text-wordmark`, which set no colour.
- `announce()` lives in `src/utils/announce.ts`, not inside LiveRegion.tsx (react-refresh wants
  component files to export components only).
- Added to base.css: `.text-button`, `.text-wordmark`, `.z-nav/.z-loader/.z-skip`,
  `dialog::backdrop`; to theme.css: `--z-nav 100`, `--z-loader 110`, `--z-skip 120`.
- The transition hook is `usePageTransition()` (rule text: `useTransition()`) so it never
  shadows React's own `useTransition`.
- `useGSAPAnimations(factory, deps)` returns the component's root ref and keys its effect on
  appReady + pathname + a string of `deps` (lint rejects a spread deps array); the factory is
  read through `useEffectEvent`, so it always sees the latest props.
- `npm create vite@latest` ran in the scratchpad and was copied in, because the project folder
  already held `.claude/` (the template must not touch it). Same files as running it in place.
- `.text-display`, `.text-title`, `.text-heading` set `font-family: var(--font-display)` in
  base.css, on top of the 03 template — the serif is only for those three.
- `--color-border-strong` and `--font-display` added to the 03 token set.

- Admin: `AdminMeta` (in `pages/admin/`) renders title/description instead of `PageMeta`, because
  `PageMeta`'s namespace union lives in `components/layout/` (off limits during the redesign):
  fold it into `PageMeta` once the layout is free. `Checkbox` primitive built (07).
- E2E for `/admin` mocks the auth endpoints with a guest session (so it shows the login); the
  dashboard has its own spec `e2e/admin.spec.ts` with a stored admin session.

## Known issues / TODO
- PLACEHOLDERS on the home page: `home.json` → `occasion` ("Primera Comunión de Lucas") and `date` ("16 de mayo de 2027"). Replace with the real child's name and date from Thomas.
- Cloud: push the admin migration, set auth config (email provider on, signup off if decided),
  create the admin with `npm run admin:create -- --allow-cloud`, set VITE_ADMIN_EMAIL in Vercel:
  needs Thomas's OK (nothing done on Cloud).
- Seed/clean the gallery with stock photos: `npm run seed:photos` / `npm run seed:clean` (env `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `npx supabase status -o env`). Local stack only; Cloud needs Thomas's explicit OK and `--allow-cloud`.
- 10-SEO applied as a PRIVATE app: `noindex, nofollow` in index.html, static
  `public/robots.txt` (Disallow: /), no sitemap, no JSON-LD, no prerendered heads, no tsx script.
  Still to apply when the features land: Media rules for the photo grid (width/height on every
  <img>, lazy below the fold, uploads resized to WebP before storage). No email templates: guests
  sign in anonymously, nothing is emailed.
- A failure in a locale branch's loader (messages chunk) has no errorElement above it, because
  RouteError needs the messages. The `vite:preloadError` reload (13) and AppErrorBoundary (13)
  cover it.
- Accessibility verified 2026-11-12 (throwaway Playwright + axe, WCAG 2.2 AA tags, 390 and 1440):
  0 violations on /, /galeria, /nope; first Tab = skip link, Enter focuses <main>; motion toggle
  persists across reload. Re-run on every new screen (moves into e2e/ with 12-TESTING_CI).
- Home and gallery render only their
  `<h1>` until they are designed (they need the data layer first).
- Primitives not built because nothing in the app needs them yet: Dropdown, Checkbox,
  CalendarPicker (07). Build them from 07 the day a screen needs one.
- Navbar has no mobile menu and no `data-nav-theme` detection: two links fit on one line at
  390px and every page is on the light ground. Add both if a dark section or a third link appears.
- Tests (12) in place, all green twice in a row 2026-11-12: `npm test` (71 unit),
  `npm run test:db` (14 RLS, local stack), `npm run test:e2e` (58 on 7 devices: smoke per route,
  12-hop long→short landing at top, back restores scroll, deep link + 404, breakpoint switch
  without reload, axe in Chromium). Not yet: visual baselines (`npm run test:visual
  -- --update-snapshots` once the pages are designed), header/CSP spec (needs PREVIEW_URL).
- Monitoring still needs, for the first deploy: Vercel production env `VITE_SENTRY_DSN`
  (https://964393d88e56901128712524c956636f@o4512402963103744.ingest.de.sentry.io/4512419731275856);
  GitHub secrets `SENTRY_AUTH_TOKEN` (Sentry org token, project:releases) and
  `SUPABASE_SERVICE_ROLE_KEY` (backup); GitHub variables `SITE_URL` and `SUPABASE_PUBLISHABLE_KEY`
  (uptime). Then: test error from the live console, check readable stack, resolve it; run uptime
  and backup once by hand.
- `npm run test:db` leaves its rows (no files) in the local DB: run `supabase db reset` before
  using the local stack for anything else (CI already does).
- To make CI deploy: GitHub secrets VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, and the
  Vercel project's env VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY (production + preview).
- The app throws at boot without `.env.local` (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY`) — by design (01 Step 3b). Copy `.env.example`.
- Supabase CLOUD (`jzhysqrbcnmekikbhyou`, "Photocall App") set up 2026-11-12 with Thomas's OK:
  photos migration pushed (`db push --remote`), private `photos` bucket confirmed; auth patched via
  the Management API (anonymous ON, email OFF, anon rate limit 200, min password 10). NOT pushed
  with `config push` on purpose: it would send the local site_url. Site URL still
  localhost:3000 on Cloud: set it to the Vercel URL once known (no emails/redirects use it today).
- Structure check warns on `tests/csp.test.ts` and `tests/supabase/rls.test.ts` (no `src/`
  twin): expected, they cover vercel.json/index.html and supabase/migrations.
- PWA still to check on real phones after the first deploy: install on Android Chrome + iOS Safari, update prompt on a new deploy, maskable icon on maskable.app.
- Production URL to confirm once the Vercel project exists.
