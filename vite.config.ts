import { fileURLToPath, URL } from "node:url"
import { configDefaults } from "vitest/config"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { visualizer } from "rollup-plugin-visualizer"
import { VitePWA } from "vite-plugin-pwa"

import babel from "@rolldown/plugin-babel"
import { reactCompilerPreset } from "@vitejs/plugin-react"

// Source maps ONLY when they can be uploaded (13-MONITORING): CI's deploy build has the token, so
// maps are made "hidden", uploaded for release GIT_SHA, then deleted. No token = no maps at all.
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const sentryUpload = sentryAuthToken
  ? [sentryVitePlugin({
      org: "team-galaga-sl",
      project: "fotocall-app",
      url: "https://de.sentry.io",
      authToken: sentryAuthToken,
      release: { name: process.env.GIT_SHA },
      sourcemaps: { filesToDeleteAfterUpload: ["./dist/**/*.map"] },
    })]
  : []

// Offline scope: APP SHELL (MEMORY.md). The worker precaches the built app only: photos are
// private signed URLs and the database answers per guest, so neither is ever cached on disk.
// Hex is literal in the manifest only: it cannot read theme.css (--color-bg / --color-primary).
const pwa = VitePWA({
  registerType: "prompt",
  injectRegister: false,
  manifest: {
    id: "/",
    name: "Mi fotocall",
    short_name: "Mi fotocall",
    description: "Haz o sube tus fotos del día y firma con tu nombre.",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f8f6",
    theme_color: "#f8f8f6",
    icons: [
      { src: "/assets/icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/assets/icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/assets/icons/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,woff2,svg,png,ico}"],
    navigateFallback: "/index.html",
    navigateFallbackDenylist: [/\/[^/?]+\.[a-z0-9]+$/i],
    cleanupOutdatedCaches: true,
  },
  devOptions: { enabled: false },
})

// `npm run analyze`: opens the bundle treemap. Look before adding any dependency over ~20 KB (14).
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), pwa, ...sentryUpload,
    ...(mode === "analyze" ? [visualizer({ open: true, gzipSize: true, filename: "dist/stats.html" })] : []),
  ],
  build: { sourcemap: sentryAuthToken ? "hidden" : false },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  // RLS / storage tests need the LOCAL Supabase stack: they run with `npm run test:db` only.
  test: {
    exclude: [...configDefaults.exclude, "tests/supabase/**", "e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
}))
