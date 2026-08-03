import { PhoneCall } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { StatusActions } from "@/features/admin/components/status-actions"
import { updateBookingStatusAction } from "@/actions/admin.actions"
import { cn } from "@/lib/utils"
import type { BookingStatus, Database } from "@/types/database"

type Booking = Database["public"]["Tables"]["bookings"]["Row"]

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirm" },
  { value: "completed", label: "Complete" },
  { value: "cancelled", label: "Cancel" },
  { value: "no_show", label: "No-show" },
] as const satisfies { value: BookingStatus; label: string }[]

const statusTone: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
}

export function BookingDetailCard({
  booking,
  compact = false,
}: {
  booking: Booking
  compact?: boolean
}) {
  const reference = booking.id.slice(0, 8)
  const telHref = `tel:${booking.phone.replace(/[^\d+]/g, "")}`

  return (
    <article className="rounded-lg border border-border bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-light">{booking.full_name}</h2>
            <Badge variant={statusTone[booking.status]}>{booking.status.replace("_", " ")}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Reference #{reference}
            {booking.user_id ? ` - Customer account ${booking.user_id}` : " - Guest booking"}
          </p>
        </div>

        <a
          href={telHref}
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          aria-label={`Call ${booking.full_name} to confirm booking`}
        >
          <PhoneCall className="size-4" />
          Call to Confirm
        </a>
      </div>

      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Phone" value={booking.phone} strong />
        <Detail label="Email" value={booking.email} />
        <Detail label="Booking Time" value={`${booking.booking_date} - ${booking.booking_time}`} />
        <Detail label="Party" value={`${booking.party_size} guest${booking.party_size === 1 ? "" : "s"}`} />
        <Detail label="Seating" value={booking.area} capitalize />
        <Detail label="Occasion" value={booking.occasion || "None provided"} />
        <Detail label="Submitted" value={new Date(booking.created_at).toLocaleString()} />
        <Detail label="Updated" value={new Date(booking.updated_at).toLocaleString()} />
      </div>

      {!compact && (
        <div className="mt-5 rounded-md bg-muted/50 p-4">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Special Requests
          </p>
          <p className="mt-2 text-sm">
            {booking.special_requests?.trim() || "No special requests provided."}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-3 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Update Status
        </p>
        <StatusActions
          id={booking.id}
          current={booking.status}
          options={[...statusOptions]}
          action={updateBookingStatusAction}
        />
      </div>
    </article>
  )
}

function Detail({
  label,
  value,
  strong = false,
  capitalize = false,
}: {
  label: string
  value: string
  strong?: boolean
  capitalize?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 break-words",
          strong && "text-base font-semibold text-primary",
          capitalize && "capitalize"
        )}
      >
        {value}
      </p>
    </div>
  )
}
