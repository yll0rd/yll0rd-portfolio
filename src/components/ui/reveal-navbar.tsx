"use client";

import Image from "next/image";
import { cn, safeStartViewTransition } from "@/lib/utils";
import {
    motion,
    useMotionValueEvent,
    useScroll,
    useTransform,
    useMotionValue,
    AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/lib/icons";

const Reveal = () => {
    const [isHidden, setIsHidden] = useState(false);

    const { theme, setTheme, resolvedTheme } = useTheme();
    const [height, setHeight] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState("about")
    const { scrollY } = useScroll();
    const lastYRef = useRef(0);

    const navbarWidth = useMotionValue(65);
    const routesOpacity = useTransform(navbarWidth, [65, 500], [0, 1]);

    useEffect(() => {
        setMounted(true);
        setIsHidden(true);
        console.log("Navbar mounted");
    }, []);

    useEffect(() => {
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

        if (difference > 50) {
            setIsHidden(false);
        } else {
            setIsHidden(true);
        }

        setHeight(difference);
    });

    const firstNavVariants = {
        hidden: {
            width: 65,
            // width: 65,
            background: "transparent",
        },
        vissible: {
            width: 900,
            // background: "white"
        },
    };
    const sections = ["about", "skills",
        // "projects", 
        "experience", "education", "certifications"]

    useEffect(() => {
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

    const ThemeIcon = resolvedTheme === "dark" ? SunIcon : MoonIcon

    return (
        <div
            className="h-full w-full sticky inset-0 z-[10000000000]"
            style={{ '--navbar-top': '1rem', top: 'var(--navbar-top)' } as React.CSSProperties}
        >
            {mounted && (
                <div
                    className="size-full"
                    onMouseEnter={() => height <= 50 && setIsHidden(false)}
                    onMouseLeave={() => height <= 50 && setIsHidden(true)}
                >
                    <motion.nav
                        animate={!isHidden ? "vissible" : "hidden"}
                        initial="hidden"
                        exit="hidden"
                        variants={firstNavVariants}
                        transition={{ duration: 0.25 }}
                        className={cn(
                            "text-foreground p-[10px] h-[65px] mx-auto overflow-hidden rounded-2xl flex items-center justify-between", {
                            "backdrop-blur-lg bg-white border shadow-lg": height > 50 || !isHidden
                        })}
                        style={{
                            width: navbarWidth,
                        }}
                    >
                        <motion.a
                            animate={{
                                height: 50,
                            }}
                            href="/"
                            className="size-10 relative rounded-full max-w-[50px] min-w-[50px] flex items-center justify-center"
                        >
                            <Image
                                fill
                                src="/myself.jpg"
                                alt="Youmbi Leo"
                                className="object-cover rounded-full size-9"
                            />
                        </motion.a>
                        <AnimatePresence>
                            {(height >= 0 || !isHidden) && (
                                <>
                                    <motion.ul className="flex items-center gap-5">
                                        {sections.map((route) => (
                                            <motion.li
                                                key={route}
                                                className={`px-3 py-2 text-sm capitalize rounded-md transition-colors ${activeSection === route
                                                    ? "text-foreground font-semibold underline decoration-wavy decoration-[2px] underline-offset-4"
                                                    : "text-muted-foreground font-medium hover:text-foreground hover:bg-background/50 dark:hover:text-foreground dark:hover:bg-background/70"
                                                    }`}
                                                onClick={() => scrollToSection(route)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{
                                                    opacity: routesOpacity,
                                                }}
                                            >
                                                {route}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                    <button
                                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:text-foreground dark:hover:bg-background/70 transition-colors"
                                    >
                                        <ThemeIcon className="h-5 w-5" size={20} />
                                    </button>
                                </>
                            )}
                        </AnimatePresence>
                    </motion.nav>
                </div>
            )}
        </div>
    );
};

export default Reveal;
