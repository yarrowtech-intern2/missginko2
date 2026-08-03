"use client"

import { useEffect, useState } from "react"

import { checkAvailabilityAction } from "@/actions/booking.actions"
import type { BookingArea } from "@/types/database"
import { cn } from "@/lib/utils"

interface AvailabilityBadgeProps {
  date?: string
  time?: string
  area?: BookingArea
  partySize: number
}

export function AvailabilityBadge({ date, time, area, partySize }: AvailabilityBadgeProps) {
  const [covers, setCovers] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Nothing to check yet — the component renders null in this state
    // anyway (see below), so there's no stale value to clear.
    if (!date || !time || !area) return

    let cancelled = false
    // Kicking off a debounced fetch in response to date/time/area changing
    // is exactly what this effect exists to do; the loading flag reflects
    // that fetch's lifecycle, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)

    const timeout = setTimeout(async () => {
      const result = await checkAvailabilityAction(date, time, area)
      if (!cancelled) {
        setCovers(result.covers)
        setLoading(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [date, time, area])

  if (!date || !time || !area) return null

  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs",
        loading
          ? "text-muted-foreground"
          : covers === null
            ? "text-muted-foreground"
            : covers >= partySize
              ? "text-primary"
              : "text-destructive"
      )}
      role="status"
    >
      <span className="relative flex size-1.5">
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-75",
            !loading && covers !== null && "animate-ping",
            covers === null || loading
              ? "bg-muted-foreground"
              : covers >= partySize
                ? "bg-primary"
                : "bg-destructive"
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            covers === null || loading
              ? "bg-muted-foreground"
              : covers >= partySize
                ? "bg-primary"
                : "bg-destructive"
          )}
        />
      </span>
      {loading
        ? "Checking availability…"
        : covers === null
          ? "Availability unknown — we'll confirm by email."
          : covers >= partySize
            ? `${covers} seats available at this time`
            : `Only ${covers} seats left — try another time`}
    </p>
  )
}
