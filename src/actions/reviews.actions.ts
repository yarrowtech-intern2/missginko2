"use server"

import { revalidatePath } from "next/cache"

import { reviewSchema } from "@/schemas/review.schema"
import { createReview } from "@/services/reviews.service"

export interface ReviewActionResult {
  success: boolean
  error?: string
}

export async function submitReviewAction(
  _prev: ReviewActionResult,
  formData: FormData
): Promise<ReviewActionResult> {
  const parsed = reviewSchema.safeParse({
    authorName: formData.get("authorName"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  try {
    await createReview(parsed.data)
    revalidatePath("/reviews")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}
