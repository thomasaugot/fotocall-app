import type { Session } from "@supabase/supabase-js"
import type { AdminSession } from "@/types/admin"

// UI only: app_metadata can be written by the service role alone, and RLS (is_admin()) is the
// real guard. A signed-in guest (anonymous, no role) is simply "not admin" and sees the login.
export const toAdminSession = (session: Session | null): AdminSession => ({
  isAdmin: !!session && !session.user.is_anonymous && session.user.app_metadata?.role === "admin",
})
