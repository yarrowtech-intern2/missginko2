"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StatusActionsProps<S extends string> {
  id: string
  current: S
  options: { value: S; label: string }[]
  action: (id: string, status: S) => Promise<void>
}

export function StatusActions<S extends string>({
  id,
  current,
  options,
  action,
}: StatusActionsProps<S>) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <Button
          key={option.value}
          size="xs"
          variant={option.value === current ? "default" : "outline"}
          disabled={pending || option.value === current}
          onClick={() => startTransition(() => action(id, option.value))}
          className={cn(option.value === current && "pointer-events-none")}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
