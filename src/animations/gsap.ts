"use client"

import { CustomEase } from "gsap/CustomEase"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

let registered = false

/**
 * Registers GSAP plugins and our named custom eases exactly once,
 * regardless of how many client components import this module.
 */
export function registerGsap() {
  if (registered) return gsap

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

  CustomEase.create("premium", "0.16, 1, 0.3, 1")
  CustomEase.create("soft", "0.25, 1, 0.5, 1")
  CustomEase.create("snap", "0.33, 1, 0.68, 1")

  gsap.defaults({ ease: "soft", duration: 0.8 })

  registered = true
  return gsap
}

export { gsap, ScrollTrigger, SplitText }
