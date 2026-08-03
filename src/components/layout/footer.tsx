import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { NewsletterForm } from "@/features/contact/components/newsletter-form"
import { Logo } from "@/components/common/logo"
import { MagneticButton } from "@/components/common/magnetic-button"
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/common/social-icons"
import { siteConfig } from "@/config/site"

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
}

export function Footer() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.region}`
  )}`

  return (
    <footer className="bg-background text-foreground">
      <div className="container-editorial py-20 md:py-28">
        <div className="flex flex-col justify-between gap-16 border-b border-border pb-16 md:flex-row">
          <div className="max-w-md">
            <Logo className="h-20" />
            <p className="mt-8 font-display text-3xl leading-tight font-light md:text-4xl">
              {siteConfig.tagline}.
            </p>
            <div className="mt-10">
              <MagneticButton href="/booking" variant="outline">
                Reserve a Table
              </MagneticButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Explore
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {siteConfig.footerLinks.explore.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Company
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {siteConfig.footerLinks.company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Hours
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {siteConfig.hours.map((h) => (
                  <li key={h.days} className="text-sm">
                    <span className="block text-muted-foreground">{h.days}</span>
                    {h.time}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-16 py-16 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Newsletter
            </h3>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Seasonal menus, chef&apos;s table dates, and private dining
              openings — no more than once a month.
            </p>
            <NewsletterForm className="mt-6 max-w-sm" />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Follow
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <a
                    key={i}
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View on Instagram"
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,color-mix(in_oklch,var(--primary),transparent_60%)_100%)] transition-opacity duration-500 group-hover:opacity-60" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5">
              {Object.entries(siteConfig.socials).map(([key, href]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons]
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="size-5" />
                  </a>
                )
              })}
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Get directions <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            {siteConfig.contact.address.street}, {siteConfig.contact.address.city}{" "}
            {siteConfig.contact.address.postalCode}
          </p>
        </div>
      </div>
    </footer>
  )
}
