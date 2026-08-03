"use client"

import { useRef, useState } from "react"

import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { gsap, registerGsap } from "@/animations/gsap"
import { cn } from "@/lib/utils"
import { stockImages } from "@/lib/stock-images"

const dishes = [
  { name: "Charcoal Grilled Wagyu", price: "$88", label: "Wagyu dish plate", image: stockImages.dishes.wagyu },
  { name: "Uni & Koshihikari Rice", price: "$42", label: "Uni rice bowl", image: stockImages.dishes.uniRice },
  { name: "Yuzu Kosho Black Cod", price: "$56", label: "Black cod dish", image: stockImages.dishes.blackCod },
  { name: "Tea-Smoked Duck", price: "$64", label: "Duck dish plate", image: stockImages.dishes.duck },
]

export function SignatureDishes() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const quickPos = useRef<{ x?: (v: number) => void; y?: (v: number) => void }>({})

  const handleMove = (e: React.MouseEvent) => {
    registerGsap()
    if (previewRef.current && !quickPos.current.x) {
      quickPos.current.x = gsap.quickTo(previewRef.current, "x", { duration: 0.5, ease: "soft" })
      quickPos.current.y = gsap.quickTo(previewRef.current, "y", { duration: 0.5, ease: "soft" })
    }
    quickPos.current.x?.(e.clientX)
    quickPos.current.y?.(e.clientY)
  }

  return (
    <section
      className="relative bg-background py-28 md:py-36"
      onMouseMove={handleMove}
      onMouseLeave={() => setVisible(false)}
    >
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Signature Dishes
        </span>

        <ul className="mt-10 border-t border-border">
          {dishes.map((dish, index) => (
            <li key={dish.name} className="border-b border-border">
              <Reveal delay={index * 0.05}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setActive(index)
                    setVisible(true)
                  }}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-6 py-8 text-left transition-colors duration-300",
                    active === index && visible ? "text-primary" : "text-foreground"
                  )}
                >
                  <span className="font-display text-2xl font-light sm:text-4xl">
                    {dish.name}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {dish.price}
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={previewRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-20 hidden h-72 w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl transition-opacity duration-300 md:block",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        <PlaceholderMedia
          label={dishes[active].label}
          alt={dishes[active].name}
          src={dishes[active].image}
          className="absolute inset-0"
        />
      </div>
    </section>
  )
}
