/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_SENTRY_DSN?: string
}

interface Window {
  /** Set by PageLoader when its exit finishes — E2E waits on it (12-TESTING_CI). */
  __loadingComplete?: boolean
}
