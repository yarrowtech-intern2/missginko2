"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { NavLink } from "@/components/layout/nav-link"
import { Logo } from "@/components/common/logo"
import { MagneticButton } from "@/components/common/magnetic-button"
import { useSecretAdminAccess } from "@/hooks/use-secret-admin-access"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = scrolled || !isHome
  const light = !solid // transparent-over-video state uses light text
  const handleLogoClick = useSecretAdminAccess()

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container-editorial flex h-24 items-center justify-between md:h-28">
        <Link href="/" aria-label={siteConfig.name} onClick={handleLogoClick}>
          <Logo />
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-10 transition-colors duration-500 md:flex",
            light ? "text-background" : "text-foreground"
          )}
        >
          {siteConfig.nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="/booking" variant={light ? "outline" : "solid"} className={light ? "text-background" : undefined}>
            Reserve
          </MagneticButton>
        </div>

        <Sheet>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(
              "flex items-center justify-center md:hidden",
              light ? "text-background" : "text-foreground"
            )}
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-full max-w-sm border-border bg-background p-0 sm:max-w-sm"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex h-full flex-col justify-between px-8 py-10">
              <div className="flex items-center justify-between">
                <Logo />
                <SheetClose aria-label="Close menu">
                  <X className="size-6" />
                </SheetClose>
              </div>

              <nav className="flex flex-col gap-6">
                {siteConfig.nav.map((item) => (
                  <SheetClose key={item.href} render={<Link href={item.href} />}>
                    <span className="font-display text-4xl font-light">
                      {item.label}
                    </span>
                  </SheetClose>
                ))}
              </nav>

              <SheetClose render={<Link href="/booking" />}>
                <MagneticButton static className="w-full">
                  Reserve a Table
                </MagneticButton>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
