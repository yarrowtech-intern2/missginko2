import { MaskedTitle } from "@/components/common/masked-title"
import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { stockImages } from "@/lib/stock-images"

export function ChefStory() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <div className="container-editorial grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal clip className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:order-1">
          <PlaceholderMedia
            label="Chef portrait — add /images/chef-portrait.jpg"
            alt="Executive chef plating a dish in the Miss Ginko kitchen"
            src={stockImages.chefPortrait}
            className="absolute inset-0"
          />
        </Reveal>

        <div className="md:order-2">
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            The Chef
          </span>
          <MaskedTitle
            as="h2"
            className="mt-6 font-display text-[clamp(2rem,1.6rem+2vw,3.75rem)] leading-[1.05] font-light"
          >
            Twenty years across Kyoto, Tokyo, and New York kitchens — distilled
            into a single room.
          </MaskedTitle>
          <Reveal delay={0.15} className="mt-8 max-w-md space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Trained under three Michelin-starred kitchens before returning
              to build something smaller, slower, and entirely her own. Every
              dish on the menu passes through her hands before it reaches
              yours.
            </p>
            <p>
              &ldquo;I don&apos;t cook to impress. I cook so you remember
              exactly where you were sitting.&rdquo;
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
