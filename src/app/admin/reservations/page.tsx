import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { BookingDetailCard } from "@/features/admin/components/booking-detail-card"
import { getBookings } from "@/services/admin.service"

export default async function AdminReservationsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <AdminPageHeader
        title="Reservations"
        description={`${bookings.length} recent bookings`}
      />

      <div className="mt-8 space-y-4">
        {bookings.map((booking) => (
          <BookingDetailCard key={booking.id} booking={booking} />
        ))}

        {bookings.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No reservations yet.
          </p>
        )}
      </div>
    </div>
  )
}
