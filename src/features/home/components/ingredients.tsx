"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"
import { stockImages } from "@/lib/stock-images"

const ingredients = [
  { name: "Hokkaido Uni", origin: "Hokkaido, Japan", note: "Flown in twice weekly, served within 48 hours of harvest.", image: stockImages.ingredients.uni },
  { name: "Wagyu A5", origin: "Miyazaki, Japan", note: "Grass-finished, dry-aged in house for eighteen days.", image: stockImages.ingredients.wagyu },
  { name: "Yuzu", origin: "Kochi, Japan", note: "Hand-zested to order — never bottled, never frozen.", image: stockImages.ingredients.yuzu },
  { name: "Binchotan Charcoal", origin: "Wakayama, Japan", note: "White charcoal burned at 1000°C for a cleaner smoke.", image: stockImages.ingredients.charcoal },
  { name: "Heirloom Rice", origin: "Niigata, Japan", note: "Koshihikari grain, milled weekly in small batches.", image: stockImages.ingredients.rice },
]

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

export function Ingredients() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    registerGsap()

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - section.clientWidth
      if (distance <= 0) return

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance + window.innerHeight}`,
          scrub: 1,
          pin: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-28 md:py-0 md:h-screen">
      <div className="container-editorial flex h-full flex-col justify-center gap-12 md:py-24">
        <div>
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Ingredients
          </span>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,1.6rem+2vw,3.5rem)] leading-[1.05] font-light">
            Sourced with the same obsession a jeweller gives a stone.
          </h2>
        </div>

        <div className="no-scrollbar overflow-x-hidden">
          <div ref={trackRef} className="flex w-max gap-6 will-change-transform">
            {ingredients.map((item) => (
              <article
                key={item.name}
                className="relative flex h-[22rem] w-[20rem] flex-col justify-end overflow-hidden rounded-2xl sm:h-[26rem] sm:w-[24rem]"
              >
                <PlaceholderMedia
                  label={`${item.name} — add photo`}
                  alt={item.name}
                  src={item.image}
                  className="absolute inset-0"
                />
                <div className="relative z-10 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent p-6">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-background/60 uppercase">
                    {item.origin}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-background">{item.name}</h3>
                  <p className="mt-2 text-sm text-background/70">{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
