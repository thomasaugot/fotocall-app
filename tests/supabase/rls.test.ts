import { execSync } from "node:child_process"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { Database } from "@/types/database"

const url = process.env.VITE_SUPABASE_URL ?? ""
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""

// Abort before a single request if this is not the LOCAL stack (12-TESTING_CI).
if (!/^http:\/\/(127\.0\.0\.1|localhost):54321$/.test(url)) {
  throw new Error(`RLS tests run against the local stack only, got "${url}". Run npx supabase start.`)
}

type Client = SupabaseClient<Database>
const client = (): Client =>
  createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const guest = async () => {
  const c = client()
  const { data, error } = await c.auth.signInAnonymously()
  if (error || !data.user) throw error ?? new Error("no user")
  return { c, id: data.user.id }
}

const webp = (bytes = 64) => new Blob([new Uint8Array(bytes)], { type: "image/webp" })
const stamp = `TEST - rls ${new Date().toISOString()}`

let a: Awaited<ReturnType<typeof guest>>
let b: Awaited<ReturnType<typeof guest>>
let aPath: string
let aPhotoId: string

beforeAll(async () => {
  a = await guest()
  b = await guest()
  aPath = `${a.id}/${crypto.randomUUID()}.webp`
  const upload = await a.c.storage.from("photos").upload(aPath, webp())
  expect(upload.error).toBeNull()
  const insert = await a.c.from("photos")
    .insert({ guest_name: stamp, storage_path: aPath, width: 800, height: 600 })
    .select("id").single()
  expect(insert.error).toBeNull()
  aPhotoId = insert.data?.id ?? ""
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

describe("anonymous visitor (no session)", () => {
  it("reads nothing", async () => {
    const { data } = await client().from("photos").select("id")
    expect(data ?? []).toEqual([])
  })

  it("cannot insert a row", async () => {
    const { error } = await client().from("photos")
      .insert({ guest_name: stamp, storage_path: `x/${crypto.randomUUID()}.webp`, width: 1, height: 1 })
    expect(error).not.toBeNull()
  })

  it("cannot upload a file", async () => {
    const { error } = await client().storage.from("photos").upload(`x/${crypto.randomUUID()}.webp`, webp())
    expect(error).not.toBeNull()
  })

  it("cannot sign a URL to someone's photo", async () => {
    const { error } = await client().storage.from("photos").createSignedUrl(aPath, 60)
    expect(error).not.toBeNull()
  })
})

describe("guest B against guest A's photo", () => {
  it("sees it in the shared album and can open it", async () => {
    const { data } = await b.c.from("photos").select("id").eq("id", aPhotoId)
    expect(data).toHaveLength(1)
    const signed = await b.c.storage.from("photos").createSignedUrl(aPath, 60)
    expect(signed.error).toBeNull()
  })

  it("cannot rename it", async () => {
    const { data } = await b.c.from("photos").update({ guest_name: "hacked" }).eq("id", aPhotoId).select("id")
    expect(data ?? []).toEqual([])
  })

  it("cannot delete the row", async () => {
    await b.c.from("photos").delete().eq("id", aPhotoId)
    const { data } = await a.c.from("photos").select("id").eq("id", aPhotoId)
    expect(data).toHaveLength(1)
  })

  it("cannot delete or overwrite the file", async () => {
    await b.c.storage.from("photos").remove([aPath])
    const overwrite = await b.c.storage.from("photos").upload(aPath, webp(), { upsert: true })
    expect(overwrite.error).not.toBeNull()
    const still = await a.c.storage.from("photos").createSignedUrl(aPath, 60)
    expect(still.error).toBeNull()
  })

  it("cannot write a row as A or point a row at A's folder", async () => {
    const asA = await b.c.from("photos")
      .insert({ owner_id: a.id, guest_name: stamp, storage_path: `${a.id}/${crypto.randomUUID()}.webp`, width: 1, height: 1 })
    expect(asA.error).not.toBeNull()
    const intoA = await b.c.from("photos")
      .insert({ guest_name: stamp, storage_path: `${a.id}/${crypto.randomUUID()}.webp`, width: 1, height: 1 })
    expect(intoA.error).not.toBeNull()
  })

  it("cannot upload into A's folder", async () => {
    const { error } = await b.c.storage.from("photos").upload(`${a.id}/${crypto.randomUUID()}.webp`, webp())
    expect(error).not.toBeNull()
  })
})

describe("the bucket enforces type and size", () => {
  it("rejects a PNG", async () => {
    const png = new Blob([new Uint8Array(64)], { type: "image/png" })
    const { error } = await b.c.storage.from("photos").upload(`${b.id}/${crypto.randomUUID()}.png`, png)
    expect(error).not.toBeNull()
  })

  it("rejects a file over 5 MB", async () => {
    const { error } = await b.c.storage.from("photos").upload(`${b.id}/${crypto.randomUUID()}.webp`, webp(5 * 1024 * 1024 + 1))
    expect(error).not.toBeNull()
  })
})

describe("one guest is capped at 60 photos", () => {
  it("refuses the 61st row", async () => {
    const c = await guest()
    const rows = Array.from({ length: 60 }, () => ({
      guest_name: stamp, storage_path: `${c.id}/${crypto.randomUUID()}.webp`, width: 1, height: 1,
    }))
    expect((await c.c.from("photos").insert(rows)).error).toBeNull()
    const extra = await c.c.from("photos")
      .insert({ guest_name: stamp, storage_path: `${c.id}/${crypto.randomUUID()}.webp`, width: 1, height: 1 })
    expect(extra.error).not.toBeNull()
  })
})

describe("guest A on their own photo", () => {
  it("deletes the file and the row", async () => {
    const file = await a.c.storage.from("photos").remove([aPath])
    expect(file.error).toBeNull()
    expect(file.data).toHaveLength(1)
    const row = await a.c.from("photos").delete().eq("id", aPhotoId).select("id")
    expect(row.data).toHaveLength(1)
  })
})
