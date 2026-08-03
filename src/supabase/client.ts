import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/types/database"

/**
 * Browser-side Supabase client — safe to import from Client Components.
 * Uses the anon key; RLS policies are the only thing standing between
 * this client and the database, so every public table policy matters.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
