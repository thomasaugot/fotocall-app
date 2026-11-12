import { loadEnv } from "vite"

// Abort before any test if the app would talk to anything but the LOCAL backend.
export default function globalSetup() {
  const url = loadEnv("test", process.cwd(), "").VITE_SUPABASE_URL ?? ""
  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(url)) {
    throw new Error(`E2E runs against the LOCAL backend only (.env.test), got "${url}"`)
  }
}
