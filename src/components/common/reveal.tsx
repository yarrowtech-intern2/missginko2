"use client"

import { type ReactNode } from "react"

import { useScrollReveal } from "@/animations/hooks/useScrollReveal"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  y?: number
  scale?: number
  delay?: number
  clip?: boolean
}

/**
 * Generic fade/rise-in-on-scroll wrapper for images, panels, and copy blocks.
 * `clip` adds a clip-path wipe for full-bleed image reveals.
 */
export function Reveal({ children, className, y, scale, delay, clip }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    y,
    scale,
    delay,
    // `round` keeps the clip-path itself rounded so the reveal doesn't square
    // off a rounded-corner image (clip-path ignores border-radius otherwise).
    clipPath: clip
      ? ["inset(100% 0% 0% 0% round 1rem)", "inset(0% 0% 0% 0% round 1rem)"]
      : undefined,
  })

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
