import { Marquee } from "@/components/common/marquee"
import { MaskedTitle } from "@/components/common/masked-title"
import { Reveal } from "@/components/common/reveal"

const regions = [
  "Burgundy",
  "Champagne",
  "Niigata Sake",
  "Rhône Valley",
  "Yamanashi",
  "Piedmont",
  "Mosel",
]

export function WineSelection() {
  return (
    <section className="overflow-hidden bg-background py-28 text-foreground md:py-36">
      <div className="container-editorial">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Wine &amp; Sake
        </span>
        <MaskedTitle
          as="h2"
          className="mt-6 max-w-2xl font-display text-[clamp(2rem,1.6rem+2vw,3.5rem)] leading-[1.05] font-light"
        >
          Four hundred labels, chosen to disappear behind the food.
        </MaskedTitle>
        <Reveal delay={0.15} className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          <p>
            A cellar built alongside the menu, not after it — led by our
            sommelier through rare Burgundies, small-batch Niigata sake, and a
            by-the-glass list that changes weekly.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 border-y border-border py-8">
        <Marquee speed={35}>
          {regions.map((region) => (
            <span
              key={region}
              className="font-display text-3xl font-light text-muted-foreground/60 md:text-5xl"
            >
              {region}
              <span className="mx-8 text-primary">·</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
