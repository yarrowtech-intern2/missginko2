"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import Link from "next/link"

import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { reviewSchema } from "@/schemas/review.schema"
import { createReview } from "@/services/reviews.service"
import { createClient } from "@/supabase/client"
import { cn } from "@/lib/utils"

interface ReviewFormState {
  success: boolean
  error?: string
}

export function ReviewForm() {
  const [state, setState] = useState<ReviewFormState>({ success: false })
  const [pending, setPending] = useState(false)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState<number | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setIsSignedIn(Boolean(data.session))
      setAuthChecked(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session))
      setAuthChecked(true)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsed = reviewSchema.safeParse({
      authorName: formData.get("authorName"),
      rating: formData.get("rating"),
      comment: formData.get("comment"),
    })

    if (!parsed.success) {
      setState({
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      })
      return
    }

    setPending(true)
    setState({ success: false })

    try {
      await createReview(parsed.data)
      form.reset()
      setRating(5)
      setState({ success: true })
    } catch (error) {
      setState({
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong.",
      })
    } finally {
      setPending(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="rounded-sm border border-border bg-paper p-8 text-center">
        <p className="text-sm text-muted-foreground">Checking sign-in...</p>
      </div>
    )
  }

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
          Thank you. Your review is pending moderation and will appear shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <MagneticButton type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Review"}
      </MagneticButton>
    </form>
  )
}
