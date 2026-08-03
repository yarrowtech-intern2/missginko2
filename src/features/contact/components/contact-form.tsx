"use client"

import { useState } from "react"

import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema } from "@/schemas/contact.schema"
import { createContactSubmission } from "@/services/contact.service"
import type { FieldErrors } from "@/lib/form-errors"
import { getFieldErrors } from "@/lib/form-errors"

interface ContactFormState {
  success: boolean
  error?: string
  fieldErrors?: FieldErrors
}

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>({ success: false })
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      subject: formData.get("subject"),
      message: formData.get("message"),
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
      await createContactSubmission(parsed.data)
      form.reset()
      setState({ success: true })
    } catch (error) {
      console.error("Failed to submit contact message:", error)
      setState({ success: false, error: "Something went wrong. Please try again." })
    } finally {
      setPending(false)
    }
  }

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
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <MagneticButton type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </MagneticButton>
    </form>
  )
}
