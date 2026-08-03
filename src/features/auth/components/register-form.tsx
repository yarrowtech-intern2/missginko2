"use client"

import { useActionState } from "react"

import { signUpAction, type AuthActionResult } from "@/actions/auth.actions"
import { MagneticButton } from "@/components/common/magnetic-button"
import { Label } from "@/components/ui/label"

const initialState: AuthActionResult = { success: false }

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <input
          id="fullName"
          name="fullName"
          required
          className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
        />
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className="h-12 w-full border-b border-border bg-transparent px-1 text-sm focus:outline-none"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <MagneticButton type="submit" className="w-full">
        {pending ? "Creating account…" : "Create Account"}
      </MagneticButton>
    </form>
  )
}
