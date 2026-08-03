import { updateContactStatusAction } from "@/actions/admin.actions"
import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { StatusActions } from "@/features/admin/components/status-actions"
import { getContactSubmissions } from "@/services/admin.service"

const statusOptions = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archive" },
] as const

export default async function AdminContactPage() {
  const submissions = await getContactSubmissions()

  return (
    <div>
      <AdminPageHeader title="Messages" description={`${submissions.length} submissions`} />

      <div className="mt-8 space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="rounded-lg border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{submission.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {submission.name} · {submission.email}
                  {submission.phone && ` · ${submission.phone}`}
                </p>
                <p className="mt-2 text-sm">{submission.message}</p>
              </div>
              <StatusActions
                id={submission.id}
                current={submission.status}
                options={[...statusOptions]}
                action={updateContactStatusAction}
              />
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  )
}
