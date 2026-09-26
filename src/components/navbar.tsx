"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  ["/about", "About"],
  ["/work", "Work"],
  ["/writing", "Writing"],
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const themeTransition = useRef<ViewTransition | null>(null);

  const toggleTheme = () => {
    // Ignore repeated clicks until the current reveal has finished.
    if (themeTransition.current) return;
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const updateTheme = () => flushSync(() => setTheme(nextTheme));

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      updateTheme();
      return;
    }

    // Commit the theme before the browser captures the new view.
    const transition = document.startViewTransition(updateTheme);
    themeTransition.current = transition;
    const clearTransition = () => {
      themeTransition.current = null;
    };
    void transition.ready.catch(() => {});
    void transition.finished.then(clearTransition, clearTransition);
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 701px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  return (
    <header className="border-b border-border">
      <div className="site-width flex min-h-[100px] items-center gap-7 max-[700px]:min-h-[84px] max-[700px]:gap-3 max-[700px]:py-4">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-md hover:bg-accent min-[701px]:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(320px,85vw)] overflow-y-auto [&>button]:size-11 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-ring"
          >
            <SheetTitle className="pr-12">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Explore Youmbi Leo’s portfolio.
            </SheetDescription>
            <nav
              aria-label="Mobile navigation"
              className="mt-8 flex flex-col gap-2"
            >
              {[["/", "Home"], ...links].map(([href, label]) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className="rounded-md px-4 py-3 text-muted-foreground hover:bg-accent hover:text-primary aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-primary"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="flex items-center gap-3 font-medium leading-[1.3] max-[700px]:gap-2 max-[700px]:text-sm"
          aria-label="Youmbi Leo, home"
        >
          <Image
            src="/favicon-96x96.png"
            alt=""
            width={36}
            height={36}
            className="rounded-full max-[700px]:size-[30px]"
          />
          <span>
            Youmbi Leo
            <span className="block text-xs font-normal text-muted-foreground">
              yll0rd
            </span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="ml-auto hidden gap-8 min-[701px]:flex"
        >
          {links.map(([href, label]) => (
            <Link
              className="border-b-2 border-transparent py-3.5 text-muted-foreground hover:text-primary aria-[current=page]:border-secondary aria-[current=page]:text-primary"
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border hover:bg-accent max-[700px]:ml-auto"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          <Sun className="hidden dark:block" size={19} />
          <Moon className="dark:hidden" size={19} />
        </button>
      </div>
    </header>
  );
}
