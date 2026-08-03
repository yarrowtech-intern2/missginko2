"use client"

import { useEffect, useRef } from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"

/**
 * Magnetic hover: the element eases toward the cursor within its own bounds,
 * then snaps back on leave. Standard Awwwards button/link micro-interaction.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    registerGsap()

    const quickX = gsap.quickTo(el, "x", { duration: 0.5, ease: "snap" })
    const quickY = gsap.quickTo(el, "y", { duration: 0.5, ease: "snap" })

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      quickX(relX * strength)
      quickY(relY * strength)
    }

    const handleLeave = () => {
      quickX(0)
      quickY(0)
    }

    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)

    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
    }
  }, [strength])

  return ref
}
