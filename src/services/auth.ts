import { supabase } from "@/lib/supabase"

// Guests never create an account: an anonymous session, kept in localStorage, is who they are.
// Losing it (cleared storage, another phone) only means they can no longer delete old photos.
export const ensureGuestSession = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  if (data.session) return data.session.user.id

  const signIn = await supabase.auth.signInAnonymously()
  if (signIn.error || !signIn.data.user) throw signIn.error ?? new Error("Anonymous sign-in returned no user")
  // Keep the session (= ownership of their photos) through storage pressure and Safari's 7-day eviction.
  void navigator.storage?.persist?.().catch(() => false)
  return signIn.data.user.id
}
