import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * Brand mark — a self-contained circular badge (own red backdrop baked into
 * the asset), so unlike the old text wordmark it doesn't need a light/dark
 * variant for the transparent-over-video vs. solid navbar states.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={siteConfig.logoUrl}
      alt={siteConfig.name}
      width={2875}
      height={2480}
      priority
      className={cn("h-16 w-auto", className)}
    />
  )
}
