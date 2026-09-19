"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { MenuItem } from "@/services/menu.service"

interface MenuSelectionContextValue {
  selectedItems: MenuItem[]
  isSelected: (id: string) => boolean
  toggleItem: (item: MenuItem) => void
  removeItem: (id: string) => void
  clear: () => void
  total: number
}

const MenuSelectionContext = createContext<MenuSelectionContextValue | null>(null)

/** Lets guests tap through the menu to build a running list of dishes/drinks they're interested in, with a live total — purely client-side, nothing is submitted anywhere. */
export function MenuSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([])

  const isSelected = useCallback(
    (id: string) => selectedItems.some((item) => item.id === id),
    [selectedItems]
  )

  const toggleItem = useCallback((item: MenuItem) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clear = useCallback(() => setSelectedItems([]), [])

  const total = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  )

  const value = useMemo(
    () => ({ selectedItems, isSelected, toggleItem, removeItem, clear, total }),
    [selectedItems, isSelected, toggleItem, removeItem, clear, total]
  )

  return <MenuSelectionContext.Provider value={value}>{children}</MenuSelectionContext.Provider>
}

export function useMenuSelection() {
  const ctx = useContext(MenuSelectionContext)
  if (!ctx) throw new Error("useMenuSelection must be used within a MenuSelectionProvider")
  return ctx
}
