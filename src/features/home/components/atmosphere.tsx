import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { MaskedTitle } from "@/components/common/masked-title"
import { ParallaxImage } from "@/components/common/parallax-image"
import { stockImages } from "@/lib/stock-images"

export function Atmosphere() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <ParallaxImage>
          <PlaceholderMedia
            label="Dining room atmosphere — add /images/atmosphere.jpg"
            alt="Guests dining at Miss Ginko under warm ambient light"
            src={stockImages.atmosphere}
            className="size-full"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-ink-950/40" />
      </div>

      <div className="container-editorial relative z-10 text-center">
        <MaskedTitle
          as="h2"
          type="words"
          className="mx-auto max-w-3xl font-display text-[clamp(2.25rem,1.8rem+2.8vw,4.5rem)] leading-[1.05] font-light text-background text-balance"
        >
          A room built for lingering, lit for remembering.
        </MaskedTitle>
      </div>
    </section>
  )
}
