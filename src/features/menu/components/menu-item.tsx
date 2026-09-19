"use client"

import { useState } from "react"
import { Check, Plus, ShieldAlert, Sparkles } from "lucide-react"

import { PlaceholderMedia } from "@/components/common/placeholder-media"
import { Reveal } from "@/components/common/reveal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMenuSelection } from "@/features/menu/context/menu-selection-context"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/services/menu.service"

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price)
}

export function MenuItemRow({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false)
  const { isSelected, toggleItem } = useMenuSelection()
  const selected = isSelected(item.id)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={cn(
          "group grid w-full cursor-pointer grid-cols-[1fr,auto] items-start gap-4 border-b border-border py-6 text-left transition-colors duration-300 sm:grid-cols-[6rem,1fr,auto] sm:gap-6",
          selected && "bg-primary/5",
          !item.is_available && "opacity-50"
        )}
      >
        <div className="relative hidden aspect-square w-24 shrink-0 overflow-hidden rounded-2xl sm:block">
          <PlaceholderMedia
            label={`${item.name} — add photo`}
            alt={item.name}
            src={item.image_url ?? undefined}
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl transition-colors duration-300 group-hover:text-primary sm:text-2xl">
              {item.name}
            </h3>
            {item.is_chef_recommendation && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">
                <Sparkles className="size-3" /> Chef&apos;s pick
              </span>
            )}
            {!item.is_available && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Unavailable
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
          {item.allergens.length > 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/80">
              <ShieldAlert className="size-3.5" />
              Contains {item.allergens.join(", ")}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 justify-self-end sm:self-center">
          <span className="font-mono text-sm text-foreground">
            {formatPrice(item.price, item.currency)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleItem(item)
            }}
            aria-pressed={selected}
            aria-label={
              selected ? `Remove ${item.name} from selection` : `Add ${item.name} to selection`
            }
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-300",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            )}
          >
            {selected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            {selected ? "Added" : "Add"}
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl">
          <div className="relative aspect-[4/3] w-full">
            <PlaceholderMedia
              label={`${item.name} — add photo`}
              alt={item.name}
              src={item.image_url ?? undefined}
              className="absolute inset-0"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="font-display text-2xl font-normal">
                {item.name}
              </DialogTitle>
              <span className="font-mono text-sm whitespace-nowrap">
                {formatPrice(item.price, item.currency)}
              </span>
            </div>
            {item.description && (
              <DialogDescription className="mt-3">{item.description}</DialogDescription>
            )}

            <Reveal className="mt-5 grid gap-4 text-xs text-muted-foreground sm:grid-cols-2">
              {item.ingredients.length > 0 && (
                <div>
                  <span className="font-medium tracking-[0.15em] text-foreground uppercase">
                    Ingredients
                  </span>
                  <p className="mt-1">{item.ingredients.join(", ")}</p>
                </div>
              )}
              {item.allergens.length > 0 && (
                <div>
                  <span className="font-medium tracking-[0.15em] text-foreground uppercase">
                    Allergens
                  </span>
                  <p className="mt-1">{item.allergens.join(", ")}</p>
                </div>
              )}
              {item.dietary_tags.length > 0 && (
                <div>
                  <span className="font-medium tracking-[0.15em] text-foreground uppercase">
                    Dietary
                  </span>
                  <p className="mt-1">{item.dietary_tags.join(", ")}</p>
                </div>
              )}
            </Reveal>

            <button
              type="button"
              onClick={() => toggleItem(item)}
              aria-pressed={selected}
              className={cn(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
              )}
            >
              {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
              {selected ? "Added to your selection" : "Add to your selection"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
