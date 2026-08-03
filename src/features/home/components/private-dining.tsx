import { MaskedTitle } from "@/components/common/masked-title"
import { MagneticButton } from "@/components/common/magnetic-button"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { stockImages } from "@/lib/stock-images"

export function PrivateDiningTeaser() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <div className="container-editorial grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Private Dining
          </span>
          <MaskedTitle
            as="h2"
            className="mt-6 font-display text-[clamp(2rem,1.6rem+2vw,3.75rem)] leading-[1.05] font-light"
          >
            An intimate room for the moments that deserve one.
          </MaskedTitle>
          <Reveal delay={0.15} className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Seating up to eighteen, our private room hosts everything from
              quiet celebrations to full chef&apos;s table experiences — with
              a menu built around your evening.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <MagneticButton href="/private-events">Enquire for Private Events</MagneticButton>
          </Reveal>
        </div>

        <Reveal clip className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <PlaceholderMedia
            label="Private dining room — add /images/private-room.jpg"
            alt="Private dining room set for an intimate celebration"
            src={stockImages.privateDiningRoom}
            className="absolute inset-0"
          />
        </Reveal>
      </div>
    </section>
  )
}
