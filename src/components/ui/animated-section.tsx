"use client"

import React from "react";
import { motion, useReducedMotion } from "motion/react";

// Ease-out-quint: fast start, soft landing — reads as "arriving" rather than "sliding"
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type AnimatedSectionProps = {
    children: React.ReactNode;
    className?: string;
    /** Seconds to wait once the section enters the viewport */
    delay?: number;
    /** Distance (px) the section rises while fading in */
    offset?: number;
};

/**
 * Reveals its children with a fade + rise the first time they scroll into view.
 * Only animates opacity/transform (no layout shift) and falls back to a static
 * render when the user prefers reduced motion.
 */
const AnimatedSection = ({ children, className = "", delay = 0, offset = 24 }: AnimatedSectionProps) => {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: offset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, delay, ease: EASE_OUT }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
