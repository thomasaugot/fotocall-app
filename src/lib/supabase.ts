import { createClient } from "@supabase/supabase-js"
import { appConfig } from "@/config/app.config"
import type { Database } from "@/types/database"

// Publishable key only: RLS and the bucket policies are the guard (11-SECURITY).
export const supabase = createClient<Database>(appConfig.supabaseUrl, appConfig.supabaseKey)
