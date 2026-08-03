import { StarRating } from "@/components/common/star-rating"
import { Reveal } from "@/components/common/reveal"
import type { ReviewSummary } from "@/services/reviews.service"

export function ReviewSummaryPanel({ summary }: { summary: ReviewSummary }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl font-light">
          {summary.overall_rating_avg.toFixed(1)}
        </span>
        <div>
          <StarRating rating={summary.overall_rating_avg} />
          <p className="mt-1 text-xs text-muted-foreground">
            Based on {summary.total_reviews} reviews
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        <Reveal>
          <h3 className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Atmosphere
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{summary.atmosphere_summary}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Service
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{summary.service_summary}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <h3 className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Food
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{summary.food_summary}</p>
        </Reveal>
      </div>

      {summary.most_mentioned_dishes.length > 0 && (
        <Reveal delay={0.3} className="mt-10">
          <h3 className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Most Mentioned Dishes
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {summary.most_mentioned_dishes.map((dish) => (
              <span
                key={dish.name}
                className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground"
              >
                {dish.name} · {dish.mentions}
              </span>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  )
}
