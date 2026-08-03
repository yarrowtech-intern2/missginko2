import { createClient } from "@/supabase/client"
import type {
  BookingStatus,
  ContactStatus,
  Database,
  EventStatus,
  ReviewStatus,
} from "@/types/database"

export type AdminBooking = Database["public"]["Tables"]["bookings"]["Row"]
export type AdminContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Row"]
export type AdminPrivateEvent = Database["public"]["Tables"]["private_events"]["Row"]
export type AdminReview = Database["public"]["Tables"]["reviews"]["Row"]
export type AdminNewsletterSubscriber =
  Database["public"]["Tables"]["newsletter_subscribers"]["Row"]
export type AdminCustomer = Database["public"]["Tables"]["profiles"]["Row"]
export type AdminMenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"]
export type AdminMenuItem = Database["public"]["Tables"]["menu_items"]["Row"]
export type AdminGalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"]

export interface DashboardStats {
  pendingBookings: number
  pendingReviews: number
  newEventInquiries: number
  newContactMessages: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  const [bookings, reviews, events, contacts] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("private_events").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
  ])

  for (const result of [bookings, reviews, events, contacts]) {
    if (result.error) throw result.error
  }

  return {
    pendingBookings: bookings.count ?? 0,
    pendingReviews: reviews.count ?? 0,
    newEventInquiries: events.count ?? 0,
    newContactMessages: contacts.count ?? 0,
  }
}

export async function getBookings(): Promise<AdminBooking[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id,user_id,full_name,email,phone,party_size,booking_date,booking_time,area,occasion,special_requests,status,created_at,updated_at"
    )
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = createClient()
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getPrivateEventInquiries(): Promise<AdminPrivateEvent[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("private_events")
    .select(
      "id,event_type,full_name,email,phone,event_date,guest_count,package_id,message,status,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateEventInquiryStatus(id: string, status: EventStatus) {
  const supabase = createClient()
  const { error } = await supabase.from("private_events").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getAllReviews(): Promise<AdminReview[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("id,user_id,author_name,rating,comment,photos,is_verified,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const supabase = createClient()
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getContactSubmissions(): Promise<AdminContactSubmission[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id,name,email,phone,subject,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const supabase = createClient()
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)
  if (error) throw error
}

export async function getNewsletterSubscribers(): Promise<AdminNewsletterSubscriber[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id,email,is_active,subscribed_at,unsubscribed_at")
    .order("subscribed_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return data ?? []
}

export async function getCustomers(): Promise<AdminCustomer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,phone,avatar_url,role,created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return data ?? []
}

export async function getAdminMenu() {
  const supabase = createClient()
  const [{ data: categories, error: categoriesError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase
        .from("menu_categories")
        .select("id,name,slug,description,sort_order,created_at")
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select(
          "id,category_id,name,slug,description,ingredients,allergens,dietary_tags,price,currency,image_url,gallery,is_chef_recommendation,is_available,sort_order,created_at,updated_at"
        )
        .order("sort_order", { ascending: true }),
    ])

  if (categoriesError) throw categoriesError
  if (itemsError) throw itemsError

  return {
    categories: categories ?? [],
    items: items ?? [],
  }
}

export async function getAdminGalleryImages(): Promise<AdminGalleryImage[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id,title,alt,image_url,category,width,height,sort_order,created_at")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data ?? []
}
