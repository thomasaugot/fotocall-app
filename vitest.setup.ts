// Abort before a single unit test if the configured backend is not a local/test one (12-TESTING_CI).
const url = import.meta.env.VITE_SUPABASE_URL ?? ""
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(url)) {
  throw new Error(`Tests run against the LOCAL backend only (.env.test), got "${url}"`)
}
