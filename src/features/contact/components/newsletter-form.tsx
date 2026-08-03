"use client"

import { useActionState } from "react"
import { ArrowRight } from "lucide-react"

import { subscribeNewsletterAction, type ActionResult } from "@/actions/newsletter.actions"
import { cn } from "@/lib/utils"

const initialState: ActionResult = { success: false }

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialState
  )

  return (
    <form action={formAction} className={cn("w-full", className)}>
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
