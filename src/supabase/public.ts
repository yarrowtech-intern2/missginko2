import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

/**
 * Cookie-free Supabase client for public, non-personalized catalog reads.
 * These reads can run during static export without touching request cookies.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
