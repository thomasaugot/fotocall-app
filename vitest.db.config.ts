import { fileURLToPath, URL } from "node:url"
import { defineConfig, loadEnv } from "vite"

// Database access rules, against the LOCAL stack (`npx supabase start`). Never Cloud.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/supabase/**/*.test.ts"],
    env: loadEnv("test", process.cwd(), ""),
    testTimeout: 20_000,
    fileParallelism: false,
  },
})
