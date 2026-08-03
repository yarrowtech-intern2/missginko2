import { createClient } from "@/supabase/client"
import type { NewsletterInput } from "@/schemas/newsletter.schema"

export async function subscribeToNewsletter({ email }: NewsletterInput) {
  const supabase = createClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, is_active: true, unsubscribed_at: null },
      { onConflict: "email" }
    )

  if (error) throw error
}
