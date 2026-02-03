"use client"

import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import { Home, Music, PlusCircle, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "border border-sidebar-border bg-sidebar-accent hover:bg-sidebar-accent/80"
        )}
      >
        {icon}
      </motion.div>
      <span
        className={cn(
          "text-[11px]",
          isActive ? "font-medium text-sidebar-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-20 flex-col items-center gap-4 bg-sidebar p-4">
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/library" className="block h-12 w-12 rounded-xl bg-primary" />
      </motion.div>

      {/* Divider */}
      <div className="h-px w-8 bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-4">
        <NavItem href="/library" icon={<Home className="h-5 w-5" />} label="Home" />
        <NavItem href="/genres" icon={<Music className="h-5 w-5" />} label="流派" />
        <NavItem href="/create" icon={<PlusCircle className="h-5 w-5" />} label="创作" />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} label="设置" />
    </aside>
  )
}
