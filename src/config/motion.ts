/**
 * Single source of truth for timing/easing so GSAP timelines, CSS transitions,
 * and Tailwind utility classes never drift out of sync with each other.
 */
export const EASE = {
  // Primary "luxury" ease — slow start, decisive settle. Used for reveals & pins.
  premium: "cubic-bezier(0.16, 1, 0.3, 1)",
  // Softer ease for hover/micro-interactions.
  soft: "cubic-bezier(0.25, 1, 0.5, 1)",
  // Snappy ease for cursor/magnetic follow.
  snap: "cubic-bezier(0.33, 1, 0.68, 1)",
} as const

// GSAP-specific ease strings (registered as CustomEase in animations/gsap.ts)
export const GSAP_EASE = {
  premium: "premium",
  soft: "soft",
  snap: "snap",
  entrance: "power3.out",
  exit: "power2.inOut",
} as const

export const DURATION = {
  instant: 0.2,
  fast: 0.45,
  base: 0.8,
  slow: 1.2,
  cinematic: 1.8,
} as const

export const STAGGER = {
  tight: 0.03,
  base: 0.06,
  loose: 0.12,
} as const

export const LENIS_CONFIG = {
  duration: 1.2,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 1.5,
} as const

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
