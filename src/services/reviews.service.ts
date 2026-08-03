import { createClient } from "@/supabase/server"
import { createPublicClient } from "@/supabase/public"
import type { Database } from "@/types/database"

export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type ReviewSummary = Database["public"]["Tables"]["review_summaries"]["Row"]

export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function getLatestReviewSummary(): Promise<ReviewSummary | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("review_summaries")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createReview(input: {
  rating: number
  comment: string
  authorName: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("You must be signed in to leave a review.")

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
  })

  if (error) throw error
}
