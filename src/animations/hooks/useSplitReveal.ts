"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { gsap, registerGsap, SplitText } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY, STAGGER } from "@/config/motion"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

type SplitType = "lines" | "words" | "chars"

interface UseSplitRevealOptions {
  type?: SplitType
  /** Delay before the reveal starts, in seconds. */
  delay?: number
  /** Play immediately on mount instead of on scroll-into-view. */
  immediate?: boolean
  /** ScrollTrigger start position. */
  start?: string
  stagger?: number
  y?: number
}

/**
 * Masks and reveals text (line/word/char) via GSAP SplitText, either
 * immediately (hero headline) or on scroll (editorial section headings).
 * Respects prefers-reduced-motion by rendering the text statically.
 */
export function useSplitReveal<T extends HTMLElement>({
  type = "lines",
  delay = 0,
  immediate = false,
  start = "top 80%",
  stagger = STAGGER.base,
  y = 100,
}: UseSplitRevealOptions = {}) {
  const ref = useRef<T | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type,
        mask: type,
        autoSplit: true,
      })

      const targets =
        type === "lines" ? split.lines : type === "words" ? split.words : split.chars

      gsap.set(targets, { yPercent: 110 })

      const tween = gsap.to(targets, {
        yPercent: 0,
        duration: 1,
        ease: "premium",
        stagger,
        delay,
        scrollTrigger: immediate
          ? undefined
          : {
              trigger: el,
              start,
            },
      })

      return () => {
        tween.kill()
        split.revert()
      }
    }, el)

    return () => ctx.revert()
  }, [type, delay, immediate, start, stagger, y])

  return ref
}
