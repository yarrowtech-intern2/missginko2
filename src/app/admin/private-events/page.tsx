"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { StatusActions } from "@/features/admin/components/status-actions"
import {
  getPrivateEventInquiries,
  updateEventInquiryStatus,
  type AdminPrivateEvent,
} from "@/services/admin.service"
import type { EventStatus } from "@/types/database"

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
] as const satisfies { value: EventStatus; label: string }[]

export default function AdminPrivateEventsPage() {
  const [inquiries, setInquiries] = useState<AdminPrivateEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadInquiries() {
      try {
        const nextInquiries = await getPrivateEventInquiries()
        if (active) setInquiries(nextInquiries)
      } catch (error) {
        console.error("Failed to load private event inquiries:", error)
        if (active) setError("Could not load inquiries.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInquiries()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Private Event Inquiries"
        description={loading ? "Loading inquiries" : `${inquiries.length} inquiries`}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading inquiries...
          </p>
        )}

        {!loading &&
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-lg border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium capitalize">
                    {inquiry.event_type} - {inquiry.guest_count} guests
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {inquiry.full_name} - {inquiry.email} - {inquiry.phone}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested date: {inquiry.event_date}
                  </p>
                  {inquiry.message && <p className="mt-2 text-sm">{inquiry.message}</p>}
                </div>
                <StatusActions
                  id={inquiry.id}
                  current={inquiry.status}
                  options={[...statusOptions]}
                  onUpdate={updateEventInquiryStatus}
                />
              </div>
            </div>
          ))}

        {!loading && inquiries.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No inquiries yet.
          </p>
        )}
      </div>
    </div>
  )
}
