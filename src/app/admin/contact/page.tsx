"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { StatusActions } from "@/features/admin/components/status-actions"
import {
  getContactSubmissions,
  updateContactStatus,
  type AdminContactSubmission,
} from "@/services/admin.service"
import type { ContactStatus } from "@/types/database"

const statusOptions = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archive" },
] as const satisfies { value: ContactStatus; label: string }[]

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<AdminContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadSubmissions() {
      try {
        const nextSubmissions = await getContactSubmissions()
        if (active) setSubmissions(nextSubmissions)
      } catch (error) {
        console.error("Failed to load contact submissions:", error)
        if (active) setError("Could not load messages.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSubmissions()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description={loading ? "Loading submissions" : `${submissions.length} submissions`}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading messages...
          </p>
        )}

        {!loading &&
          submissions.map((submission) => (
            <div key={submission.id} className="rounded-lg border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{submission.subject}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {submission.name} - {submission.email}
                    {submission.phone && ` - ${submission.phone}`}
                  </p>
                  <p className="mt-2 text-sm">{submission.message}</p>
                </div>
                <StatusActions
                  id={submission.id}
                  current={submission.status}
                  options={[...statusOptions]}
                  onUpdate={updateContactStatus}
                />
              </div>
            </div>
          ))}

        {!loading && submissions.length === 0 && (
          <p className="rounded-lg border border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  )
}
