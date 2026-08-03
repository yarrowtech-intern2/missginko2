"use server"

import { contactSchema } from "@/schemas/contact.schema"
import { createContactSubmission } from "@/services/contact.service"

export interface ContactActionResult {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitContactAction(
  _prev: ContactActionResult,
  formData: FormData
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { success: false, error: "Please check the highlighted fields.", fieldErrors }
  }

  try {
    await createContactSubmission(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
