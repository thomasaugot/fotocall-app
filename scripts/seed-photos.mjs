// Seeds the album with stock photos (Unsplash, fixed ids, checked by eye) from 8 "TEST - " guests so the
// gallery design can be judged with realistic content. Re-running removes the previous seed first.
// Local stack only unless --allow-cloud (Thomas's explicit OK). Remove with scripts/clean-seed-photos.mjs.
//   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/seed-photos.mjs
import { randomUUID } from "node:crypto"
import { connect, removeSeed } from "./seed-common.mjs"

const GUESTS = [
  ["TEST - Abuela Carmen", 8],
  ["TEST - Tío Javi", 1],
  ["TEST - Lucía", 6],
  ["TEST - Marcos", 2],
  ["TEST - Paula", 7],
  ["TEST - Primo Nacho", 3],
  ["TEST - Marta", 1],
  ["TEST - Sofía", 8],
] // 36 photos

// Fixed Unsplash photo ids: tables, flowers, families, guests, sparklers. Looked at one by one
// (picsum.photos was down); same list every run, so the result is stable.
const IDS = [
  "1511795409834-ef04bbd61622", "1530103862676-de8c9debad1d", "1464366400600-7168b8af9bc3",
  "1519741497674-611481863552", "1529156069898-49953e39b3ac", "1511632765486-a01980e01a18",
  "1503454537195-1dcabb73ffb9", "1490750967868-88aa4486c946", "1487070183336-b863922373d4",
  "1513151233558-d860c5398176", "1527529482837-4698179dc6ce", "1544005313-94ddf0286df2",
  "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80", "1500648767791-00dcc994a43e",
  "1494790108377-be9c29b29330", "1534528741775-53994a69daeb", "1517841905240-472988babdf9",
  "1524504388940-b1c1722653e1", "1488426862026-3ee34a7d66df", "1506794778202-cad84cf45f1d",
  "1531746020798-e6953c6e8e04", "1476703993599-0035a21b17a9", "1467810563316-b5476525c0f9",
  "1414235077428-338989a2e8c0", "1555244162-803834f70033", "1465495976277-4387d4b0b4c6",
  "1469371670807-013ccf25f16a", "1535254973040-607b474cb50d", "1478146896981-b80fe463b330",
  "1502086223501-7ea6ecd79368", "1519699047748-de8e457a634e", "1515488042361-ee00e0ddd4e4",
  "1543610892-0b1f7e6d8ac1", "1522673607200-164d1b6ce486", "1478145046317-39f10e56b5e9",
]
const SIZES = { portrait: [1080, 1440], landscape: [1440, 1080], square: [1080, 1080] }
const LANDSCAPE = new Set([5, 13, 21, 29])
const SQUARE = new Set([9, 25])
const MAX_BYTES = 5 * 1024 * 1024

const supabase = connect()
const removed = await removeSeed(supabase)
if (removed.rows || removed.users) console.log(`Previous seed removed (${removed.rows} rows).`)

const guests = []
for (const [i, [name, count]] of GUESTS.entries()) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: `test-guest-${i + 1}@example.test`,
    email_confirm: true,
    password: randomUUID() + randomUUID(),
  })
  if (error) throw new Error(`createUser failed: ${error.message}`)
  guests.push({ id: data.user.id, name, count })
}

// One slot per photo, owners interleaved with a fixed shuffle (not Math.random: stable runs).
const ordered = guests.flatMap((g) => Array.from({ length: g.count }, () => g))
const slots = ordered
  .map((guest, n) => ({ guest, key: (n * 7919) % 97 }))
  .sort((a, b) => a.key - b.key)
  .map((s) => s.guest)

const now = Date.now()
const span = 4 * 60 * 60_000
const total = slots.length

async function download(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { redirect: "follow" })
    if (res.ok) return Buffer.from(await res.arrayBuffer())
    if (attempt === 3) throw new Error(`download failed (${res.status}): ${url}`)
    await new Promise((r) => setTimeout(r, attempt * 2000))
  }
}

for (const [i, guest] of slots.entries()) {
  const shape = LANDSCAPE.has(i) ? "landscape" : SQUARE.has(i) ? "square" : "portrait"
  const [width, height] = SIZES[shape]
  const bytes = await download(`https://images.unsplash.com/photo-${IDS[i]}?w=${width}&h=${height}&fit=crop&q=80&fm=jpg`)
  if (bytes.length > MAX_BYTES) throw new Error(`photo ${IDS[i]} is over 5 MB`)

  const path = `${guest.id}/${randomUUID()}.jpg`
  const { error: upError } = await supabase.storage.from("photos").upload(path, bytes, { contentType: "image/jpeg" })
  if (upError) throw new Error(`upload failed: ${upError.message}`)

  // Newest first: slot 0 is the most recent, the last one ~4 h ago, with a few minutes of jitter.
  const created = new Date(now - (i / total) * span - ((i * 37) % 5) * 60_000).toISOString()
  const { error: rowError } = await supabase
    .from("photos")
    .insert({ owner_id: guest.id, guest_name: guest.name, storage_path: path, width, height, created_at: created })
  if (rowError) throw new Error(`insert failed: ${rowError.code}`)
}

console.log(`Seeded ${total} photos from ${guests.length} TEST guests over the last 4 h.`)
