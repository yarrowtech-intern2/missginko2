"use server"

import { redirect } from "next/navigation"

import { bookingSchema } from "@/schemas/booking.schema"
import { createBooking, getAvailableCovers } from "@/services/booking.service"
import type { BookingArea } from "@/types/database"

export interface BookingActionResult {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function checkAvailabilityAction(date: string, time: string, area: BookingArea) {
  try {
    const covers = await getAvailableCovers(date, time, area)
    return { covers, error: null as string | null }
  } catch (error) {
    console.error("Failed to check booking availability:", error)
    return { covers: null, error: "Couldn't check availability. Please try again." }
  }
}

export async function createBookingAction(
  _prev: BookingActionResult,
  formData: FormData
): Promise<BookingActionResult> {
  const parsed = bookingSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    partySize: formData.get("partySize"),
    date: formData.get("date"),
    time: formData.get("time"),
    area: formData.get("area"),
    occasion: formData.get("occasion") || undefined,
    specialRequests: formData.get("specialRequests") || undefined,
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { success: false, error: "Please check the highlighted fields.", fieldErrors }
  }

  let bookingId: string
  try {
    const covers = await getAvailableCovers(parsed.data.date, parsed.data.time, parsed.data.area)
    if (covers < parsed.data.partySize) {
      return {
        success: false,
        error: `Only ${covers} seats remain for that time — try another slot.`,
      }
    }

    const booking = await createBooking(parsed.data)
    bookingId = booking.id
  } catch (error) {
    console.error("Failed to create booking:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }

  // Outside the try/catch: redirect() throws internally, and catching that
  // here would swallow the redirect instead of letting Next.js perform it.
  redirect(`/booking/success?ref=${bookingId.slice(0, 8)}`)
}
