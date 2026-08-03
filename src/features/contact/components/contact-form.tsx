"use client"

import { useActionState } from "react"

import { submitContactAction, type ContactActionResult } from "@/actions/contact.actions"
import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ContactActionResult = { success: false }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-sm border border-border bg-paper p-8 text-center">
        <h3 className="font-display text-2xl font-light">Message sent.</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            name="name"
            required
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          />
          {state.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
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
          <Label htmlFor="phone">Phone (optional)</Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <input
            id="subject"
            name="subject"
            required
            className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
          />
          {state.fieldErrors?.subject && (
            <p className="text-xs text-destructive">{state.fieldErrors.subject}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-none border-0 border-b border-border px-1"
        />
        {state.fieldErrors?.message && (
          <p className="text-xs text-destructive">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <MagneticButton type="submit">{pending ? "Sending…" : "Send Message"}</MagneticButton>
    </form>
  )
}
