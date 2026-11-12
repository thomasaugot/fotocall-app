// Shared by seed-photos.mjs and clean-seed-photos.mjs: env check, local-only guard, cleanup.
// Uses the service-role key (bypasses RLS): from the environment only, never a file, never VITE_.
import { createClient } from "@supabase/supabase-js"

export const NAME_PREFIX = "TEST - "
export const EMAIL_RE = /^test-guest-\d+@example\.test$/
const BUCKET = "photos"

export function connect() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
  const host = new URL(url).hostname
  const isLocal = host === "127.0.0.1" || host === "localhost"
  if (!isLocal && !process.argv.includes("--allow-cloud")) {
    throw new Error(`Refusing to run against ${url}: not local. Cloud needs Thomas's explicit OK, then --allow-cloud.`)
  }
  console.log(`Target: ${url}`)
  return createClient(url, key, { auth: { persistSession: false } })
}

async function listTestUsers(supabase) {
  const found = []
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw new Error(`listUsers failed: ${error.message}`)
    found.push(...data.users.filter((u) => EMAIL_RE.test(u.email ?? "")))
    if (data.users.length < 200) return found
  }
}

// Removes ONLY what the seed made: TEST - rows, their files, and test-guest-N@example.test users.
export async function removeSeed(supabase) {
  const users = await listTestUsers(supabase)
  const ids = new Set(users.map((u) => u.id))

  const { data: rows, error } = await supabase.from("photos").select("owner_id, storage_path").like("guest_name", `${NAME_PREFIX}%`)
  if (error) throw new Error(`photos query failed: ${error.code}`)
  const paths = new Set(rows.map((r) => r.storage_path))
  rows.forEach((r) => ids.add(r.owner_id))

  // Files left in a test user's folder (e.g. a half-finished seed) go too.
  for (const u of users) {
    const { data: files } = await supabase.storage.from(BUCKET).list(u.id, { limit: 1000 })
    for (const f of files ?? []) paths.add(`${u.id}/${f.name}`)
  }
  const all = [...paths]
  for (let i = 0; i < all.length; i += 100) {
    const { error: rmError } = await supabase.storage.from(BUCKET).remove(all.slice(i, i + 100))
    if (rmError) throw new Error(`storage remove failed: ${rmError.message}`)
  }

  const { error: delError } = await supabase.from("photos").delete().like("guest_name", `${NAME_PREFIX}%`)
  if (delError) throw new Error(`photos delete failed: ${delError.code}`)

  for (const u of users) {
    const { error: userError } = await supabase.auth.admin.deleteUser(u.id)
    if (userError) throw new Error(`deleteUser failed: ${userError.message}`)
  }
  return { rows: rows.length, files: all.length, users: users.length }
}
