import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { createClient } from "@/supabase/server"

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ])

  return (
    <div>
      <AdminPageHeader
        title="Menu"
        description="Read-only for now — manage categories and items directly in Supabase Studio until the CRUD screens ship."
      />

      <div className="mt-8 space-y-8">
        {(categories ?? []).map((category) => (
          <div key={category.id}>
            <h2 className="font-medium">{category.name}</h2>
            <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-background">
              {(items ?? [])
                .filter((item) => item.category_id === category.id)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <span>{item.name}</span>
                      {!item.is_available && (
                        <span className="ml-2 text-xs text-muted-foreground">(unavailable)</span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.price} {item.currency}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
