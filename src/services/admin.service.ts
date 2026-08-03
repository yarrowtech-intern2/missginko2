import { createClient } from "@/supabase/server"
import type { BookingStatus, ContactStatus, EventStatus, ReviewStatus } from "@/types/database"

/** All reads/writes here rely on the "staff or admin" RLS policies — the
 * cookie-aware client carries the signed-in staff member's session. */

export async function getDashboardStats() {
  const supabase = await createClient()

  const [bookings, reviews, events, contacts] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("private_events").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
  ])

  return {
    pendingBookings: bookings.count ?? 0,
    pendingReviews: reviews.count ?? 0,
    newEventInquiries: events.count ?? 0,
    newContactMessages: contacts.count ?? 0,
  }
}

export async function getBookings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getPrivateEventInquiries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("private_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateEventInquiryStatus(id: string, status: EventStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from("private_events").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getAllReviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getContactSubmissions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return data ?? []
}

export async function getCustomers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return data ?? []
}
