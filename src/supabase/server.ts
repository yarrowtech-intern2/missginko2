import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/types/database"

/**
 * Server-side Supabase client for Server Components, Route Handlers, and
 * Server Actions. Cookie writes are swallowed when called from a Server
 * Component render (Next.js forbids mutating cookies there) — the
 * middleware is what actually keeps the session cookie refreshed.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Called from a Server Component — session refresh is handled
            // by middleware instead.
          }
        },
      },
    }
  )
}

/**
 * Service-role client for privileged server-only operations (AI review
 * summarization, admin bulk actions). NEVER import this from a path that
 * can be reached by a Client Component bundle.
 */
export async function createServiceClient() {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
