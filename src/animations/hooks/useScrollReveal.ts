"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

interface UseScrollRevealOptions {
  y?: number
  scale?: number
  clipPath?: [string, string]
  duration?: number
  delay?: number
  start?: string
  ease?: string
}

/**
 * Generic scroll-triggered reveal for images/panels/blocks: fade + rise,
 * optional scale-in or clip-path wipe. One shared implementation so every
 * section animates with identical timing/easing instead of ad-hoc tweens.
 */
export function useScrollReveal<T extends HTMLElement>({
  y = 60,
  scale,
  clipPath,
  duration = 1.1,
  delay = 0,
  start = "top 85%",
  ease = "premium",
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = { opacity: 0, y }
      const toVars: gsap.TweenVars = { opacity: 1, y: 0, duration, delay, ease }

      if (scale) {
        fromVars.scale = scale
        toVars.scale = 1
      }
      if (clipPath) {
        fromVars.clipPath = clipPath[0]
        toVars.clipPath = clipPath[1]
      }

      gsap.set(el, fromVars)
      gsap.to(el, {
        ...toVars,
        scrollTrigger: { trigger: el, start },
      })
    }, el)

    return () => ctx.revert()
  }, [y, scale, clipPath, duration, delay, start, ease])

  return ref
}
