import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import type { EventPackage } from "@/services/events.service"

export function PackageCard({ pkg, index }: { pkg: EventPackage; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <PlaceholderMedia
          label={`${pkg.name} — add photo`}
          alt={pkg.name}
          src={pkg.image_url ?? undefined}
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light">{pkg.name}</h3>
        <span className="font-mono text-sm whitespace-nowrap text-muted-foreground">
          From ${pkg.price_from.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
      <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">
        {pkg.capacity_min}–{pkg.capacity_max} guests
      </p>
      {pkg.includes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  )
}
