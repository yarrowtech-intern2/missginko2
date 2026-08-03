import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { getCustomers } from "@/services/admin.service"

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      <AdminPageHeader title="Customers" description={`${customers.length} accounts`} />

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
                <td className="px-4 py-3">{customer.full_name ?? "—"}</td>
                <td className="px-4 py-3">{customer.phone ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{customer.role}</td>
                <td className="px-4 py-3">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No customers yet.</p>
        )}
      </div>
    </div>
  )
}
