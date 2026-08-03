import type { Metadata } from "next"

import { InfiniteFoodGallery } from "@/features/gallery/components/infinite-food-gallery"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "A visual tour of food dishes and table moments at Miss Ginko.",
  path: "/gallery",
})

export default function GalleryPage() {
  return (
    <div className="bg-background pt-32 pb-20 md:pt-40">
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Gallery
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light">
          Dishes in Motion
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground md:text-lg">
          A moving collection of plated dishes, seasonal bowls, sushi, noodles,
          and desserts.
        </p>

        <div className="mt-12 md:mt-16">
          <InfiniteFoodGallery />
        </div>
      </div>
    </div>
  )
}
