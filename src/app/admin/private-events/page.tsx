import { updateEventInquiryStatusAction } from "@/actions/admin.actions"
import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { StatusActions } from "@/features/admin/components/status-actions"
import { getPrivateEventInquiries } from "@/services/admin.service"

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
] as const

export default async function AdminPrivateEventsPage() {
  const inquiries = await getPrivateEventInquiries()

  return (
    <div>
      <AdminPageHeader title="Private Event Inquiries" description={`${inquiries.length} inquiries`} />

      <div className="mt-8 space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="rounded-lg border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium capitalize">
                  {inquiry.event_type} · {inquiry.guest_count} guests
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inquiry.full_name} · {inquiry.email} · {inquiry.phone}
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
                action={updateEventInquiryStatusAction}
              />
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No inquiries yet.
          </p>
        )}
      </div>
    </div>
  )
}
