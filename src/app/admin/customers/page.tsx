"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { getCustomers, type AdminCustomer } from "@/services/admin.service"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadCustomers() {
      try {
        const nextCustomers = await getCustomers()
        if (active) setCustomers(nextCustomers)
      } catch (error) {
        console.error("Failed to load customers:", error)
        if (active) setError("Could not load customers.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCustomers()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description={loading ? "Loading accounts" : `${customers.length} accounts`}
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
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">{customer.full_name ?? "-"}</td>
                <td className="px-4 py-3">{customer.phone ?? "-"}</td>
                <td className="px-4 py-3 capitalize">{customer.role}</td>
                <td className="px-4 py-3">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <p className="p-8 text-center text-sm text-muted-foreground">Loading customers...</p>
        )}
        {!loading && customers.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No customers yet.</p>
        )}
      </div>
    </div>
  )
}
