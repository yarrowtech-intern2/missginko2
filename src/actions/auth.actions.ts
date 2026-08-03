"use server"

import { redirect } from "next/navigation"

import { loginSchema, registerSchema } from "@/schemas/auth.schema"
import { createClient } from "@/supabase/server"

export interface AuthActionResult {
  success: boolean
  error?: string
}

export async function signInAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { success: false, error: "Incorrect email or password." }
  }

  redirect((formData.get("redirectTo") as string) || "/")
}

export async function signUpAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  redirect("/")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
