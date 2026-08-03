import type { Metadata } from "next"

import { MaskedTitle } from "@/components/common/masked-title"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { Timeline } from "@/features/about/components/timeline"
import { TeamGrid } from "@/features/about/components/team-grid"
import { stockImages } from "@/lib/stock-images"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "The story, philosophy, and people behind Miss Ginko.",
  path: "/about",
})

const awards = [
  "Michelin Star — 2022, 2023, 2024, 2025",
  "Michelin Bib Gourmand — 2018",
  "Eater NY, Best New Restaurant — 2017",
  "James Beard Award Semifinalist — 2023",
]

export default function AboutPage() {
  return (
    <div className="bg-background pt-32 pb-28 md:pt-40">
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Our Story
        </span>
        <MaskedTitle
          as="h1"
          className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light"
          immediate
        >
          A decade of quiet obsession.
        </MaskedTitle>
        <Reveal delay={0.15} className="mt-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Miss Ginko began as a ten-seat counter and a single, uncompromising
            idea: that modern Asian fine dining could be intimate rather than
            theatrical. A decade later, the room has grown — the idea hasn&apos;t
            changed.
          </p>
        </Reveal>
      </div>

      <div className="container-editorial mt-24 grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal clip className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <PlaceholderMedia
            label="Kitchen at work — add /images/kitchen.jpg"
            alt="The open kitchen at Miss Ginko during service"
            src={stockImages.kitchen}
            className="absolute inset-0"
          />
        </Reveal>
        <div>
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Philosophy
          </span>
          <h2 className="mt-6 font-display text-[clamp(2rem,1.6rem+2vw,3.5rem)] leading-[1.05] font-light">
            Discipline first. Flavour follows.
          </h2>
          <Reveal delay={0.15} className="mt-6 max-w-md space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Every dish is built from technique before it&apos;s built from
              ingredients — the kind of discipline learned over a decade of
              service, not shortcuts.
            </p>
            <p>
              We cook a small menu exceptionally well rather than a large one
              adequately. That restraint is the whole philosophy.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-editorial mt-28">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Timeline
        </span>
        <h2 className="mt-4 font-display text-3xl font-light">A Decade in the Room</h2>
        <div className="mt-8">
          <Timeline />
        </div>
      </div>

      <div className="container-editorial mt-28">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          The Team
        </span>
        <h2 className="mt-4 font-display text-3xl font-light">The People Behind the Pass</h2>
        <div className="mt-10">
          <TeamGrid />
        </div>
      </div>

      <div className="container-editorial mt-28">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Recognition
        </span>
        <ul className="mt-6 divide-y divide-border border-t border-border">
          {awards.map((award) => (
            <li key={award} className="py-4 text-[15px]">
              {award}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
