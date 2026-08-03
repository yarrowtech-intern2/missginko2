"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type { MenuCategory } from "@/services/menu.service"

export function MenuSidebar({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    for (const category of categories) {
      const el = document.getElementById(category.slug)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [categories])

  return (
    <nav
      aria-label="Menu categories"
      className="no-scrollbar sticky top-28 hidden max-h-[calc(100vh-8rem)] w-48 shrink-0 flex-col gap-1 overflow-y-auto md:flex"
    >
      {categories.map((category) => (
        <a
          key={category.slug}
          href={`#${category.slug}`}
          className={cn(
            "border-l py-2 pl-4 text-sm transition-colors duration-300",
            active === category.slug
              ? "border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {category.name}
        </a>
      ))}
    </nav>
  )
}
