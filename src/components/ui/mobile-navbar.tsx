"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Sidebar } from "@/components/sidebar"
import { cn, safeStartViewTransition } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useMotionValueEvent, useScroll } from "framer-motion"

export function MobileNavbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [height, setHeight] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const { scrollY } = useScroll();
  const lastYRef = React.useRef(0);
  const [activeSection, setActiveSection] = React.useState("about")

  const sections = ["about", "skills", "projects", "experience", "education", "certifications"]

  // Handle mounting separately from scroll effects
  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  React.useEffect(() => {
    if (!document.startViewTransition || !mounted) {
      document.documentElement.setAttribute(
        "data-theme", theme || "",
      );
      return;
    }

    safeStartViewTransition(() => {
      document.documentElement.setAttribute(
        "data-theme", theme || "",
      );

      setTimeout(() => {
        document.documentElement.setAttribute("data-theme", theme || "");
      }, 500);
    })
  }, [theme])

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    setHeight(difference);
  });

  // Get the correct icon based on the resolved theme
  const ThemeIcon = resolvedTheme === "dark" ? SunIcon : MoonIcon

  return (
    // mounted &&
    <header className={cn("sticky top-0 z-50 bg-background/30 dark:bg-background/50", {
      "backdrop-blur-xl border-b border-border/40": height > 50
    })}>
      <nav className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center">
          <Sidebar
            sections={sections}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
        </div>

        <Link className="relative size-10 rounded-full block" href="/">
          <Image
            fill
            src="/favicon.svg"
            alt="Youmbi Leo logo"
            className="object-cover rounded-full size-9"
          />
        </Link>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:text-foreground dark:hover:bg-background/70 transition-colors"
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
      </nav>
    </header>
  )
} 