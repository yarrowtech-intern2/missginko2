"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Vertical scroll parallax for images inside a fixed-height crop container.
 * `strength` in px of extra travel; positive moves slower than scroll (bg feel).
 */
export function useScrollParallax<T extends HTMLElement>(strength = 80) {
  const ref = useRef<T | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -strength / 10 },
        {
          yPercent: strength / 10,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [strength])

  return ref
}

/**
 * Subtle mouse-parallax for hero/decorative elements — moves toward the
 * cursor within `range` px. Disabled on touch devices and reduced motion.
 */
export function useMouseParallax<T extends HTMLElement>(range = 20) {
  const ref = useRef<T | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    registerGsap()

    const quickX = gsap.quickTo(el, "x", { duration: 0.9, ease: "soft" })
    const quickY = gsap.quickTo(el, "y", { duration: 0.9, ease: "soft" })

    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const relX = (e.clientX / innerWidth - 0.5) * 2
      const relY = (e.clientY / innerHeight - 0.5) * 2
      quickX(relX * range)
      quickY(relY * range)
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [range])

  return ref
}
