import type { Metadata } from "next"

import { ReviewForm } from "@/features/reviews/components/review-form"
import { ReviewList } from "@/features/reviews/components/review-list"
import { ReviewSummaryPanel } from "@/features/reviews/components/review-summary-panel"
import { buildMetadata } from "@/seo/metadata"
import { getApprovedReviews, getLatestReviewSummary } from "@/services/reviews.service"
import { createClient } from "@/supabase/server"

export const metadata: Metadata = buildMetadata({
  title: "Reviews",
  description: "What guests say about dining at Miss Ginko.",
  path: "/reviews",
})

export default async function ReviewsPage() {
  let reviews: Awaited<ReturnType<typeof getApprovedReviews>> = []
  let summary: Awaited<ReturnType<typeof getLatestReviewSummary>> = null

  try {
    ;[reviews, summary] = await Promise.all([getApprovedReviews(), getLatestReviewSummary()])
  } catch (error) {
    console.warn("Failed to load reviews from Supabase:", error)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="bg-background pt-32 pb-28 md:pt-40">
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Guest Reviews
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light">
          What Guests Love
        </h1>

        {summary && (
          <div className="mt-14 border-t border-border pt-10">
            <ReviewSummaryPanel summary={summary} />
          </div>
        )}

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr,22rem]">
          <div>
            <h2 className="font-display text-2xl font-light">Recent Reviews</h2>
            <div className="mt-6">
              <ReviewList reviews={reviews} />
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-2xl font-light">Leave a Review</h2>
            <div className="mt-6">
              <ReviewForm isSignedIn={Boolean(user)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
