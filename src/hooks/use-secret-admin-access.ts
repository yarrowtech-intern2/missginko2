"use client"

import { useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

const CLICK_THRESHOLD = 5
const CLICK_WINDOW_MS = 1200

/**
 * Attach to an onClick handler (e.g. the navbar logo). Five clicks within
 * the window navigate to /admin instead of following the link's normal
 * href; anything short of that behaves exactly like a normal click.
 */
export function useSecretAdminAccess() {
  const router = useRouter()
  const clicksRef = useRef<number[]>([])

  return useCallback(
    (event: React.MouseEvent) => {
      const now = Date.now()
      const recentClicks = [...clicksRef.current, now].filter(
        (timestamp) => now - timestamp < CLICK_WINDOW_MS
      )
      clicksRef.current = recentClicks

      if (recentClicks.length >= CLICK_THRESHOLD) {
        event.preventDefault()
        clicksRef.current = []
        router.push("/admin")
      }
    },
    [router]
  )
}
