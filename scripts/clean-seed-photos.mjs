// Deletes ONLY what seed-photos.mjs made: photos rows named "TEST - …", their files, and the
// test-guest-N@example.test users. Local stack only unless --allow-cloud (Thomas's explicit OK).
//   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/clean-seed-photos.mjs
import { connect, removeSeed } from "./seed-common.mjs"

const supabase = connect()
const r = await removeSeed(supabase)
console.log(`Removed ${r.rows} rows, ${r.files} files, ${r.users} users.`)
