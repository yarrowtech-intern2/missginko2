"use client"

import { useState } from "react"

import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { eventInquirySchema, eventTypes } from "@/schemas/event-inquiry.schema"
import { createEventInquiry } from "@/services/events.service"
import type { FieldErrors } from "@/lib/form-errors"
import { getFieldErrors } from "@/lib/form-errors"

interface EventInquiryState {
  success: boolean
  error?: string
  fieldErrors?: FieldErrors
}

const eventTypeLabels: Record<(typeof eventTypes)[number], string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  birthday: "Birthday",
  celebration: "Celebration",
  other: "Other",
}

export function EventInquiryForm() {
  const [state, setState] = useState<EventInquiryState>({ success: false })
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsed = eventInquirySchema.safeParse({
      eventType: formData.get("eventType"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      eventDate: formData.get("eventDate"),
      guestCount: formData.get("guestCount"),
      message: formData.get("message") || undefined,
    })

    if (!parsed.success) {
      setState({
        success: false,
        error: "Please check the highlighted fields.",
        fieldErrors: getFieldErrors(parsed.error),
      })
      return
    }

    setPending(true)
    setState({ success: false })

    try {
      await createEventInquiry(parsed.data)
      form.reset()
      setState({ success: true })
    } catch (error) {
      console.error("Failed to submit event inquiry:", error)
      setState({ success: false, error: "Something went wrong. Please try again." })
    } finally {
      setPending(false)
    }
  }

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
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Vision, budget range, must-haves - anything that helps us plan."
          className="rounded-none border-0 border-b border-border px-1"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <MagneticButton type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending..." : "Submit Inquiry"}
      </MagneticButton>
    </form>
  )
}
