"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  Calendar,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  PartyPopper,
  Star,
  Users,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { createClient } from "@/supabase/client"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/admin/private-events", label: "Private Events", icon: PartyPopper },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/menu", label: "Menu", icon: BookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/contact", label: "Messages", icon: MessageSquare },
]

interface AdminProfile {
  full_name: string | null
  email: string | null
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking")

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active) return

      if (!user) {
        setStatus("denied")
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname || "/admin")}`)
        return
      }

      const { data: profileRow, error } = await supabase
        .from("profiles")
        .select("role,full_name")
        .eq("id", user.id)
        .single()

      if (!active) return

      if (error || (profileRow?.role !== "staff" && profileRow?.role !== "admin")) {
        setStatus("denied")
        router.replace("/")
        return
      }

      setProfile({
        full_name: profileRow.full_name,
        email: user.email ?? null,
      })
      setStatus("allowed")
    }

    checkAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setStatus("denied")
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname || "/admin")}`)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [pathname, router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (status !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          {status === "checking" ? "Checking admin access..." : "Redirecting..."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg tracking-wide uppercase">
          {siteConfig.name}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-display text-lg tracking-wide uppercase">
            {siteConfig.name}
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate px-3 text-xs text-muted-foreground">
            {profile?.full_name ?? profile?.email}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  )
}
