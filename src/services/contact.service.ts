import { createClient } from "@/supabase/client"
import type { ContactInput } from "@/schemas/contact.schema"

export async function createContactSubmission(input: ContactInput) {
  const supabase = createClient()

  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.subject,
    message: input.message,
  })

  if (error) throw error
}
