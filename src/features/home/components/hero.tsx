"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { MagneticButton } from "@/components/common/magnetic-button"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { ScrollIndicator } from "@/components/common/scroll-indicator"
import { LOADER_COMPLETE_EVENT } from "@/components/layout/loader"
import { gsap, registerGsap, SplitText } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"
import { siteConfig } from "@/config/site"

const HERO_VIDEO_SRC: string | undefined =
  "https://res.cloudinary.com/dc3qprub3/video/upload/v1785745726/hero2_lgqbls.mp4"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const eyebrowRef = useRef<HTMLSpanElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const mediaRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    let cleanupReveal: (() => void) | undefined

    const reveal = () => {
      if (cleanupReveal) return

      registerGsap()
      const heading = headingRef.current
      if (!heading) return

      const ctx = gsap.context(() => {
        const split = SplitText.create(heading, { type: "lines", mask: "lines" })
        gsap.set(split.lines, { yPercent: 110 })
        gsap.set([eyebrowRef.current, ctaRef.current, scrollRef.current], {
          opacity: 0,
          y: 20,
        })
        gsap.set(mediaRef.current, { scale: 1.15 })

        gsap
          .timeline({ defaults: { ease: "premium" } })
          .to(mediaRef.current, { scale: 1, duration: 2.2 }, 0)
          .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
          .to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.35)
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.1)
          .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.3)
      }, heading)

      cleanupReveal = () => ctx.revert()
    }

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      reveal()
      return () => cleanupReveal?.()
    }

    window.addEventListener(LOADER_COMPLETE_EVENT, reveal, { once: true })
    return () => {
      window.removeEventListener(LOADER_COMPLETE_EVENT, reveal)
      cleanupReveal?.()
    }
  }, [])

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink-950">
      <div ref={mediaRef} className="absolute inset-0">
        {HERO_VIDEO_SRC ? (
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <PlaceholderMedia
            label="Cinematic hero footage — add /videos/hero.mp4"
            alt="Dining room at Miss Ginko, dimly lit with warm candlelight"
            className="size-full"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/50" />
      </div>

      <div className="container-editorial relative z-10 flex w-full flex-col gap-10 pb-20 md:pb-28">
        <span
          ref={eyebrowRef}
          className="text-xs font-medium tracking-[0.3em] text-background/70 uppercase"
        >
          {siteConfig.cuisine} · {siteConfig.contact.address.city}
        </span>

        <h1
          ref={headingRef}
          className="max-w-5xl font-display text-[clamp(2.75rem,2.1rem+5.5vw,7.5rem)] leading-[0.95] font-light text-background text-balance"
        >
          Where Flavours
          <br />
          Become Memories
        </h1>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-6">
          <MagneticButton href="/booking">Reserve Table</MagneticButton>
          <MagneticButton href="/menu" variant="outline" className="text-background">
            Explore Menu
          </MagneticButton>
        </div>
      </div>

      <div ref={scrollRef} className="absolute right-8 bottom-10 z-10 md:right-16">
        <ScrollIndicator />
      </div>
    </section>
  )
}
