import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import { stockImages } from "@/lib/stock-images"

const team = [
  { name: "Aiko Tanaka", role: "Executive Chef", image: stockImages.team.chef },
  { name: "Marcus Webb", role: "Head Sommelier", image: stockImages.team.sommelier },
  { name: "Ren Sato", role: "Sous Chef", image: stockImages.team.sousChef },
  { name: "Isabelle Cruz", role: "General Manager", image: stockImages.team.generalManager },
]

export function TeamGrid() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {team.map((member, index) => (
        <Reveal key={member.name} delay={index * 0.08}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <PlaceholderMedia
              label={`${member.name} portrait`}
              alt={member.name}
              src={member.image}
              className="absolute inset-0"
            />
          </div>
          <h3 className="mt-3 font-display text-lg">{member.name}</h3>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </Reveal>
      ))}
    </div>
  )
}
