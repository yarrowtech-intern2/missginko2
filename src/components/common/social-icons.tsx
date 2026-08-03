import { type SVGProps } from "react"

/**
 * lucide-react no longer ships brand/logo glyphs (Instagram, Facebook,
 * Twitter/X were removed as a trademark-maintenance cleanup), so the
 * handful the footer needs are hand-authored here instead of pulled from
 * a brand-icon package.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.5 3H11.5v7h-3v-7H7v-3h1.5v-2A4 4 0 0 1 12.5 5H15v3.5Z" />
    </svg>
  )
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M4 4l7.5 9.5L4.5 20H7l5.2-5.6L16.5 20H20l-8-10.2L18.8 4h-2.5l-4.7 5.1L7.5 4H4Z" />
    </svg>
  )
}
