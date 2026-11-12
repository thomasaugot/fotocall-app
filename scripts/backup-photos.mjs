// Backs up the album: every photos row (photos.json) and every file in the private bucket.
// Supabase's own backups never include Storage files, and the free plan has none at all
// (13-MONITORING → Backups). Runs in CI only, with the service-role key from a GitHub secret:
// that key bypasses RLS and never goes near src/ or a VITE_ variable (11-SECURITY).
//   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/backup-photos.mjs <out-dir>
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join, resolve, sep } from "node:path"
import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
const out = resolve(process.argv[2] ?? "backup")

const supabase = createClient(url, key, { auth: { persistSession: false } })

const { data: rows, error } = await supabase.from("photos").select("*").order("created_at")
if (error) throw new Error(`photos query failed: ${error.code}`)

await mkdir(out, { recursive: true })
await writeFile(join(out, "photos.json"), JSON.stringify(rows, null, 2))

let failed = 0
for (const row of rows) {
  const target = resolve(out, "files", row.storage_path)
  if (!target.startsWith(resolve(out, "files") + sep)) throw new Error("storage path escapes the backup folder")
  const { data: blob, error: downloadError } = await supabase.storage.from("photos").download(row.storage_path)
  if (downloadError || !blob) {
    failed++
    console.error(`missing file for photo ${row.id}`)
    continue
  }
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await blob.arrayBuffer()))
}

console.log(`${rows.length} photos, ${rows.length - failed} files saved to ${out}`)
if (failed) process.exit(1)
