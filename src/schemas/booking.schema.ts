import { z } from "zod"

export const bookingAreas = ["indoor", "outdoor", "private"] as const
export const timeSlots = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
] as const

export const occasions = [
  "None in particular",
  "Birthday",
  "Anniversary",
  "Date night",
  "Business dinner",
  "Celebration",
] as const

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  partySize: z.coerce.number().int().min(1, "At least 1 guest.").max(20, "For groups over 20, contact us about private events."),
  date: z.string().refine((val) => {
    const date = new Date(`${val}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, "Choose a date from today onward."),
  time: z.enum(timeSlots, { message: "Choose a time." }),
  area: z.enum(bookingAreas, { message: "Choose a seating area." }),
  occasion: z.string().optional(),
  specialRequests: z.string().max(500, "Keep it under 500 characters.").optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>
