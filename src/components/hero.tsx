"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Download, ArrowDown, Mail } from "lucide-react";
import {
    GitHubLogoIcon as Github,
    LinkedInLogoIcon as Linkedin
} from "@radix-ui/react-icons"
import Image from "next/image"

const HeroSection = ({ className = "" }: { className?: string }) => {

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact');
        contactSection?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleDownloadResume = () => {
        // Update this path to your actual resume file
        const resumeUrl = 'https://drive.google.com/file/d/1z8IWwn6kJray4w6N3kn0MIUb8myFj_At/view?usp=sharing';
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'Youmbi_Leo_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <section id="about" className={`min-h-[calc(100vh-4rem)] flex items-center justify-center mb-24 ${className}`}>
            <div className="container mx-auto px-4">
                <div className="flex max-lg:flex-col lg:justify-center gap-y-12 lg:gap-x-40 items-center">

                    {/* Left Content */}
                    <div className="space-y-6 text-center lg:text-left animate-fade-in">
                        <div className="space-y-4">
                            <div className="inline-block">
                                <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground border border-border px-4 py-1.5 rounded-full">
                                    Software Engineer
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight inline-block">
                                Hi, I'm{" "}
                                <span className="text-primary text-balance">
                                    Youmbi  Leo
                                </span>
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-2">
                                Call me{" "}
                                <span className="text-primary font-bold">
                                    yll0rd <span className="text-sm max-md:hidden">(why-lord)</span>
                                </span>
                            </h2>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Passionate software engineer with a knack for solving complex problems through code.
                                Mostly self-taught and driven by an unyielding curiosity to explore and master new technologies.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in delay-200">
                            <Button
                                size="lg"
                                onClick={handleScrollToContact}
                                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium hover-lift shadow-lg hover:shadow-xl transition-all"
                            >
                                Contact Me
                                <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleDownloadResume}
                                className="group border-2 px-8 py-6 text-base font-medium hover-lift hover:bg-accent transition-all"
                            >
                                <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                                Download Resume
                            </Button>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 justify-center lg:justify-start pt-6 animate-fade-in delay-300">
                            <a
                                href="https://github.com/yll0rd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-3 border border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all hover-lift"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/yll0rd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-3 border border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all hover-lift"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                            <a
                                href="mailto:leoyoumbi83@gmail.com"
                                className="group p-3 border border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all hover-lift"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Right Content - Image */}
                    <div className="flex justify-center lg:justify-end animate-fade-in delay-400">
                        <div className="relative group">
                            {/* Decorative background elements */}
                            <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                            <div className="absolute inset-0 bg-accent/10 rounded-3xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>

                            {/* Main image container */}
                            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-border shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                                <Image
                                    src="/myself.jpg"
                                    alt="Youmbi Leo"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    priority
                                />
                            </div>

                            {/* Floating badge */}
                            {/* <div className="absolute -bottom-4 -right-4 bg-background border-2 border-border rounded-2xl px-6 py-3 shadow-lg">
                                <p className="text-sm font-semibold">
                                    <span className="text-primary text-2xl font-bold">10+</span>
                                    <span className="text-muted-foreground ml-2">Projects</span>
                                </p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;