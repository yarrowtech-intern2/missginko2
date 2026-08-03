import Image from "next/image"

import { cn } from "@/lib/utils"

interface PlaceholderMediaProps {
  label: string
  className?: string
  /** Real asset src — once photography/video stills exist, pass this and the
   * gradient placeholder is skipped automatically. */
  src?: string
  alt?: string
  priority?: boolean
  sizes?: string
}

/**
 * Stand-in for real photography during the placeholder-asset phase of the
 * build. Renders a branded gradient block with a visible label so it never
 * reads as a broken image, and swaps to a real <Image> the moment `src`
 * is supplied — no call-site changes needed later.
 */
export function PlaceholderMedia({
  label,
  className,
  src,
  alt,
  priority,
  sizes = "100vw",
}: PlaceholderMediaProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? label}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[linear-gradient(155deg,var(--color-ink-800)_0%,var(--color-ink-950)_55%,color-mix(in_oklch,var(--primary),var(--color-ink-950)_55%)_100%)]",
        className
      )}
      role="img"
      aria-label={alt ?? label}
    >
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:4px_4px]" />
      <span className="relative px-6 text-center font-sans text-[11px] font-medium tracking-[0.2em] text-background/50 uppercase">
        {label}
      </span>
    </div>
  )
}
