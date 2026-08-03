import { MagneticButton } from "@/components/common/magnetic-button"
import { MaskedTitle } from "@/components/common/masked-title"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { ParallaxImage } from "@/components/common/parallax-image"
import { stockImages } from "@/lib/stock-images"

export function JourneyCta() {
  return (
    <section className="relative flex h-[80vh] min-h-[560px] items-center justify-center overflow-hidden">
      <ParallaxImage strength={60}>
        <PlaceholderMedia
          label="Tasting menu course — add /images/journey.jpg"
          alt="Close-up of a plated tasting menu course"
          src={stockImages.journeyCourse}
          className="size-full"
        />
      </ParallaxImage>
      <div className="absolute inset-0 bg-ink-950/55" />

      <div className="container-editorial relative z-10 flex flex-col items-center gap-10 text-center">
        <MaskedTitle
          as="h2"
          className="max-w-3xl font-display text-[clamp(2.25rem,1.8rem+2.8vw,4.5rem)] leading-[1.05] font-light text-background text-balance"
        >
          The tasting menu is the whole journey. Reserve your seat at the table.
        </MaskedTitle>
        <MagneticButton href="/booking">Reserve Table</MagneticButton>
      </div>
    </section>
  )
}
