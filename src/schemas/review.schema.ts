import { z } from "zod"

export const reviewSchema = z.object({
  authorName: z.string().trim().min(2, "Enter your name."),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Share a little more detail.").max(1000),
})

export type ReviewInput = z.infer<typeof reviewSchema>
