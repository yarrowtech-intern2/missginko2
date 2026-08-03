import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/features/auth/components/login-form"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  path: "/login",
  noIndex: true,
})

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light">Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leave a review, track reservations, and save your preferences.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="text-foreground underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
