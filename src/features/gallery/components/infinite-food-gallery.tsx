"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { gsap } from "gsap"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=82`
}

type FoodGalleryImage = {
  title: string
  alt: string
  src: string
}

const foodImages: FoodGalleryImage[] = [
  {
    title: "Garden Grain Bowl",
    alt: "A colorful vegetarian grain bowl with greens, grains, and vegetables",
    src: unsplash("1512621776951-a57141f2eefd"),
  },
  {
    title: "Tomato Pasta",
    alt: "Fresh pasta with tomato sauce, herbs, and grated cheese",
    src: unsplash("1473093295043-cdd812d0e601"),
  },
  {
    title: "Miso Ramen",
    alt: "A bowl of ramen with noodles, egg, greens, and broth",
    src: unsplash("1569718212165-3a8278d5f624"),
  },
  {
    title: "Sushi Selection",
    alt: "Assorted sushi rolls arranged on a serving plate",
    src: unsplash("1579584425555-c3ce17fd4351"),
  },
  {
    title: "Market Salad",
    alt: "A bright salad dish with vegetables, herbs, and citrus",
    src: unsplash("1540189549336-e6e99c3679fe"),
  },
  {
    title: "Margherita Pizza",
    alt: "A margherita pizza with tomato, basil, and melted cheese",
    src: unsplash("1565299624946-b28f40a0ae38"),
  },
  {
    title: "Glazed Salmon",
    alt: "A plated salmon dish with glaze and green garnish",
    src: unsplash("1519708227418-c8fd9a32b7a2"),
  },
  {
    title: "Avocado Toast",
    alt: "Avocado toast with egg and seasoning on a brunch plate",
    src: unsplash("1482049016688-2d3e1b311543"),
  },
  {
    title: "Stirred Noodles",
    alt: "A noodle dish tossed with vegetables and herbs",
    src: unsplash("1555126634-323283e090fa"),
  },
  {
    title: "Fried Rice",
    alt: "A fried rice dish served in a pan with vegetables",
    src: unsplash("1603133872878-684f208fb84b"),
  },
  {
    title: "Berry Dessert",
    alt: "A plated dessert topped with berries and cream",
    src: unsplash("1565958011703-44f9829ba187"),
  },
  {
    title: "Nigiri Set",
    alt: "A set of nigiri and sushi pieces arranged on a platter",
    src: unsplash("1617196034796-73dfa7b1fd56"),
  },
]

const rows = [
  foodImages.slice(0, 4),
  foodImages.slice(4, 8),
  foodImages.slice(8),
]

export function InfiniteFoodGallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRefs = useRef<Array<HTMLDivElement | null>>([])
  const tweensRef = useRef<Array<ReturnType<typeof gsap.to>>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const activeImage = activeIndex === null ? null : foodImages[activeIndex]

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    const ctx = gsap.context(() => {
      tweensRef.current = trackRefs.current.flatMap((track, index) => {
        if (!track) return []

        const reverse = index % 2 === 1
        return gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            duration: [44, 38, 50][index] ?? 46,
            ease: "none",
            repeat: -1,
          }
        )
      })
    }, rootRef)

    return () => {
      tweensRef.current = []
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    tweensRef.current.forEach((tween) => {
      if (activeIndex === null) {
        tween.play()
      } else {
        tween.pause()
      }
    })
  }, [activeIndex])

  function setPaused(paused: boolean) {
    tweensRef.current.forEach((tween) => {
      if (paused) {
        tween.pause()
      } else if (activeIndex === null) {
        tween.play()
      }
    })
  }

  function go(delta: number) {
    setActiveIndex((current) => {
      if (current === null) return current
      return (current + delta + foodImages.length) % foodImages.length
    })
  }

  return (
    <div
      ref={rootRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

      <div className="space-y-5 md:space-y-7">
        {rows.map((row, rowIndex) => {
          const startIndex = rows
            .slice(0, rowIndex)
            .reduce((total, current) => total + current.length, 0)

          return (
            <div key={rowIndex} className="overflow-hidden">
              <div
                ref={(node) => {
                  trackRefs.current[rowIndex] = node
                }}
                className="flex w-max will-change-transform"
              >
                <GalleryImageSet
                  images={row}
                  startIndex={startIndex}
                  onSelect={setActiveIndex}
                />
                <GalleryImageSet
                  images={row}
                  startIndex={startIndex}
                  onSelect={setActiveIndex}
                  duplicate
                />
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={activeImage !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton
          className="max-w-5xl gap-0 border-none bg-transparent p-0 shadow-none ring-0"
        >
          <DialogTitle className="sr-only">
            {activeImage?.title ?? "Food gallery image"}
          </DialogTitle>
          {activeImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted md:aspect-[16/10]">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="min(100vw, 1024px)"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/75 to-transparent p-5 text-background">
                <p className="font-display text-2xl leading-none font-light">
                  {activeImage.title}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm ring-1 ring-foreground/10 transition-colors hover:bg-background md:left-4"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm ring-1 ring-foreground/10 transition-colors hover:bg-background md:right-4"
          >
            <ChevronRight className="size-5" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GalleryImageSet({
  images,
  startIndex,
  onSelect,
  duplicate = false,
}: {
  images: FoodGalleryImage[]
  startIndex: number
  onSelect: (index: number) => void
  duplicate?: boolean
}) {
  return (
    <div
      className="flex gap-4 pr-4 md:gap-6 md:pr-6"
      aria-hidden={duplicate || undefined}
    >
      {images.map((image, index) => (
        <button
          key={`${image.src}-${duplicate ? "duplicate" : "primary"}`}
          type="button"
          tabIndex={duplicate ? -1 : 0}
          onClick={() => onSelect(startIndex + index)}
          className={cn(
            "group relative aspect-square w-[68vw] shrink-0 overflow-hidden rounded-full bg-muted text-center shadow-sm outline-none ring-1 ring-foreground/10 transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary sm:w-[36vw] lg:w-[22vw] xl:w-[18vw]"
          )}
        >
          <Image
            src={image.src}
            alt={duplicate ? "" : image.alt}
            fill
            loading={!duplicate && startIndex === 0 && index < 4 ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 28vw, (min-width: 640px) 42vw, 74vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/5 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
          <p className="absolute inset-x-6 bottom-6 font-display text-xl leading-none font-light text-balance text-background md:text-2xl">
            {image.title}
          </p>
        </button>
      ))}
    </div>
  )
}
