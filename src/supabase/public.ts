import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

/**
 * Cookie-free Supabase client for public, non-personalized catalog reads
 * (menu, gallery, event packages, review summaries). Unlike `supabase/server`,
 * this never touches `next/headers`, so pages that only use it can still be
 * statically generated / ISR'd instead of being forced fully dynamic.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
