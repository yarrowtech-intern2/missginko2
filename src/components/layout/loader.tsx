"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { gsap, registerGsap, SplitText } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"
import { siteConfig } from "@/config/site"

export const LOADER_COMPLETE_EVENT = "loader:complete"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Full-screen luxury loader shown once on initial app boot (root layout only
 * mounts on a hard navigation, never on client-side route changes). Masks the
 * wordmark in, counts a progress percentage tied to `window.load`, then wipes
 * away and dispatches LOADER_COMPLETE_EVENT so the hero can start its own
 * entrance timeline in sync.
 */
export function Loader() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const counterRef = useRef<HTMLSpanElement | null>(null)
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null)
  const [hidden, setHidden] = useState(false)

  useIsomorphicLayoutEffect(() => {
    let completed = false

    const complete = () => {
      if (completed) return
      completed = true
      document.documentElement.style.overflow = ""
      setHidden(true)
      window.dispatchEvent(new CustomEvent(LOADER_COMPLETE_EVENT))
    }

    const forceHide = window.setTimeout(complete, 4200)

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      // Reduced-motion preference is unreadable during SSR; skip the loader
      // entirely post-mount instead of ever rendering its animation.
      complete()
      return () => window.clearTimeout(forceHide)
    }

    document.documentElement.style.overflow = "hidden"

    const root = rootRef.current
    const counter = counterRef.current
    const wordmark = wordmarkRef.current
    if (!root || !counter || !wordmark) {
      complete()
      return () => window.clearTimeout(forceHide)
    }

    const progress = { value: 0 }
    let pageLoaded = false
    let splitReverted = false
    let finishCall: gsap.core.Tween | undefined
    let tl: gsap.core.Timeline | undefined

    try {
      registerGsap()

      const split = SplitText.create(wordmark, { type: "chars", mask: "chars" })
      gsap.set(split.chars, { yPercent: 110 })

      const revertSplit = () => {
        if (splitReverted) return
        split.revert()
        splitReverted = true
      }

      tl = gsap.timeline()

      tl.to(split.chars, {
        yPercent: 0,
        duration: 1,
        ease: "premium",
        stagger: 0.03,
      }).to(
        progress,
        {
          value: 92,
          duration: 2.2,
          ease: "soft",
          onUpdate: () => {
            counter.textContent = String(Math.floor(progress.value)).padStart(2, "0")
          },
        },
        "-=0.4"
      )

      const finish = () => {
        if (pageLoaded || completed) return
        pageLoaded = true

        gsap
          .timeline({
            onComplete: () => {
              window.clearTimeout(forceHide)
              complete()
            },
          })
          .to(progress, {
            value: 100,
            duration: 0.5,
            ease: "soft",
            onUpdate: () => {
              counter.textContent = String(Math.floor(progress.value)).padStart(2, "0")
            },
          })
          .to([wordmark, counter], {
            opacity: 0,
            duration: 0.4,
            ease: "soft",
          })
          .to(root, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.9,
            ease: "premium",
            onComplete: () => {
              root.style.pointerEvents = "none"
            },
          })
          .eventCallback("onComplete", () => {
            revertSplit()
            window.clearTimeout(forceHide)
            complete()
          })
      }

      const handleLoad = () => {
        finishCall?.kill()
        finishCall = gsap.delayedCall(0.6, finish)
      }

      if (document.readyState === "complete") {
        finishCall = gsap.delayedCall(1.4, finish)
      } else {
        window.addEventListener("load", handleLoad)
        finishCall = gsap.delayedCall(3.2, finish)
      }

      return () => {
        window.clearTimeout(forceHide)
        window.removeEventListener("load", handleLoad)
        finishCall?.kill()
        tl?.kill()
        revertSplit()
        document.documentElement.style.overflow = ""
      }
    } catch (error) {
      console.error("Loader animation failed:", error)
      complete()
      return () => window.clearTimeout(forceHide)
    }
  }, [])

  if (hidden) return null

  return (
    <div
      ref={rootRef}
      className="loader-failsafe fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-background text-foreground"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${siteConfig.name}`}
    >
      <h1
        ref={wordmarkRef}
        className="font-curtain text-[clamp(1.75rem,1rem+7vw,3rem)] leading-none font-light tracking-[0.1em] text-center uppercase sm:text-[clamp(3rem,2rem+7vw,8rem)] sm:tracking-[0.15em]"
      >
        {siteConfig.name}
      </h1>
      <span
        ref={counterRef}
        className="font-mono text-sm tracking-[0.2em] text-muted-foreground"
      >
        00
      </span>
    </div>
  )
}
