"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { BookingDetailCard } from "@/features/admin/components/booking-detail-card"
import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import {
  getBookings,
  getDashboardStats,
  type AdminBooking,
  type DashboardStats,
} from "@/services/admin.service"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [nextStats, nextBookings] = await Promise.all([
          getDashboardStats(),
          getBookings(),
        ])

        if (!active) return
        setStats(nextStats)
        setBookings(nextBookings.slice(0, 3))
      } catch (error) {
        console.error("Failed to load admin dashboard:", error)
        if (active) setError("Could not load dashboard data.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const cards = [
    {
      label: "Pending Reservations",
      value: stats?.pendingBookings ?? 0,
      href: "/admin/reservations",
    },
    { label: "Reviews to Moderate", value: stats?.pendingReviews ?? 0, href: "/admin/reviews" },
    {
      label: "New Event Inquiries",
      value: stats?.newEventInquiries ?? 0,
      href: "/admin/private-events",
    },
    { label: "New Messages", value: stats?.newContactMessages ?? 0, href: "/admin/contact" },
  ]

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Today at a glance." />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary"
          >
            <p className="text-3xl font-light">{loading ? "-" : card.value}</p>
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
      </section>
    </div>
  )
}
