"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

interface UsePinnedSectionOptions {
  /** How much extra scroll distance to pin for, e.g. "+=150%". */
  end?: string
  scrub?: boolean | number
  pinSpacing?: boolean
}

/**
 * Pins a section's container while its children animate through a timeline —
 * used for the storytelling scroll sequences (chef story, ingredients,
 * signature dishes). Returns the container ref and a timeline to populate.
 *
 * On reduced-motion, pinning is skipped entirely and children render statically.
 */
export function usePinnedSection<T extends HTMLElement>({
  end = "+=100%",
  scrub = 1,
  pinSpacing = true,
}: UsePinnedSectionOptions = {}) {
  const ref = useRef<T | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end,
          scrub,
          pin: true,
          pinSpacing,
        },
      })
      timelineRef.current = tl
    }, el)

    return () => {
      timelineRef.current = null
      ctx.revert()
    }
  }, [end, scrub, pinSpacing])

  return { containerRef: ref, timelineRef }
}
