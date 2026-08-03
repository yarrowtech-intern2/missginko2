"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { StatusActions } from "@/features/admin/components/status-actions"
import { StarRating } from "@/components/common/star-rating"
import { getAllReviews, updateReviewStatus, type AdminReview } from "@/services/admin.service"
import type { ReviewStatus } from "@/types/database"

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
] as const satisfies { value: ReviewStatus; label: string }[]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadReviews() {
      try {
        const nextReviews = await getAllReviews()
        if (active) setReviews(nextReviews)
      } catch (error) {
        console.error("Failed to load reviews:", error)
        if (active) setError("Could not load reviews.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReviews()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description={loading ? "Loading reviews" : `${reviews.length} reviews`}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading reviews...
          </p>
        )}

        {!loading &&
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <StarRating rating={review.rating} />
                  <p className="mt-2 text-sm">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {review.author_name} - {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusActions
                  id={review.id}
                  current={review.status}
                  options={[...statusOptions]}
                  onUpdate={updateReviewStatus}
                />
              </div>
            </div>
          ))}

        {!loading && reviews.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  )
}
