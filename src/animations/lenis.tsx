"use client"

import Lenis from "lenis"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { LENIS_CONFIG, REDUCED_MOTION_QUERY } from "@/config/motion"
import { gsap, registerGsap, ScrollTrigger } from "@/animations/gsap"

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

/**
 * Drives Lenis off the GSAP ticker (instead of its own rAF loop) so Lenis
 * scroll position and ScrollTrigger stay perfectly in sync — the standard
 * GSAP + Lenis integration pattern.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [instance, setInstance] = useState<Lenis | null>(null)

  useEffect(() => {
    registerGsap()

    const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
    if (prefersReduced) return

    const lenis = new Lenis(LENIS_CONFIG)
    lenisRef.current = lenis
    // Lenis is a browser-only library that can't be constructed during SSR,
    // so consumers of useLenis() can only receive it post-mount via state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInstance(lenis)

    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    document.documentElement.classList.add("lenis")

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      document.documentElement.classList.remove("lenis")
    }
  }, [])

  return (
    <LenisContext.Provider value={instance}>{children}</LenisContext.Provider>
  )
}
