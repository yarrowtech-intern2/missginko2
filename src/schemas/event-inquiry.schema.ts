import { z } from "zod"

export const eventTypes = ["wedding", "corporate", "birthday", "celebration", "other"] as const

export const eventInquirySchema = z.object({
  eventType: z.enum(eventTypes, { message: "Choose an event type." }),
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  eventDate: z.string().min(1, "Choose a date."),
  guestCount: z.coerce.number().int().min(1, "Enter a guest count."),
  message: z.string().max(1000).optional(),
})

export type EventInquiryInput = z.infer<typeof eventInquirySchema>
