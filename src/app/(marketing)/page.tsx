import type { Metadata } from "next"

import { Atmosphere } from "@/features/home/components/atmosphere"
import { ChefStory } from "@/features/home/components/chef-story"
import { Hero } from "@/features/home/components/hero"
import { Ingredients } from "@/features/home/components/ingredients"
import { JourneyCta } from "@/features/home/components/journey-cta"
import { Philosophy } from "@/features/home/components/philosophy"
import { PrivateDiningTeaser } from "@/features/home/components/private-dining"
import { SignatureDishes } from "@/features/home/components/signature-dishes"
import { WineSelection } from "@/features/home/components/wine-selection"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Modern Asian Fine Dining",
  path: "/",
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ChefStory />
      <Ingredients />
      <SignatureDishes />
      <Atmosphere />
      <PrivateDiningTeaser />
      <WineSelection />
      <JourneyCta />
    </>
  )
}
