import { createClient, createServiceClient } from "@/supabase/server"
import { createPublicClient } from "@/supabase/public"
import type { BookingArea } from "@/types/database"
import type { BookingInput } from "@/schemas/booking.schema"

/** Remaining covers for a date/time/area, via the security-definer RPC so
 * anonymous guests get an accurate count despite RLS hiding others' rows. */
export async function getAvailableCovers(date: string, time: string, area: BookingArea) {
  const supabase = createPublicClient()
  const { data, error } = await supabase.rpc("available_covers", {
    p_date: date,
    p_time: time,
    p_area: area,
  })

  if (error) {
    throw new Error(
      `Availability RPC failed: ${error.code} ${error.message}${
        error.details ? ` Details: ${error.details}` : ""
      }${error.hint ? ` Hint: ${error.hint}` : ""}`
    )
  }
  return data ?? 0
}

export async function createBooking(input: BookingInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const serviceSupabase = await createServiceClient()

  const { data, error } = await serviceSupabase
    .from("bookings")
    .insert({
      user_id: user?.id ?? null,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      party_size: input.partySize,
      booking_date: input.date,
      booking_time: input.time,
      area: input.area,
      occasion: input.occasion,
      special_requests: input.specialRequests,
    })
    .select("id")
    .single()

  if (error) {
    throw new Error(
      `Booking insert failed: ${error.code} ${error.message}${
        error.details ? ` Details: ${error.details}` : ""
      }${error.hint ? ` Hint: ${error.hint}` : ""}`
    )
  }
  return data
}
