"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { newsletterSchema } from "@/schemas/newsletter.schema"
import { subscribeToNewsletter } from "@/services/newsletter.service"
import { cn } from "@/lib/utils"

interface NewsletterState {
  success: boolean
  error?: string
}

export function NewsletterForm({ className }: { className?: string }) {
  const [state, setState] = useState<NewsletterState>({ success: false })
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsed = newsletterSchema.safeParse({ email: formData.get("email") })

    if (!parsed.success) {
      setState({
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid email.",
      })
      return
    }

    setPending(true)
    setState({ success: false })

    try {
      await subscribeToNewsletter(parsed.data)
      form.reset()
      setState({ success: true })
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error)
      setState({ success: false, error: "Something went wrong. Please try again." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="flex items-end gap-4 border-b border-current/30 pb-3">
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          className="w-full bg-transparent text-sm placeholder:text-current/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe to newsletter"
          className="shrink-0 transition-transform duration-300 hover:translate-x-1 disabled:opacity-50"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
      <p className="mt-2 min-h-4 text-xs text-current/60" role="status">
        {state.success && "You're on the list."}
        {state.error}
      </p>
    </form>
  )
}
