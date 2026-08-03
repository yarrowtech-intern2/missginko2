"use client"

import { cn } from "@/lib/utils"

export function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none flex flex-col items-center gap-3 text-background/80",
        className
      )}
      aria-hidden
    >
      <span className="text-[10px] font-medium tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
        Scroll
      </span>
      <span className="relative h-16 w-px overflow-hidden bg-background/25">
        <span className="absolute inset-x-0 top-0 h-1/2 w-full animate-[scroll-line_1.8s_ease-in-out_infinite] bg-background" />
      </span>
    </div>
  )
}
