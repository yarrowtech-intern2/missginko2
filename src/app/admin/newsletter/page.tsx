"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import {
  getNewsletterSubscribers,
  type AdminNewsletterSubscriber,
} from "@/services/admin.service"

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<AdminNewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadSubscribers() {
      try {
        const nextSubscribers = await getNewsletterSubscribers()
        if (active) setSubscribers(nextSubscribers)
      } catch (error) {
        console.error("Failed to load newsletter subscribers:", error)
        if (active) setError("Could not load subscribers.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSubscribers()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description={loading ? "Loading subscribers" : `${subscribers.length} subscribers`}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="px-4 py-3">{subscriber.email}</td>
                <td className="px-4 py-3">
                  {subscriber.is_active ? "Active" : "Unsubscribed"}
                </td>
                <td className="px-4 py-3">
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Loading subscribers...
          </p>
        )}
        {!loading && subscribers.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>
        )}
      </div>
    </div>
  )
}
