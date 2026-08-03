import { createPublicClient } from "@/supabase/public"
import type { Database } from "@/types/database"

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"]
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"]
export type MenuCategoryWithItems = MenuCategory & { items: MenuItem[] }

/** Public-facing menu: available items only, grouped by category, ordered for display. */
export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const supabase = createPublicClient()

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order", { ascending: true })

  if (categoriesError) throw categoriesError

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true })

  if (itemsError) throw itemsError

  return (categories ?? []).map((category) => ({
    ...category,
    items: (items ?? []).filter((item) => item.category_id === category.id),
  }))
}
