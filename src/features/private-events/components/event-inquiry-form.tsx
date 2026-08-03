"use client"

import { useActionState } from "react"

import { submitEventInquiryAction, type EventInquiryResult } from "@/actions/events.actions"
import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { eventTypes } from "@/schemas/event-inquiry.schema"

const initialState: EventInquiryResult = { success: false }

const eventTypeLabels: Record<(typeof eventTypes)[number], string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  birthday: "Birthday",
  celebration: "Celebration",
  other: "Other",
}

export function EventInquiryForm() {
  const [state, formAction, pending] = useActionState(submitEventInquiryAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-sm border border-border bg-paper p-8 text-center">
        <h3 className="font-display text-2xl font-light">Inquiry received.</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Our events team will be in touch within one business day to discuss
          your celebration.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventType">Event type</Label>
          <select
            id="eventType"
            name="eventType"
            defaultValue=""
            required
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          >
            <option value="" disabled>
              Select an event type
            </option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {eventTypeLabels[type]}
              </option>
            ))}
          </select>
          {state.fieldErrors?.eventType && (
            <p className="text-xs text-destructive">{state.fieldErrors.eventType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="guestCount">Estimated guests</Label>
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            required
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          />
          {state.fieldErrors?.guestCount && (
            <p className="text-xs text-destructive">{state.fieldErrors.guestCount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">Preferred date</Label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          />
          {state.fieldErrors?.eventDate && (
            <p className="text-xs text-destructive">{state.fieldErrors.eventDate}</p>
          )}
        </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Tell us about your event</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Vision, budget range, must-haves — anything that helps us plan."
          className="rounded-none border-0 border-b border-border px-1"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <MagneticButton type="submit" className="w-full sm:w-auto">
        {pending ? "Sending…" : "Submit Inquiry"}
      </MagneticButton>
    </form>
  )
}
