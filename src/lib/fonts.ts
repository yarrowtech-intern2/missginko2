import localFont from "next/font/local"
import { Onest } from "next/font/google"

/**
 * Display — oversized editorial headlines, masked/SplitText reveals.
 * Single-weight local font; components apply weight/tracking via Tailwind,
 * the font file itself only renders at its own built-in weight.
 */
export const fontDisplay = localFont({
  src: "../../public/font/CafeBrasil.woff2",
  variable: "--font-display",
  display: "swap",
})

/**
 * Body / UI sans — set wide-tracked and uppercase for nav & labels, tight for copy.
 */
export const fontBody = Onest({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

/** Loader wordmark only — a distinct display face for the loading curtain. */
export const fontCurtain = localFont({
  src: "../../public/font/segoe.woff2",
  variable: "--font-curtain",
  display: "swap",
})
