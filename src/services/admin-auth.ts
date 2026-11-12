import { appConfig } from "@/config/app.config"
import { supabase } from "@/lib/supabase"
import type { AdminSession } from "@/types/admin"
import { toAdminSession } from "@/utils/admin-session"

export const getAdminSession = async (): Promise<AdminSession> => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return toAdminSession(data.session)
}

// The email is a public constant; the password is the only secret the admin types.
// Any failure (wrong password, no admin email configured, a user without the role) throws the
// same way, so the screen can show one generic message and no detail.
export const signInAdmin = async (password: string): Promise<AdminSession> => {
  if (!appConfig.adminEmail) throw new Error("Admin email is not configured")
  const { data, error } = await supabase.auth.signInWithPassword({ email: appConfig.adminEmail, password })
  if (error) throw error
  const admin = toAdminSession(data.session)
  if (!admin.isAdmin) {
    await supabase.auth.signOut()
    throw new Error("Signed-in user is not an admin")
  }
  return admin
}

export const signOutAdmin = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
