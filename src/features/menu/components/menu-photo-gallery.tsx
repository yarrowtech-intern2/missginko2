"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

import { Reveal } from "@/components/common/reveal"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const menuPhotos = [
  {
    src: "https://res.cloudinary.com/dc3qprub3/image/upload/v1789798470/MENU1_id7r5r.avif",
    alt: "Chef's Signature menu page — vegetarian and non-vegetarian starters with prices",
    label: "Chef's Signature",
  },
  {
    src: "https://res.cloudinary.com/dc3qprub3/image/upload/v1789798470/MENU2_t0swfc.avif",
    alt: "Artisanal Signature Cocktails menu page with prices and ingredients",
    label: "Artisanal Signature Cocktails",
  },
]

/** Full-resolution photos of the printed menu, for guests who'd rather browse the real pages than the text list below. */
export function MenuPhotoGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex !== null ? menuPhotos[activeIndex] : null

  const go = (delta: number) => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + delta + menuPhotos.length) % menuPhotos.length)
  }

  return (
    <section className="border-b border-border pb-16">
      <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
        Printed Menu
      </span>
      <h2 className="mt-3 font-display text-2xl font-light sm:text-3xl">
        Browse the Menu Pages
      </h2>

      <div className="mt-6 grid max-w-md grid-cols-2 gap-4">
        {menuPhotos.map((photo, index) => (
          <Reveal key={photo.src} delay={index * 0.08}>
            <button
              onClick={() => setActiveIndex(index)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl ring-1 ring-border"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 220px, 45vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/70 via-transparent to-transparent p-4">
                <span className="flex items-center gap-1.5 text-left text-xs font-medium tracking-wide text-white">
                  <ZoomIn className="size-3.5 shrink-0" /> {photo.label}
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton
          className="max-w-3xl gap-0 border-none bg-transparent p-0 shadow-none ring-0"
        >
          <DialogTitle className="sr-only">{active?.label ?? "Menu page"}</DialogTitle>
          {active && (
            <div className="relative h-[80vh] w-full overflow-hidden rounded-2xl bg-ink-950">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          )}
          <button
            onClick={() => go(-1)}
            aria-label="Previous menu page"
            className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next menu page"
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </DialogContent>
      </Dialog>
    </section>
  )
}
