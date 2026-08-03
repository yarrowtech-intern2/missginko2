import { updateReviewStatusAction } from "@/actions/admin.actions"
import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { RegenerateSummaryButton } from "@/features/admin/components/regenerate-summary-button"
import { StatusActions } from "@/features/admin/components/status-actions"
import { StarRating } from "@/components/common/star-rating"
import { getAllReviews } from "@/services/admin.service"

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
] as const

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews()

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description={`${reviews.length} reviews`}
        action={<RegenerateSummaryButton />}
      />

      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm">{review.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {review.author_name} · {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusActions
                id={review.id}
                current={review.status}
                options={[...statusOptions]}
                action={updateReviewStatusAction}
              />
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  )
}
