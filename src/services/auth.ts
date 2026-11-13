import { supabase } from "@/lib/supabase"

// Guests never create an account: an anonymous session, kept in localStorage, is who they are.
// Losing it (cleared storage, another phone) only means they can no longer delete old photos.
// Several parts of a page ask for the session at the same moment on a first visit (the album,
// the guest's own photos). They share ONE in-flight request, or each would create its own
// anonymous user (seen in production: guests created in pairs).
let pending: Promise<string> | null = null

const resolveGuestSession = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  if (data.session) return data.session.user.id

  const signIn = await supabase.auth.signInAnonymously()
  if (signIn.error || !signIn.data.user) throw signIn.error ?? new Error("Anonymous sign-in returned no user")
  // Keep the session (= ownership of their photos) through storage pressure and Safari's 7-day eviction.
  void navigator.storage?.persist?.().catch(() => false)
  return signIn.data.user.id
}

export const ensureGuestSession = (): Promise<string> => {
  pending ??= resolveGuestSession().finally(() => { pending = null })
  return pending
}

// The guest's name on their hidden account, so Supabase's user list shows "Abuela Carmen"
// instead of a blank line (the "Display name" column reads display_name). Only written when it
// changed. Labels only: user_metadata is never used to decide what anyone may do.
export const labelGuest = async (name: string): Promise<void> => {
  await ensureGuestSession()
  const { data } = await supabase.auth.getSession()
  if (data.session?.user.user_metadata?.display_name === name) return
  const { error } = await supabase.auth.updateUser({ data: { display_name: name } })
  if (error) throw error
}
