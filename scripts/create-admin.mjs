// Creates (or updates) the admin user: confirmed, app_metadata.role = "admin". The admin signs in
// with a magic link; the account gets a long random password nobody knows (ADMIN_PASSWORD only
// for tests). Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL. Nothing is written to a file.
// Refuses a non-local URL unless --allow-cloud (Cloud needs Thomas's explicit OK).
import { randomBytes } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

const MIN_PASSWORD = 10

export const checkEnv = (env, argv) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = env
  if (!url || !key || !email) {
    throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL must be set.")
  }
  const host = new URL(url).hostname
  const isLocal = host === "127.0.0.1" || host === "localhost"
  if (!isLocal && !argv.includes("--allow-cloud")) {
    throw new Error(`Refusing to run against ${url}: not local. Cloud needs Thomas's explicit OK, then --allow-cloud.`)
  }
  if (password && password.length < MIN_PASSWORD) throw new Error(`ADMIN_PASSWORD must have at least ${MIN_PASSWORD} characters.`)
  return { url, key, email, password: password || randomBytes(32).toString("base64url") }
}

const findByEmail = async (supabase, email) => {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw new Error(`listUsers failed: ${error.message}`)
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (found || data.users.length < 200) return found
  }
}

const main = async () => {
  const { url, key, email, password } = checkEnv(process.env, process.argv)
  console.log(`Target: ${url}`)
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const attributes = { email, password, email_confirm: true, app_metadata: { role: "admin" } }

  const existing = await findByEmail(supabase, email)
  const { error } = existing
    ? await supabase.auth.admin.updateUserById(existing.id, attributes)
    : await supabase.auth.admin.createUser(attributes)
  if (error) throw new Error(`${existing ? "update" : "create"} failed: ${error.message}`)
  console.log(`${existing ? "Updated" : "Created"} admin ${email}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
