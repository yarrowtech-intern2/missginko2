"use client"

import { useState } from "react"
import { ShoppingBag, X } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useMenuSelection } from "@/features/menu/context/menu-selection-context"

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price)
}

/** Floating summary of the guest's tapped-through selection — appears once something is picked, opens a modal with the list and running total. */
export function MenuSelectionBar() {
  const [open, setOpen] = useState(false)
  const { selectedItems, removeItem, clear, total } = useMenuSelection()

  if (selectedItems.length === 0) return null

  const currency = selectedItems[0]?.currency ?? "INR"

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105"
      >
        <span className="relative">
          <ShoppingBag className="size-5" />
          <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-foreground">
            {selectedItems.length}
          </span>
        </span>
        {formatPrice(total, currency)}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <DialogTitle className="font-display text-xl font-normal">
              Your Selection
            </DialogTitle>
            <div className="mt-4 divide-y divide-border">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from selection`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/50 p-6">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
                Total
              </p>
              <p className="font-display text-2xl font-light">{formatPrice(total, currency)}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium tracking-wide text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
