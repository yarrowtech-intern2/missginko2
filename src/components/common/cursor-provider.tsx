"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { gsap, registerGsap } from "@/animations/gsap"
import { REDUCED_MOTION_QUERY } from "@/config/motion"

type CursorLabel = "view" | "drag" | "close" | null

interface CursorContextValue {
  setLabel: (label: CursorLabel) => void
}

const CursorContext = createContext<CursorContextValue>({
  setLabel: () => {},
})

export function useCursorLabel() {
  return useContext(CursorContext)
}

/**
 * Single global custom cursor: a small dot plus a lagging ring, with an
 * optional text label (e.g. "View", "Drag") set by hovered elements via
 * useCursorLabel(). Desktop pointer only — untouched on mobile/tablet.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [label, setLabelState] = useState<CursorLabel>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
    // matchMedia is unavailable during SSR; start disabled (matching the
    // server-rendered markup) and flip on post-mount once we can check it,
    // rather than risk a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isFinePointer && !reduced)
  }, [])

  useEffect(() => {
    if (!enabled) return
    registerGsap()

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const quickDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "none" })
    const quickDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "none" })
    const quickRingX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "soft" })
    const quickRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "soft" })

    const handleMove = (e: MouseEvent) => {
      quickDotX(e.clientX)
      quickDotY(e.clientY)
      quickRingX(e.clientX)
      quickRingY(e.clientY)
    }

    document.documentElement.classList.add("cursor-none-desktop")
    window.addEventListener("mousemove", handleMove)

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop")
      window.removeEventListener("mousemove", handleMove)
    }
  }, [enabled])

  const setLabel = useCallback((next: CursorLabel) => setLabelState(next), [])
  const value = useMemo(() => ({ setLabel }), [setLabel])

  return (
    <CursorContext.Provider value={value}>
      {children}
      {enabled && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
          <div
            ref={ringRef}
            className="fixed top-0 left-0 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/25 mix-blend-difference transition-[width,height] duration-300"
            style={{ width: label ? 96 : 44, height: label ? 96 : 44 }}
          >
            {label && (
              <span className="font-sans text-[11px] font-medium tracking-[0.12em] text-background uppercase">
                {label}
              </span>
            )}
          </div>
          <div
            ref={dotRef}
            className="fixed top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          />
        </div>
      )}
    </CursorContext.Provider>
  )
}
