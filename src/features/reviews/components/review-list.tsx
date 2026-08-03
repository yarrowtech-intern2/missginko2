import { StarRating } from "@/components/common/star-rating"
import { Reveal } from "@/components/common/reveal"
import type { Review } from "@/services/reviews.service"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Be the first to leave a review.</p>
  }

  return (
    <div className="divide-y divide-border border-t border-border">
      {reviews.map((review, index) => (
        <Reveal key={review.id} delay={(index % 6) * 0.05} className="py-8">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed">{review.comment}</p>
          <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {review.author_name}
            {review.is_verified && " · Verified guest"}
          </p>
        </Reveal>
      ))}
    </div>
  )
}
