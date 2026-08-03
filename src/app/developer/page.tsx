import type { Metadata } from "next"
import { ArrowUpRight, Mail } from "lucide-react"

import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Developer",
  path: "/developer",
  noIndex: true,
})

const developer = {
  name: "Srijon Karmakar",
  role: "Full Stack Engineer",
  email: "srijonkarmakar.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/srijon-karmakar/",
}

export default function DeveloperPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
        Built By
      </span>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,4.5rem)] leading-[1.05] font-light">
        {developer.name}
      </h1>
      <p className="mt-3 text-sm tracking-wide text-muted-foreground uppercase">
        {developer.role}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <a
          href={`mailto:${developer.email}`}
          className="inline-flex items-center gap-2 border-b border-current pb-1 text-sm transition-colors hover:text-primary"
        >
          <Mail className="size-4" />
          {developer.email}
        </a>
        <a
          href={developer.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border-b border-current pb-1 text-sm transition-colors hover:text-primary"
        >
          LinkedIn
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  )
}
