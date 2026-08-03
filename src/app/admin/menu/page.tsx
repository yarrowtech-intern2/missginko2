"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import {
  getAdminMenu,
  type AdminMenuCategory,
  type AdminMenuItem,
} from "@/services/admin.service"

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<AdminMenuCategory[]>([])
  const [items, setItems] = useState<AdminMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadMenu() {
      try {
        const menu = await getAdminMenu()
        if (!active) return
        setCategories(menu.categories)
        setItems(menu.items)
      } catch (error) {
        console.error("Failed to load admin menu:", error)
        if (active) setError("Could not load menu.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMenu()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Menu"
        description="Read-only for now. Manage URL-only item metadata directly in Supabase Studio."
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-8">
        {loading && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading menu...
          </p>
        )}

        {!loading &&
          categories.map((category) => (
            <div key={category.id}>
              <h2 className="font-medium">{category.name}</h2>
              <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-background">
                {items
                  .filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                    >
                      <div>
                        <span>{item.name}</span>
                        {!item.is_available && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (unavailable)
                          </span>
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

        {!loading && categories.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No menu categories yet.
          </p>
        )}
      </div>
    </div>
  )
}
