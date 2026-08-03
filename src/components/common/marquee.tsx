"use client"

import { Fragment, useEffect, useRef, type ReactNode } from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: ReactNode
  speed?: number
  className?: string
  reverse?: boolean
}

/**
 * Infinite horizontal marquee (used for press logos, ingredient callouts,
 * "Reserve Now" ticker). Duplicates children for a seamless loop and pauses
 * respectfully under prefers-reduced-motion.
 */
export function Marquee({ children, speed = 40, className, reverse = false }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth / 2
      const tween = gsap.to(track, {
        x: reverse ? distance : -distance,
        duration: distance / speed,
        ease: "none",
        repeat: -1,
      })
      return () => tween.kill()
    }, track)

    return () => ctx.revert()
  }, [speed, reverse])

  return (
    <div className={cn("no-scrollbar overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max items-center gap-12 whitespace-nowrap will-change-transform">
        {[0, 1].map((i) => (
          <Fragment key={i}>{children}</Fragment>
        ))}
      </div>
    </div>
  )
}
