import React from 'react';
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ALL_LOGOS, ALL_SKILLS_ICONS } from "@/lib/constants"

const ExperienceSection = ({ className="" }: { className?: string }) => {
    return (
        <section id="experience" className={`mb-24 animate-fade-in ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Professional Background</h2>
            <div className="space-y-8">

                {/* Irembo Experience */}
                <Card className="hover-lift">
                    <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                                <a
                                    href="https://www.linkedin.com/company/9308653"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                >
                                    <Image
                                        src={ALL_LOGOS.irembo}
                                        alt="Irembo Logo"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </a>
                            </div>
                            <div className="flex-grow">
                                <a
                                    href="https://www.linkedin.com/company/9308653"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <CardTitle>Irembo</CardTitle>
                                </a>
                                <CardDescription>
                                    <span className="block text-muted-foreground">Internship · 6 months</span>
                                    <span className="block text-sm text-muted-foreground/60">Nyarutarama, Rwanda · Onsite</span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            <h4 className="text-lg font-semibold text-foreground">Software Engineer</h4>
                            <p className="text-sm text-muted-foreground/60 mb-4">Apr 2025 - Oct 2025</p>
                            <p className="text-muted-foreground mb-4 text-[0.75em]">
                                Developed a visual Workflow Builder tool that empowers users to create, view, and edit custom workflows through an intuitive interface thereby, improving the company's internal tool. Leveraged Angular for frontend development and Spring Boot for backend services. Integrated AI-powered features utilizing local LLMs to boost user productivity and streamline workflow design.
                                {/* Developed and maintained web applications using various technologies including Bubble.io, WordPress, and custom web development tools. Created user-friendly interfaces, integrated third-party services, and ensured optimal performance across all platforms. */}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: "Angular", icon: ALL_SKILLS_ICONS.angular },
                                    { name: "Springboot", icon: ALL_SKILLS_ICONS.spring },
                                    { name: "Express", icon: ALL_SKILLS_ICONS.express },
                                ].map((tech, techIndex) => (
                                    <div
                                        key={techIndex}
                                        className="relative group"
                                    >
                                        <Image
                                            src={tech.icon}
                                            alt={`${tech.name} icon`}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5"
                                        />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-popover text-popover-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {tech.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skaleway Experience */}
                <Card className="hover-lift">
                    <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                                <a
                                    href="https://skaleway.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                >
                                    <Image
                                        src={ALL_LOGOS.skaleway}
                                        alt="Skaleway Logo"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </a>
                            </div>
                            <div className="flex-grow">
                                <a
                                    href="https://www.linkedin.com/company/9308653"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <CardTitle>Skaleway</CardTitle>
                                </a>
                                <CardDescription>
                                    <span className="block text-sm text-muted-foreground/60">Remote</span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            <h4 className="text-lg font-semibold text-foreground">Software Developer</h4>
                            <p className="text-sm text-muted-foreground/60 mb-4">Jul 2024 - present</p>
                            <p className="text-muted-foreground mb-4 text-[0.75em]">
                                Designed customized software solutions for clients using reliable and scalable
                                technologies, enhancing client satisfaction and project success.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: "ReactJs", icon: ALL_SKILLS_ICONS.react },
                                    { name: "NextJs", icon: ALL_SKILLS_ICONS.nextjs_dark },
                                    { name: "Django", icon: ALL_SKILLS_ICONS.django },
                                    { name: "NestJs", icon: ALL_SKILLS_ICONS.nestjs },
                                    { name: "Springboot", icon: ALL_SKILLS_ICONS.spring },
                                ].map((tech, techIndex) => (
                                    <div
                                        key={techIndex}
                                        className="relative group"
                                    >
                                        <Image
                                            src={tech.icon}
                                            alt={`${tech.name} icon`}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5"
                                        />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-popover text-popover-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {tech.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* TiC Foundation Experience */}
                <Card className="hover-lift">
                    <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                                <a
                                    href="https://www.linkedin.com/company/91495924"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                >
                                    <Image
                                        src={ALL_LOGOS.tic}
                                        alt="TiC Logo"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </a>
                            </div>
                            <div className="flex-grow">
                                <a
                                    href="https://www.linkedin.com/company/91495924"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <CardTitle>TiC Foundation</CardTitle>
                                </a>
                                <CardDescription>
                                    <span className="block text-muted-foreground">Internship · 6 months</span>
                                    <span className="block text-sm text-muted-foreground/60">Yaounde, Cameroon · Hybrid</span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            <h4 className="text-lg font-semibold text-foreground">Software Developer</h4>
                            <p className="text-sm text-muted-foreground/60 mb-4">Mar 2024 - Sep 2024</p>
                            <p className="text-muted-foreground mb-4 text-[0.75em]">
                                Developed an online portal using ReactJS, NextJS, and TypeScript for the <a href="https://ticsummit.org" target="_blank" rel="noopener noreferrer" className="font-bold">TiC Summit</a>,
                                which empowered over 500 students to create tech solutions, enhancing innovation and
                                entrepreneurial skills among youth in Cameroon
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: "TypeScript", icon: ALL_SKILLS_ICONS.typescript },
                                    { name: "ReactJs", icon: ALL_SKILLS_ICONS.react },
                                    { name: "NextJs", icon: ALL_SKILLS_ICONS.nextjs_dark },
                                    { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
                                ].map((tech, techIndex) => (
                                    <div
                                        key={techIndex}
                                        className="relative group"
                                    >
                                        <Image
                                            src={tech.icon}
                                            alt={`${tech.name} icon`}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5"
                                        />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-popover text-popover-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {tech.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default ExperienceSection;