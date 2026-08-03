"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { GalleryCategory } from "@/types/database"
import type { GalleryImage } from "@/services/gallery.service"

const categories: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "interior", label: "Interior" },
  { value: "food", label: "Food" },
  { value: "events", label: "Events" },
  { value: "team", label: "Team" },
]

const aspectRatios = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"]

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const filtered = useMemo(
    () => (filter === "all" ? images : images.filter((img) => img.category === filter)),
    [images, filter]
  )

  const active = activeIndex !== null ? filtered[activeIndex] : null

  const go = (delta: number) => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + delta + filtered.length) % filtered.length)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.1em] uppercase transition-colors duration-300",
              filter === c.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <Reveal
            key={image.id}
            delay={(index % 6) * 0.06}
            className="mb-4 break-inside-avoid"
          >
            <button
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative block w-full overflow-hidden rounded-2xl",
                aspectRatios[index % aspectRatios.length]
              )}
            >
              <PlaceholderMedia
                label={image.title ?? "Add photo"}
                alt={image.alt}
                src={image.image_url || undefined}
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/20" />
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton
          className="max-w-4xl gap-0 border-none bg-transparent p-0 shadow-none ring-0"
        >
          <DialogTitle className="sr-only">{active?.alt ?? "Gallery image"}</DialogTitle>
          {active && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <PlaceholderMedia
                label={active.title ?? "Add photo"}
                alt={active.alt}
                src={active.image_url || undefined}
                className="absolute inset-0"
              />
            </div>
          )}
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
