"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { regenerateReviewSummaryAction } from "@/actions/admin.actions"
import { Button } from "@/components/ui/button"

export function RegenerateSummaryButton() {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await regenerateReviewSummaryAction()
          if (result.success) {
            toast.success("Review summary regenerated.")
          } else {
            toast.error(result.error)
          }
        })
      }
    >
      {pending ? "Regenerating…" : "Regenerate AI Summary"}
    </Button>
  )
}
