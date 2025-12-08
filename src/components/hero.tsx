"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, MessageSquare, Github } from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

const HeroSection = () => {

    const handleContact = (platform: string) => {
        switch (platform) {
            case 'gmail':
                window.location.href = 'mailto:leoyoumbi83@gmail.com';
                break;
            case 'whatsapp':
                window.location.href = 'https://wa.me/237620731628';
                break;
            case 'linkedin':
                window.location.href = 'https://www.linkedin.com/in/yll0rd';
                break;
        }
    }
    return (
        <section id="about" className="mb-24 text-center">
            <h1 className="text-[42px] font-bold mb-4 gradient-text animate-fade-in">
                Youmbi Leo
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
                Passionate software engineer with a knack for solving complex problems through code. Mostly self-taught and driven by an unyielding curiosity to explore and master new technologies.
            </p>
            <div className="flex items-center justify-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="default"
                            className="bg-success hover:bg-success/90 text-success-foreground animate-fade-in delay-300 hover-lift focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                            Contact Me!
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>Get in touch</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => handleContact('gmail')}>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContact('whatsapp')}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>WhatsApp</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContact('linkedin')}>
                                <Github className="mr-2 h-4 w-4" />
                                <span>LinkedIn</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    variant="default"
                    className="bg-success hover:bg-success/90 text-success-foreground animate-fade-in delay-300 hover-lift"
                    asChild
                >
                    <a
                        href="https://github.com/yll0rd"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <GitHubLogoIcon className="h-5 w-5" />
                    </a>
                </Button>
                <Button
                    variant="default"
                    className="bg-success hover:bg-success/90 text-success-foreground animate-fade-in delay-300 hover-lift"
                    asChild
                >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        My Blog Site {" "}<span className="text-xs text-muted-foreground ml-1">(coming soon)</span>
                    </a>
                </Button>
            </div>
        </section>
    )
}

export default HeroSection;