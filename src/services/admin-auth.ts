import { supabase } from "@/lib/supabase"
import type { AdminSession } from "@/types/admin"
import { toAdminSession } from "@/utils/admin-session"

export const getAdminSession = async (): Promise<AdminSession> => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return toAdminSession(data.session)
}

// Magic link, no password. shouldCreateUser: false = a link only ever reaches an existing user
// (the admin is created by hand with the admin role); the dashboard still checks the role.
// An unknown address is answered like a known one, so the screen never says who is an admin.
const UNKNOWN_USER = /signups? not allowed|user not found|otp_disabled/i

export const sendAdminLink = async (email: string, redirectTo: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
  })
  if (error && !UNKNOWN_USER.test(`${error.code ?? ""} ${error.message}`)) throw error
}

export const signOutAdmin = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
