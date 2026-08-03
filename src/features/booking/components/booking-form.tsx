"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { createBooking, getAvailableCovers } from "@/services/booking.service"
import { AvailabilityBadge } from "@/features/booking/components/availability-badge"
import { MagneticButton } from "@/components/common/magnetic-button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { bookingAreas, bookingSchema, occasions, timeSlots } from "@/schemas/booking.schema"
import type { BookingArea } from "@/types/database"
import type { FieldErrors } from "@/lib/form-errors"
import { getFieldErrors } from "@/lib/form-errors"
import { cn } from "@/lib/utils"

interface BookingFormState {
  error?: string
  fieldErrors?: FieldErrors
}

const areaLabels: Record<BookingArea, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor Terrace",
  private: "Private Room",
}

export function BookingForm() {
  const router = useRouter()
  const [state, setState] = useState<BookingFormState>({})
  const [pending, setPending] = useState(false)

  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [area, setArea] = useState<BookingArea | "">("")
  const [partySize, setPartySize] = useState(2)
  const [occasion, setOccasion] = useState<string>(occasions[0])

  const dateValue = date ? format(date, "yyyy-MM-dd") : ""

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const parsed = bookingSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      partySize: formData.get("partySize"),
      date: formData.get("date"),
      time: formData.get("time"),
      area: formData.get("area"),
      occasion: formData.get("occasion") || undefined,
      specialRequests: formData.get("specialRequests") || undefined,
    })

    if (!parsed.success) {
      setState({
        error: "Please check the highlighted fields.",
        fieldErrors: getFieldErrors(parsed.error),
      })
      return
    }

    setPending(true)
    setState({})

    try {
      const covers = await getAvailableCovers(
        parsed.data.date,
        parsed.data.time,
        parsed.data.area
      )

      if (covers < parsed.data.partySize) {
        setState({
          error: `Only ${covers} seats remain for that time. Try another slot.`,
        })
        return
      }

      const booking = await createBooking(parsed.data)
      router.push(`/booking/success?ref=${booking.id.slice(0, 8)}`)
    } catch (error) {
      console.error("Failed to create booking:", error)
      setState({ error: "Something went wrong. Please try again." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <input type="hidden" name="date" value={dateValue} />
      <input type="hidden" name="time" value={time} />
      <input type="hidden" name="area" value={area} />
      <input type="hidden" name="occasion" value={occasion} />

      <fieldset className="space-y-6">
        <legend className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          Your Table
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  "flex h-12 w-full items-center gap-2 border-b border-border px-1 text-left text-sm",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="size-4" />
                {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: new Date() }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            {state.fieldErrors?.date && (
              <p className="text-xs text-destructive">{state.fieldErrors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partySize">Guests</Label>
            <input
              id="partySize"
              name="partySize"
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={time} onValueChange={(v) => setTime(v ?? "")}>
              <SelectTrigger className="h-12 w-full border-0 border-b border-border px-1 rounded-none">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.time && (
              <p className="text-xs text-destructive">{state.fieldErrors.time}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Seating</Label>
            <Select
              value={area}
              onValueChange={(v) => setArea((v as BookingArea | null) ?? "")}
            >
              <SelectTrigger className="h-12 w-full border-0 border-b border-border px-1 rounded-none">
                <SelectValue placeholder="Select seating" />
              </SelectTrigger>
              <SelectContent>
                {bookingAreas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {areaLabels[a]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.area && (
              <p className="text-xs text-destructive">{state.fieldErrors.area}</p>
            )}
          </div>
        </div>

        <AvailabilityBadge
          date={dateValue || undefined}
          time={time || undefined}
          area={area || undefined}
          partySize={partySize}
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          Your Details
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <input
              id="fullName"
              name="fullName"
              required
              className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
            />
            {state.fieldErrors?.fullName && (
              <p className="text-xs text-destructive">{state.fieldErrors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
            />
            {state.fieldErrors?.email && (
              <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
            />
            {state.fieldErrors?.phone && (
              <p className="text-xs text-destructive">{state.fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Occasion</Label>
            <Select value={occasion} onValueChange={(v) => setOccasion(v ?? occasions[0])}>
              <SelectTrigger className="h-12 w-full border-0 border-b border-border px-1 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {occasions.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special requests</Label>
          <Textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            placeholder="Dietary restrictions, seating preferences, anything we should know."
            className="rounded-none border-0 border-b border-border px-1"
          />
        </div>
      </fieldset>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <MagneticButton type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Reserving..." : "Confirm Reservation"}
      </MagneticButton>
    </form>
  )
}
