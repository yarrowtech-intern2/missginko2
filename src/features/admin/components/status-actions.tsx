"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StatusActionsProps<S extends string> {
  id: string
  current: S
  options: { value: S; label: string }[]
  onUpdate: (id: string, status: S) => Promise<void>
  onUpdated?: (status: S) => void
}

export function StatusActions<S extends string>({
  id,
  current,
  options,
  onUpdate,
  onUpdated,
}: StatusActionsProps<S>) {
  const [selectedById, setSelectedById] = useState<Partial<Record<string, S>>>({})
  const [pending, setPending] = useState<S | null>(null)
  const selected = selectedById[id] ?? current

  async function handleUpdate(status: S) {
    setPending(status)

    try {
      await onUpdate(id, status)
      setSelectedById((statuses) => ({ ...statuses, [id]: status }))
      onUpdated?.(status)
      toast.success("Status updated.")
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Could not update status.")
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <Button
          key={option.value}
          size="xs"
          variant={option.value === selected ? "default" : "outline"}
          disabled={pending !== null || option.value === selected}
          onClick={() => handleUpdate(option.value)}
          className={cn(option.value === selected && "pointer-events-none")}
        >
          {pending === option.value ? "Saving..." : option.label}
        </Button>
      ))}
    </div>
  )
}
