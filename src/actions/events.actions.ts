"use server"

import { eventInquirySchema } from "@/schemas/event-inquiry.schema"
import { createEventInquiry } from "@/services/events.service"

export interface EventInquiryResult {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitEventInquiryAction(
  _prev: EventInquiryResult,
  formData: FormData
): Promise<EventInquiryResult> {
  const parsed = eventInquirySchema.safeParse({
    eventType: formData.get("eventType"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    eventDate: formData.get("eventDate"),
    guestCount: formData.get("guestCount"),
    message: formData.get("message") || undefined,
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
    await createEventInquiry(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
