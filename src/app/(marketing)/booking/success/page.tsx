import type { Metadata } from "next"

import { BookingSuccessMessage } from "@/features/booking/components/booking-success-message"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Reservation Received",
  path: "/booking/success",
  noIndex: true,
})

export default function BookingSuccessPage() {
  return <BookingSuccessMessage />
}
