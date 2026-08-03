"use client"

import Link from "next/link"
import { type ComponentProps, type ReactNode } from "react"

import { useMagnetic } from "@/animations/hooks/useMagnetic"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  href?: string
  children: ReactNode
  className?: string
  variant?: "solid" | "outline" | "ghost"
  onClick?: ComponentProps<"button">["onClick"]
  type?: ComponentProps<"button">["type"]
  disabled?: boolean
  /** Render only the magnetic visual, no own <a>/<button> — use when an
   * ancestor (e.g. a Base UI SheetClose `render` prop) already supplies the
   * interactive element, to avoid nesting a button inside an anchor. */
  static?: boolean
}

const variants: Record<NonNullable<MagneticButtonProps["variant"]>, string> = {
  solid:
    "bg-primary text-primary-foreground hover:bg-ink-900 dark:hover:bg-ink-100",
  outline:
    "border border-current bg-transparent hover:bg-foreground hover:text-background",
  ghost: "bg-transparent text-foreground hover:text-primary",
}

/**
 * Wraps a link/button in a magnetic-hover container. The inner element
 * scales/moves toward the cursor; label text underlines on hover.
 */
export function MagneticButton({
  href,
  children,
  className,
  variant = "solid",
  onClick,
  type = "button",
  disabled = false,
  static: isStatic = false,
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLDivElement>(0.35)

  const content = (
    <div
      ref={ref}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-medium tracking-[0.14em] uppercase transition-colors duration-300",
        variants[variant],
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
    </div>
  )

  if (isStatic) {
    return content
  }

  if (href) {
    return (
      <Link href={href} className="inline-block" aria-label={typeof children === "string" ? children : undefined}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  )
}
