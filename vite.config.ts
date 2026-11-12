import { fileURLToPath, URL } from "node:url"
import { configDefaults } from "vitest/config"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { visualizer } from "rollup-plugin-visualizer"

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

// `npm run analyze`: opens the bundle treemap. Look before adding any dependency over ~20 KB (14).
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), ...sentryUpload,
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
