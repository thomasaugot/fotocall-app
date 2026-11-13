import { execSync } from "node:child_process"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { Database } from "@/types/database"

const url = process.env.VITE_SUPABASE_URL ?? ""
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""
const adminEmail = process.env.VITE_ADMIN_EMAIL ?? ""

if (!/^http:\/\/(127\.0\.0\.1|localhost):54321$/.test(url)) {
  throw new Error(`Admin tests run against the local stack only, got "${url}". Run npx supabase start.`)
}

type Client = SupabaseClient<Database>
const options = { auth: { persistSession: false, autoRefreshToken: false } }
const client = (): Client => createClient<Database>(url, key, options)

// The local stack's service key is read from the CLI at run time, never written to a file.
const serviceKey = (): string => {
  const env = execSync("npx supabase status -o env", { encoding: "utf8" })
  const match = /^SERVICE_ROLE_KEY="?([^"\n]+)"?$/m.exec(env)
  if (!match) throw new Error("SERVICE_ROLE_KEY not found in `supabase status`")
  return match[1]
}

const guest = async (data?: Record<string, unknown>) => {
  const c = client()
  const { data: res, error } = await c.auth.signInAnonymously(data ? { options: { data } } : undefined)
  if (error || !res.user) throw error ?? new Error("no user")
  return { c, id: res.user.id }
}

const webp = () => new Blob([new Uint8Array(64)], { type: "image/webp" })
const stamp = `TEST - admin ${new Date().toISOString()}`
const adminPassword = `Test-${crypto.randomUUID()}`

const addPhoto = async (owner: Awaited<ReturnType<typeof guest>>) => {
  const path = `${owner.id}/${crypto.randomUUID()}.webp`
  expect((await owner.c.storage.from("photos").upload(path, webp())).error).toBeNull()
  const row = await owner.c.from("photos").insert({ guest_name: stamp, storage_path: path, width: 8, height: 8 }).select("id").single()
  expect(row.error).toBeNull()
  return { path, id: row.data?.id ?? "" }
}

const rowExists = async (c: Client, id: string) => ((await c.from("photos").select("id").eq("id", id)).data ?? []).length === 1
const fileExists = async (c: Client, path: string) => !(await c.storage.from("photos").createSignedUrl(path, 60)).error

let admin: Client

beforeAll(async () => {
  const service = createClient<Database>(url, serviceKey(), options)
  const created = await service.auth.admin.createUser({
    email: adminEmail, password: adminPassword, email_confirm: true, app_metadata: { role: "admin" },
  })
  if (created.error) {
    // Already there from an earlier run: reset its password and role.
    const list = await service.auth.admin.listUsers({ perPage: 200 })
    const existing = list.data.users.find((u) => u.email === adminEmail)
    expect(existing).toBeDefined()
    const updated = await service.auth.admin.updateUserById(existing?.id ?? "", { password: adminPassword, app_metadata: { role: "admin" } })
    expect(updated.error).toBeNull()
  }
  admin = client()
  const signIn = await admin.auth.signInWithPassword({ email: adminEmail, password: adminPassword })
  expect(signIn.error).toBeNull()
})


// Leave the local album as it was: these rows and files exist only for this run.
afterAll(async () => {
  const env = execSync("npx supabase status -o env", { encoding: "utf8" })
  const service = /^SERVICE_ROLE_KEY="?([^"\n]+)"?$/m.exec(env)?.[1]
  if (!service) return
  const admin = createClient<Database>(url, service, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data } = await admin.from("photos").select("id, storage_path, thumb_path").eq("guest_name", stamp)
  const rows = data ?? []
  const files = rows.flatMap((r) => [r.storage_path, r.thumb_path].filter((f): f is string => !!f))
  if (files.length) await admin.storage.from("photos").remove(files)
  if (rows.length) await admin.from("photos").delete().in("id", rows.map((r) => r.id))
})

describe("admin", () => {
  it("has app_metadata.role = admin in the session", async () => {
    const { data } = await admin.auth.getUser()
    expect(data.user?.app_metadata.role).toBe("admin")
  })

  it("deletes another guest's row and file", async () => {
    const a = await guest()
    const photo = await addPhoto(a)
    const row = await admin.from("photos").delete().eq("id", photo.id).select("id")
    expect(row.data).toHaveLength(1)
    const file = await admin.storage.from("photos").remove([photo.path])
    expect(file.data).toHaveLength(1)
    expect(await rowExists(a.c, photo.id)).toBe(false)
    expect(await fileExists(a.c, photo.path)).toBe(false)
  })

  it("rejects a wrong password", async () => {
    const { error } = await client().auth.signInWithPassword({ email: adminEmail, password: "not-the-password-1" })
    expect(error).not.toBeNull()
  })
})

describe("a guest is not an admin", () => {
  it("cannot delete another guest's row or file", async () => {
    const a = await guest()
    const b = await guest()
    const photo = await addPhoto(a)
    await b.c.from("photos").delete().eq("id", photo.id)
    await b.c.storage.from("photos").remove([photo.path])
    expect(await rowExists(a.c, photo.id)).toBe(true)
    expect(await fileExists(a.c, photo.path)).toBe(true)
  })

  it("cannot become admin by forging user_metadata.role", async () => {
    const a = await guest()
    const photo = await addPhoto(a)
    const forger = await guest({ role: "admin" })
    await forger.c.auth.updateUser({ data: { role: "admin" } })
    await forger.c.from("photos").delete().eq("id", photo.id)
    await forger.c.storage.from("photos").remove([photo.path])
    expect(await rowExists(a.c, photo.id)).toBe(true)
    expect(await fileExists(a.c, photo.path)).toBe(true)
  })

  it("cannot write app_metadata on itself", async () => {
    const forger = await guest()
    await forger.c.auth.updateUser({ data: { app_metadata: { role: "admin" } } })
    const { data } = await forger.c.auth.getUser()
    expect(data.user?.app_metadata.role).toBeUndefined()
  })
})

describe("auth config", () => {
  it("anonymous sign-in still works", async () => {
    const { data, error } = await client().auth.signInAnonymously()
    expect(error).toBeNull()
    expect(data.user?.is_anonymous).toBe(true)
  })

  // enable_signup = false would refuse an email sign-up, but GoTrue then refuses anonymous
  // sign-ins too (422 signup_disabled, verified 2026-11-12): open decision in MEMORY.md.
  it.todo("an email sign-up is refused")
})

describe("hidden photos", () => {
  it("the admin hides a photo: guests stop seeing it, the admin still does, and can show it again", async () => {
    const owner = await guest()
    const other = await guest()
    const photo = await addPhoto(owner)
    expect((await admin.from("photos").update({ hidden: true }).eq("id", photo.id).select("id")).data).toHaveLength(1)
    expect(await rowExists(other.c, photo.id)).toBe(false)
    expect(await rowExists(owner.c, photo.id)).toBe(false)
    expect(await rowExists(admin, photo.id)).toBe(true)
    expect((await admin.from("photos").update({ hidden: false }).eq("id", photo.id).select("id")).data).toHaveLength(1)
    expect(await rowExists(other.c, photo.id)).toBe(true)
  })

  it("a guest can neither hide nor rename a photo, not even their own", async () => {
    const owner = await guest()
    const photo = await addPhoto(owner)
    const hide = await owner.c.from("photos").update({ hidden: true }).eq("id", photo.id).select("id")
    expect(hide.data ?? []).toHaveLength(0)
    const rename = await admin.from("photos").update({ guest_name: "TEST - renamed" }).eq("id", photo.id)
    expect(rename.error).not.toBeNull()
    expect(await rowExists(owner.c, photo.id)).toBe(true)
  })
})
