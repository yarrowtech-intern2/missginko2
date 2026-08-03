import { createPublicClient } from "@/supabase/public"
import { createClient } from "@/supabase/client"
import type { Database } from "@/types/database"
import type { EventInquiryInput } from "@/schemas/event-inquiry.schema"

export type EventPackage = Database["public"]["Tables"]["event_packages"]["Row"]

export async function getEventPackages(): Promise<EventPackage[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("event_packages")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createEventInquiry(input: EventInquiryInput) {
  const supabase = createClient()

  const { error } = await supabase.from("private_events").insert({
    event_type: input.eventType,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    event_date: input.eventDate,
    guest_count: input.guestCount,
    message: input.message,
  })

  if (error) throw error
}
