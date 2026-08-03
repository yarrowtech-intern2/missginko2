import Link from "next/link"

import { BookingDetailCard } from "@/features/admin/components/booking-detail-card"
import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { getBookings, getDashboardStats } from "@/services/admin.service"

export default async function AdminDashboardPage() {
  const [stats, bookings] = await Promise.all([getDashboardStats(), getBookings()])
  const recentBookings = bookings.slice(0, 3)

  const cards = [
    { label: "Pending Reservations", value: stats.pendingBookings, href: "/admin/reservations" },
    { label: "Reviews to Moderate", value: stats.pendingReviews, href: "/admin/reviews" },
    { label: "New Event Inquiries", value: stats.newEventInquiries, href: "/admin/private-events" },
    { label: "New Messages", value: stats.newContactMessages, href: "/admin/contact" },
  ]

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Today at a glance." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary"
          >
            <p className="text-3xl font-light">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-light">Recent Reservations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Call guests directly to confirm pending bookings.
            </p>
          </div>
          <Link
            href="/admin/reservations"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all reservations
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {recentBookings.map((booking) => (
            <BookingDetailCard key={booking.id} booking={booking} />
          ))}
          {recentBookings.length === 0 && (
            <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
              No reservations yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
