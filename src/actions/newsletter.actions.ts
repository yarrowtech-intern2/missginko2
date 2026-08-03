"use server"

import { newsletterSchema } from "@/schemas/newsletter.schema"
import { subscribeToNewsletter } from "@/services/newsletter.service"

export interface ActionResult {
  success: boolean
  error?: string
}

export async function subscribeNewsletterAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email." }
  }

  try {
    await subscribeToNewsletter(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
