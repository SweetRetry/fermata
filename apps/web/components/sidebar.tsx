"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { AudioLines, Home, Moon, Music, PlusCircle, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-sidebar-border bg-sidebar-accent transition-colors hover:bg-sidebar-accent/80">
        {mounted ? (
          <>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </>
        ) : (
          <div className="h-5 w-5" />
        )}
      </div>
      <span className="text-[11px] text-muted-foreground">主题</span>
    </motion.button>
  );
}

function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "border border-sidebar-border bg-sidebar-accent hover:bg-sidebar-accent/80",
        )}
      >
        {icon}
      </motion.div>
      <span
        className={cn(
          "text-[11px]",
          isActive
            ? "font-medium text-sidebar-foreground"
            : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-20 flex-col items-center gap-4 bg-sidebar p-4">
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        <Link href="/" className="flex items-center justify-center">
          <AudioLines className="h-6 w-6" />
        </Link>
      </motion.div>

      {/* Divider */}
      <div className="h-px w-8 bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-4">
        <NavItem
          href="/library"
          icon={<Home className="h-5 w-5" />}
          label="Library"
        />
        <NavItem
          href="/genres"
          icon={<Music className="h-5 w-5" />}
          label="Genres"
        />
        <NavItem
          href="/create"
          icon={<PlusCircle className="h-5 w-5" />}
          label="Create"
        />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <ThemeToggle />
    </aside>
  );
}
