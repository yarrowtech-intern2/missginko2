import { MaskedTitle } from "@/components/common/masked-title"
import { Reveal } from "@/components/common/reveal"

export function Philosophy() {
  return (
    <section className="flex min-h-screen items-center bg-background py-32">
      <div className="container-editorial">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Our Philosophy
          </span>
        </Reveal>

        <MaskedTitle
          as="p"
          className="mx-auto mt-8 max-w-4xl text-center font-display text-[clamp(1.75rem,1.3rem+2.2vw,3.5rem)] leading-[1.15] font-light text-balance"
        >
          We believe fine dining is not an event to attend, but a memory to
          inhabit — built from restraint, precision, and ingredients treated
          with quiet reverence.
        </MaskedTitle>

        <Reveal delay={0.2} className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-10 text-center sm:grid-cols-3">
          {[
            { n: "01", t: "Seasonal", d: "Ingredients sourced at their peak, never forced." },
            { n: "02", t: "Precise", d: "Technique from Kyoto kitchens, discipline without excess." },
            { n: "03", t: "Quiet", d: "A room designed to slow you down, not perform for you." },
          ].map((item) => (
            <div key={item.n}>
              <span className="font-mono text-xs text-muted-foreground">{item.n}</span>
              <h3 className="mt-3 font-display text-lg">{item.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
