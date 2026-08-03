import { createPublicClient } from "@/supabase/public"
import type { Database } from "@/types/database"

export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"]

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data ?? []
}
