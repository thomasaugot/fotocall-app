const required = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`${name} is not set. Copy .env.example to .env.local.`)
  return value
}

export const appConfig = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  // Optional by design: no DSN = no error reporting (dev, tests, CI). Public: a DSN only accepts events.
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || undefined,
  // Sentry's `environment`: the deployed origin tells production from a preview URL.
  siteUrl: globalThis.location?.origin ?? "",
  // Dates format in the event's zone, never the visitor's device zone (09-I18N).
  timeZone: "Europe/Madrid",
  // Public on purpose: the admin login asks for the password only. Empty = sign-in always fails.
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || undefined,
  supabaseUrl: required("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL),
  supabaseKey: required("VITE_SUPABASE_PUBLISHABLE_KEY", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
} as const
