import type { Metadata } from "next"
import Link from "next/link"

import { RegisterForm } from "@/features/auth/components/register-form"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Create Account",
  path: "/register",
  noIndex: true,
})

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save your details for faster reservations and leave reviews.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
