"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"
import { loginSchema } from "@/schemas/auth.schema"
import { createClient } from "@/supabase/client"

interface AuthFormState {
  success: boolean
  error?: string
}

function getRedirectTarget() {
  if (typeof window === "undefined") return "/"

  const redirectTo = new URLSearchParams(window.location.search).get("redirectTo")
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/"
  }

  return redirectTo
}

export function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<AuthFormState>({ success: false })
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!parsed.success) {
      setState({
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      })
      return
    }

    setPending(true)
    setState({ success: false })

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)

    setPending(false)

    if (error) {
      setState({ success: false, error: "Incorrect email or password." })
      return
    }

    router.push(getRedirectTarget())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <MagneticButton type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </MagneticButton>
    </form>
  )
}
