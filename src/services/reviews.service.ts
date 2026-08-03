import { createPublicClient } from "@/supabase/public"
import { createClient } from "@/supabase/client"
import type { Database } from "@/types/database"

export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("id,user_id,author_name,rating,comment,photos,is_verified,status,created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function createReview(input: {
  rating: number
  comment: string
  authorName: string
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) throw new Error("You must be signed in to leave a review.")

  const { error } = await supabase.from("reviews").insert({
    user_id: session.user.id,
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
  })

  if (error) throw error
}
