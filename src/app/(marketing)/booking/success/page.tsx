import type { Metadata } from "next"
import { PhoneCall } from "lucide-react"

import { MagneticButton } from "@/components/common/magnetic-button"
import { siteConfig } from "@/config/site"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Reservation Confirmed",
  path: "/booking/success",
  noIndex: true,
})

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  const phoneHref = `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
        Reservation Confirmed
      </span>
      <h1 className="mt-6 max-w-xl font-display text-[clamp(2.25rem,1.8rem+2vw,3.75rem)] leading-[1.05] font-light text-balance">
        We&apos;ll see you soon.
      </h1>
      <p className="mt-6 max-w-md text-sm text-muted-foreground">
        A confirmation has been sent to your email
        {ref && (
          <>
            {" "}
            — reference <span className="font-mono text-foreground">#{ref}</span>
          </>
        )}
        . Need to change something? Reply to that email or call us directly.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={phoneHref}
          className="call-ripple relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#16824a] px-8 py-4 text-xs font-semibold tracking-[0.14em] text-white uppercase shadow-[0_14px_32px_rgba(22,130,74,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0f6f3d] hover:shadow-[0_18px_40px_rgba(22,130,74,0.36)] focus-visible:ring-3 focus-visible:ring-[#16824a]/35 focus-visible:outline-none"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-white/15">
            <PhoneCall className="size-3.5" />
          </span>
          <span>Call {siteConfig.contact.phoneDisplay}</span>
        </a>
        <MagneticButton href="/">Back to Home</MagneticButton>
      </div>
    </div>
  )
}
