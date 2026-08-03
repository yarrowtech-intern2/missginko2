"use client"

import { type ReactNode } from "react"

import { useScrollParallax } from "@/animations/hooks/useParallax"
import { cn } from "@/lib/utils"

/**
 * Wraps a full-bleed image in an oversized container so it has vertical
 * travel room to parallax within its parent's clipped bounds.
 */
export function ParallaxImage({
  children,
  strength = 80,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useScrollParallax<HTMLDivElement>(strength)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={ref} className={cn("absolute inset-x-0 -top-[12%] h-[124%]", className)}>
        {children}
      </div>
    </div>
  )
}
