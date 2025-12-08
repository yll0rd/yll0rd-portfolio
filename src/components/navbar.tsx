"use client";
import { useScreenSize } from '@/hooks/use-screensize';
import React from 'react'
import { MobileNavbar } from './ui/mobile-navbar';
import RevealNavbar from "@/components/ui/reveal-navbar"

const Navbar = () => {
    const screenSize = useScreenSize();
    const NavComponent = ["xs", "sm", "md"].includes(screenSize) ? MobileNavbar : RevealNavbar;
    return (
        <NavComponent />
    )
}

export default Navbar