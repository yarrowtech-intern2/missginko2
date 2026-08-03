import { createClient } from "@/supabase/server"
import type { NewsletterInput } from "@/schemas/newsletter.schema"

export async function subscribeToNewsletter({ email }: NewsletterInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, is_active: true, unsubscribed_at: null },
      { onConflict: "email" }
    )

  if (error) throw error
}
