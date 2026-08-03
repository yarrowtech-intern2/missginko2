"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { BookingDetailCard } from "@/features/admin/components/booking-detail-card"
import { getBookings, type AdminBooking } from "@/services/admin.service"

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadBookings() {
      try {
        const nextBookings = await getBookings()
        if (active) setBookings(nextBookings)
      } catch (error) {
        console.error("Failed to load reservations:", error)
        if (active) setError("Could not load reservations.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Reservations"
        description={loading ? "Loading recent bookings" : `${bookings.length} recent bookings`}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading reservations...
          </p>
        )}

        {!loading &&
          bookings.map((booking) => <BookingDetailCard key={booking.id} booking={booking} />)}

        {!loading && bookings.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No reservations yet.
          </p>
        )}
      </div>
    </div>
  )
}
