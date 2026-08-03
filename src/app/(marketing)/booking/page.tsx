import type { Metadata } from "next"

import { BookingForm } from "@/features/booking/components/booking-form"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { siteConfig } from "@/config/site"
import { stockImages } from "@/lib/stock-images"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Reserve a Table",
  description: `Reserve a table at ${siteConfig.name} — indoor, outdoor, or private dining.`,
  path: "/booking",
})

export default function BookingPage() {
  return (
    <div className="grid min-h-screen pt-20 md:grid-cols-2 md:pt-0">
      <div className="relative hidden md:block">
        <PlaceholderMedia
          label="Reserved table setting — add /images/booking.jpg"
          alt="A reserved table set for dinner at Miss Ginko"
          src={stockImages.bookingTable}
          className="sticky top-0 h-screen"
        />
      </div>

      <div className="px-6 py-16 sm:px-12 md:px-16 md:py-28 lg:px-24">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Reservations
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,1.8rem+2vw,3.75rem)] leading-[1] font-light">
          Reserve Your Table
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          For parties larger than 20, or full-room buyouts, visit{" "}
          <a href="/private-events" className="underline underline-offset-4">
            Private Events
          </a>
          . We hold reservations for 15 minutes past the booked time.
        </p>

        <div className="mt-12">
          <BookingForm />
        </div>
      </div>
    </div>
  )
}
