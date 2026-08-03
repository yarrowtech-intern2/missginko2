/**
 * Hand-authored mirror of supabase/migrations/0001_init.sql, shaped to match
 * what `supabase gen types typescript` would emit (Row/Insert/Update/
 * Relationships per table, plus Views/Functions on the schema) so
 * `@supabase/supabase-js`'s generic inference resolves correctly.
 *
 * Regenerate against the linked project once it exists, and diff against
 * this file before overwriting — app code imports the narrower
 * `types/*.ts` re-exports, not this file directly, to keep that swap
 * low-risk.
 */

export type UserRole = "customer" | "staff" | "admin"
export type BookingArea = "indoor" | "outdoor" | "private"
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
export type EventType = "wedding" | "corporate" | "birthday" | "celebration" | "other"
export type EventStatus = "new" | "contacted" | "confirmed" | "declined"
export type ReviewStatus = "pending" | "approved" | "rejected"
export type GalleryCategory = "interior" | "food" | "events" | "team"
export type ContactStatus = "new" | "read" | "archived"

type ProfilesRow = {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

type MenuCategoriesRow = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  created_at: string
}

type MenuItemsRow = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  ingredients: string[]
  allergens: string[]
  dietary_tags: string[]
  price: number
  currency: string
  image_url: string | null
  gallery: string[]
  is_chef_recommendation: boolean
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type GalleryImagesRow = {
  id: string
  title: string | null
  alt: string
  image_url: string
  category: GalleryCategory
  width: number | null
  height: number | null
  sort_order: number
  created_at: string
}

type EventPackagesRow = {
  id: string
  name: string
  slug: string
  description: string | null
  capacity_min: number
  capacity_max: number
  price_from: number
  includes: string[]
  image_url: string | null
  sort_order: number
  created_at: string
}

type PrivateEventsRow = {
  id: string
  event_type: EventType
  full_name: string
  email: string
  phone: string
  event_date: string
  guest_count: number
  package_id: string | null
  message: string | null
  status: EventStatus
  created_at: string
}

type BookingsRow = {
  id: string
  user_id: string | null
  full_name: string
  email: string
  phone: string
  party_size: number
  booking_date: string
  booking_time: string
  area: BookingArea
  occasion: string | null
  special_requests: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
}

type RestaurantCapacityRow = {
  id: string
  area: BookingArea
  time_slot: string
  max_covers: number
}

type ReviewsRow = {
  id: string
  user_id: string | null
  author_name: string
  rating: number
  comment: string
  photos: string[]
  is_verified: boolean
  status: ReviewStatus
  created_at: string
}

type ContactSubmissionsRow = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: ContactStatus
  created_at: string
}

type NewsletterSubscribersRow = {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

type CustomerNotesRow = {
  id: string
  profile_id: string
  author_id: string
  note: string
  created_at: string
}

/** Builds the Row/Insert/Update/Relationships shape supabase-js expects from a bare Row type. */
type Table<Row, Required extends keyof Row> = {
  Row: Row
  Insert: Partial<Row> & Pick<Row, Required>
  Update: Partial<Row>
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfilesRow, "id">
      menu_categories: Table<MenuCategoriesRow, "name" | "slug">
      menu_items: Table<MenuItemsRow, "category_id" | "name" | "slug" | "price">
      gallery_images: Table<GalleryImagesRow, "alt" | "image_url" | "category">
      event_packages: Table<
        EventPackagesRow,
        "name" | "slug" | "capacity_min" | "capacity_max" | "price_from"
      >
      private_events: Table<
        PrivateEventsRow,
        "event_type" | "full_name" | "email" | "phone" | "event_date" | "guest_count"
      >
      bookings: Table<
        BookingsRow,
        "full_name" | "email" | "phone" | "party_size" | "booking_date" | "booking_time" | "area"
      >
      restaurant_capacity: Table<RestaurantCapacityRow, "area" | "time_slot" | "max_covers">
      reviews: Table<ReviewsRow, "author_name" | "rating" | "comment">
      contact_submissions: Table<
        ContactSubmissionsRow,
        "name" | "email" | "subject" | "message"
      >
      newsletter_subscribers: Table<NewsletterSubscribersRow, "email">
      customer_notes: Table<CustomerNotesRow, "profile_id" | "author_id" | "note">
    }
    Views: Record<string, never>
    Functions: {
      available_covers: {
        Args: { p_date: string; p_time: string; p_area: BookingArea }
        Returns: number
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_staff_or_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}
