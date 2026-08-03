"use client"

import { useActionState, useState } from "react"
import { Star } from "lucide-react"
import Link from "next/link"

import { submitReviewAction, type ReviewActionResult } from "@/actions/reviews.actions"
import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const initialState: ReviewActionResult = { success: false }

export function ReviewForm({ isSignedIn }: { isSignedIn: boolean }) {
  const [state, formAction, pending] = useActionState(submitReviewAction, initialState)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState<number | null>(null)

  if (!isSignedIn) {
    return (
      <div className="rounded-sm border border-border bg-paper p-8 text-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      </div>
    )
  }

  if (state.success) {
    return (
      <div className="rounded-sm border border-border bg-paper p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Thank you — your review is pending moderation and will appear shortly.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1" onMouseLeave={() => setHovered(null)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "size-6",
                  value <= (hovered ?? rating)
                    ? "fill-primary text-primary"
                    : "fill-none text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorName">Name</Label>
        <input
          id="authorName"
          name="authorName"
          required
          className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your review</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          rows={4}
          className="rounded-none border-0 border-b border-border px-1"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <MagneticButton type="submit">{pending ? "Submitting…" : "Submit Review"}</MagneticButton>
    </form>
  )
}
