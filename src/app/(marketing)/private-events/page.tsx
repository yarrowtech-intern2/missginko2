import type { Metadata } from "next"

import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { EventInquiryForm } from "@/features/private-events/components/event-inquiry-form"
import { PackageCard } from "@/features/private-events/components/package-card"
import { stockImages } from "@/lib/stock-images"
import { buildMetadata } from "@/seo/metadata"
import { getEventPackages } from "@/services/events.service"

export const metadata: Metadata = buildMetadata({
  title: "Private Events",
  description: "Weddings, corporate dinners, and celebrations at Miss Ginko — private dining and full-room buyouts.",
  path: "/private-events",
})

export const revalidate = 3600

export default async function PrivateEventsPage() {
  let packages: Awaited<ReturnType<typeof getEventPackages>> = []
  try {
    packages = await getEventPackages()
  } catch (error) {
    console.warn("Failed to load event packages from Supabase:", error)
  }

  return (
    <div>
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-ink-950">
        <PlaceholderMedia
          label="Private event setup — add /images/private-events-hero.jpg"
          alt="Private dining room arranged for a corporate event"
          src={stockImages.privateEventsHero}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/40" />
        <div className="container-editorial relative z-10 pb-16">
          <span className="text-xs font-medium tracking-[0.3em] text-background/70 uppercase">
            Private Events
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light text-background">
            Celebrations, Built to Order
          </h1>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container-editorial">
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Packages
          </span>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-light">
            From an intimate dinner to a full buyout
          </h2>

          {packages.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              Package details are being finalized — reach out and our events
              team will build one around your celebration.
            </p>
          ) : (
            <div className="mt-12 grid gap-12 sm:grid-cols-2">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <div className="container-editorial max-w-2xl">
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Enquire
          </span>
          <h2 className="mt-4 font-display text-3xl font-light">
            Tell Us About Your Event
          </h2>
          <div className="mt-10">
            <EventInquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}
