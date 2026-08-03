import { Reveal } from "@/components/common/reveal"

const milestones = [
  { year: "2016", label: "Miss Ginko opens its doors in a single room on Lafayette Street." },
  { year: "2018", label: "Awarded a Michelin Bib Gourmand within two years of opening." },
  { year: "2020", label: "The private dining room and chef's table program launch." },
  { year: "2022", label: "First Michelin star, and the current head chef takes the pass." },
  { year: "2024", label: "Full renovation of the dining room and open kitchen." },
  { year: "2026", label: "A decade of service — the tasting menu is rebuilt from scratch." },
]

export function Timeline() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {milestones.map((m, index) => (
        <Reveal key={m.year} delay={index * 0.05}>
          <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-10">
            <span className="font-display text-3xl font-light text-primary sm:w-32 sm:shrink-0">
              {m.year}
            </span>
            <p className="max-w-xl text-[15px] text-muted-foreground">{m.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
