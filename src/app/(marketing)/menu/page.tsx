import type { Metadata } from "next"
import { Download } from "lucide-react"

import { MenuSidebar } from "@/features/menu/components/menu-sidebar"
import { MenuItemRow } from "@/features/menu/components/menu-item"
import { menuJsonLd } from "@/seo/jsonld"
import { buildMetadata } from "@/seo/metadata"
import { getMenu } from "@/services/menu.service"

export const metadata: Metadata = buildMetadata({
  title: "Menu",
  description: "Seasonal Modern Asian fine dining menu — robata grill, sashimi, and a chef's tasting journey.",
  path: "/menu",
})

export const revalidate = 3600

export default async function MenuPage() {
  let categories: Awaited<ReturnType<typeof getMenu>> = []
  try {
    categories = await getMenu()
  } catch (error) {
    console.warn("Failed to load menu from Supabase:", error)
  }

  return (
    <div className="bg-background pt-32 pb-28 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            menuJsonLd(
              categories.map((c) => ({
                name: c.name,
                items: c.items.map((i) => ({
                  name: i.name,
                  description: i.description ?? undefined,
                  price: i.price,
                  currency: i.currency,
                })),
              }))
            )
          ),
        }}
      />

      <div className="container-editorial">
        <div className="flex flex-col gap-6 border-b border-border pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
              The Menu
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light">
              A Seasonal Journey
            </h1>
          </div>
          <a
            href="/menu.pdf"
            className="inline-flex items-center gap-2 self-start border-b border-current pb-1 text-sm font-medium tracking-wide transition-colors hover:text-primary"
            download
          >
            <Download className="size-4" /> Download PDF Menu
          </a>
        </div>

        {categories.length === 0 ? (
          <p className="py-24 text-center text-sm text-muted-foreground">
            The menu is being updated. Please check back shortly, or{" "}
            <a href="/contact" className="underline underline-offset-4">
              contact us
            </a>{" "}
            for today&apos;s offerings.
          </p>
        ) : (
        <div className="mt-12 flex gap-16">
          <MenuSidebar categories={categories} />

          <div className="min-w-0 flex-1">
            {categories.map((category) => (
              <section key={category.id} id={category.slug} className="scroll-mt-28 pb-16">
                <h2 className="font-display text-3xl font-light">{category.name}</h2>
                {category.description && (
                  <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <div className="mt-6">
                  {category.items.length === 0 ? (
                    <p className="py-8 text-sm text-muted-foreground">
                      New dishes for this section are coming soon.
                    </p>
                  ) : (
                    category.items.map((item) => <MenuItemRow key={item.id} item={item} />)
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
