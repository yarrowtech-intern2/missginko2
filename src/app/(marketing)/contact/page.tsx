import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { MagneticButton } from "@/components/common/magnetic-button"
import { ContactForm } from "@/features/contact/components/contact-form"
import { siteConfig } from "@/config/site"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} — reservations, private events, and general inquiries.`,
  path: "/contact",
})

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.region}`
  )}&output=embed`

  return (
    <div className="bg-background pt-32 pb-28 md:pt-40">
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Contact
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light">
          Get in Touch
        </h1>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    Address
                  </h3>
                  <p className="mt-1 text-[15px]">
                    {siteConfig.contact.address.street}
                    <br />
                    {siteConfig.contact.address.city}, {siteConfig.contact.address.region}{" "}
                    {siteConfig.contact.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    Phone
                  </h3>
                  <a href={`tel:${siteConfig.contact.phone}`} className="mt-1 block text-[15px]">
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    Email
                  </h3>
                  <a href={`mailto:${siteConfig.contact.email}`} className="mt-1 block text-[15px]">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Hours
                </h3>
                <ul className="mt-2 space-y-1">
                  {siteConfig.hours.map((h) => (
                    <li key={h.days} className="text-[15px]">
                      <span className="text-muted-foreground">{h.days}:</span> {h.time}
                    </li>
                  ))}
                </ul>
              </div>

              <MagneticButton href="/booking">Reserve a Table</MagneticButton>
            </div>

            <div className="mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Map to Miss Ginko"
                src={mapSrc}
                className="size-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-light">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
