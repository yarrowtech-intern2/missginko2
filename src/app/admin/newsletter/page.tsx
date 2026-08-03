import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { getNewsletterSubscribers } from "@/services/admin.service"

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers()

  return (
    <div>
      <AdminPageHeader title="Newsletter" description={`${subscribers.length} subscribers`} />

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
                <td className="px-4 py-3">{subscriber.is_active ? "Active" : "Unsubscribed"}</td>
                <td className="px-4 py-3">
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>
        )}
      </div>
    </div>
  )
}
