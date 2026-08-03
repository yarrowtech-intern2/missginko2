import "server-only"

import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"

import { createServiceClient } from "@/supabase/server"

const summarySchema = z.object({
  atmosphere_summary: z.string(),
  service_summary: z.string(),
  food_summary: z.string(),
  most_mentioned_dishes: z.array(z.object({ name: z.string(), mentions: z.number() })).max(8),
})

/**
 * Regenerates the cached AI review summary (review_summaries table) from all
 * approved reviews. Triggered manually from the admin reviews panel — not on
 * every page load, since it's an LLM call over potentially hundreds of
 * reviews. Uses Haiku 4.5: this is a cheap, high-volume batch summarization
 * job with no reasoning requirement, exactly what that tier is priced for.
 */
export async function regenerateReviewSummary() {
  const supabase = await createServiceClient()

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating, comment")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(300)

  if (error) throw error
  if (!reviews || reviews.length === 0) {
    throw new Error("No approved reviews to summarize yet.")
  }

  const overallRatingAvg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const reviewText = reviews
    .map((r, i) => `[${i + 1}] (${r.rating}/5) ${r.comment}`)
    .join("\n")

  const client = new Anthropic()

  const message = await client.messages.parse({
    model: "claude-haiku-4-5",
    max_tokens: 2048,
    system:
      "You summarize restaurant guest reviews for a luxury Modern Asian fine dining website. " +
      "Write in a warm, editorial tone matching a high-end hospitality brand — no bullet-point " +
      "clichés, no 'overall' hedging. Each summary field should be 1-2 sentences. Identify the " +
      "specific dishes guests mention most often, with an approximate mention count.",
    messages: [
      {
        role: "user",
        content: `Summarize these ${reviews.length} guest reviews:\n\n${reviewText}`,
      },
    ],
    output_config: {
      format: zodOutputFormat(summarySchema),
    },
  })

  if (!message.parsed_output) {
    throw new Error("Model did not return a parseable summary.")
  }

  const { error: upsertError } = await supabase.from("review_summaries").insert({
    generated_at: new Date().toISOString(),
    overall_rating_avg: overallRatingAvg,
    total_reviews: reviews.length,
    ...message.parsed_output,
  })

  if (upsertError) throw upsertError
}
