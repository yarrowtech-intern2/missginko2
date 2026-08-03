import Link from "next/link"
import { redirect } from "next/navigation"
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

import { signOutAction } from "@/actions/auth.actions"
import { siteConfig } from "@/config/site"
import { createClient } from "@/supabase/server"

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

/**
 * Fast-path auth/role redirect for UX; the actual security boundary is
 * middleware (session presence) + RLS staff/admin policies on every query.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirectTo=/admin")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "staff" && profile?.role !== "admin") redirect("/")

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg tracking-wide uppercase">
          {siteConfig.name}
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            aria-label="Sign out"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-display text-lg tracking-wide uppercase">
            {siteConfig.name}
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate px-3 text-xs text-muted-foreground">
            {profile?.full_name ?? user.email}
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  )
}
