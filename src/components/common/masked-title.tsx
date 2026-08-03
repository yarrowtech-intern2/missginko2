"use client"

import { type ElementType, type ReactNode } from "react"

import { useSplitReveal } from "@/animations/hooks/useSplitReveal"
import { cn } from "@/lib/utils"

interface MaskedTitleProps {
  children: ReactNode
  as?: ElementType
  className?: string
  type?: "lines" | "words" | "chars"
  immediate?: boolean
  delay?: number
}

/**
 * Editorial heading with a masked line/word reveal on scroll (or immediately,
 * for the hero H1). Wraps useSplitReveal so every heading in the site
 * animates with identical timing.
 */
export function MaskedTitle({
  children,
  as: Tag = "h2",
  className,
  type = "lines",
  immediate = false,
  delay = 0,
}: MaskedTitleProps) {
  const ref = useSplitReveal<HTMLElement>({ type, immediate, delay })

  return (
    <Tag ref={ref} className={cn("text-balance", className)}>
      {children}
    </Tag>
  )
}
