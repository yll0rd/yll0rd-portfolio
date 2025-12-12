import React, { useState } from 'react';
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight as ArrowRightIcon, Download } from "lucide-react"

const projects = [
    // {
    //   title: "Dev Toolbox",
    //   description: "A collection of development tools and utilities",
    //   content: "A comprehensive collection of development tools and utilities to streamline the development workflow",
    //   link: "https://github.com/fernand3z/dev-toolbox",
    //   technologies: [
    //     { name: "Python", icon: "/icons/python-svgrepo-com.svg" },
    //     { name: "Prettier", icon: "/icons/prettier-svgrepo-com.svg" },
    //     { name: "Bash", icon: "/icons/bash-icon-svgrepo-com.svg" },
    //     { name: "Linux", icon: "/icons/linux-svgrepo-com(1).svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "Update Script",
    //   description: "A script for automating system updates and maintenance tasks",
    //   content: "Streamlines the process of keeping your system up-to-date with automated checks and updates",
    //   link: "https://github.com/fernand3z/update-script",
    //   technologies: [
    //     { name: "Bash", icon: "/icons/bash-icon-svgrepo-com.svg" },
    //     { name: "Linux", icon: "/icons/linux-svgrepo-com(1).svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "Portfolio Website",
    //   description: "Modern portfolio website built with Next.js and Tailwind CSS",
    //   content: "A responsive and animated portfolio showcasing my projects and skills",
    //   link: "https://github.com/fernand3z/portfolio",
    //   technologies: [
    //     { name: "Next.js", icon: "/icons/nextjs-icon-svgrepo-com.svg" },
    //     { name: "React", icon: "/icons/react-svgrepo-com.svg" },
    //     { name: "TypeScript", icon: "/icons/typescript-svgrepo-com.svg" },
    //     { name: "Tailwind", icon: "/icons/tailwind-svgrepo-com.svg" },
    //     { name: "NPM", icon: "/icons/npm.svg" },
    //     { name: "Prettier", icon: "/icons/prettier-svgrepo-com.svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "Personal Blog Site",
    //   description: "A modern blog site built with Hugo static site generator",
    //   content: "Fast and minimalist blog featuring custom themes, responsive design, and markdown support",
    //   link: "https://github.com/fernand3z/my-blog-site",
    //   technologies: [
    //     { name: "Hugo", icon: "/icons/hugo-svgrepo-com.svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "ytmusic Downloader",
    //   description: "Python script for downloading music from YTmusic using the yt-dlp library",
    //   content: "A simple Python script to download audio from YouTube videos",
    //   link: "https://github.com/fernand3z/yt-music-downloader",
    //   technologies: [
    //     { name: "Python", icon: "/icons/python-svgrepo-com.svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "Devlogz Blog App",
    //   description: "A React Native mobile app for my personal blog",
    //   content: "Cross-platform mobile application built with React Native that provides a native app experience for my blog site with offline capabilities and push notifications",
    //   link: "https://github.com/fernand3z/my-webview-app",
    //   technologies: [
    //     { name: "React Native", icon: "/icons/reactnative-svgrepo-com.svg" },
    //     { name: "JavaScript", icon: "/icons/javascript-svgrepo-com.svg" },
    //     { name: "Git", icon: "/icons/git-svgrepo-com.svg" },
    //     { name: "GitHub", icon: "/icons/github-svgrepo-com.svg" }
    //   ]
    // },
    // {
    //   title: "Coming Soon",
    //   description: "Future project planned",
    //   content: "Another exciting project in the pipeline. Stay tuned for updates!",
    //   status: "In Planning",
    //   technologies: []
    // },
    // {
    //   title: "Coming Soon",
    //   description: "Future project planned",
    //   content: "Another exciting project in the pipeline. Stay tuned for updates!",
    //   status: "In Planning",
    //   technologies: []
    // },
    // {
    //   title: "Coming Soon",
    //   description: "Future project planned",
    //   content: "Another exciting project in the pipeline. Stay tuned for updates!",
    //   status: "In Planning",
    //   technologies: []
    // }
] as {
    title: string;
    description: string;
    previewImage: string;
    content: string;
    link?: string;
    status?: string;
    technologies: { name: string; icon: string }[];
}[];

const ProjectsSection = ({ className="" }: { className?: string }) => {
    const [visibleProjectCount, setVisibleProjectCount] = useState(6);
    const handleShowMoreProjects = () => {
        if (visibleProjectCount >= projects.length) {
            setVisibleProjectCount(6) // Reset to initial count of 6
        } else {
            setVisibleProjectCount(prev => Math.min(prev + 3, projects.length))
        }
    }

    const showingAllProjects = visibleProjectCount >= projects.length
    return (
        <section id="projects" className={`mb-24 animate-fade-in ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Development Endeavors</h2>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(0, visibleProjectCount).map((project, index) => (
                        <Card key={index} className={`hover-lift flex flex-col ${!project.link ? 'opacity-75' : ''}`}>
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-[0.75em]">
                                    {project.content}
                                </p>
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex gap-2 mt-4">
                                        {project.technologies.map((tech, techIndex) => (
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
                                )}
                            </CardContent>
                            <CardFooter className="mt-auto">
                                {project.link ? (
                                    <div className="flex flex-row w-full space-x-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-4 text-foreground hover:text-success hover:border-success transition-colors"
                                        >
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View on GitHub <ArrowRightIcon className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                        {project.title === "Devlogz Blog App" && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="mt-4 text-foreground hover:text-success hover:border-success transition-colors"
                                            >
                                                <a
                                                    href="https://github.com/fernand3z/my-webview-app/releases/download/v1.0.0/devlogzv1.0.0.apk"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="h-[18px] w-[18px]" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground inline-flex items-center space-x-1">
                                        {project.status} →
                                    </span>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Show More/Less Projects Button */}
                {visibleProjectCount < projects.length ? (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleShowMoreProjects}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-2 transition-colors group"
                        >
                            <div className="flex items-center space-x-2 group-hover:translate-y-[-2px] transition-transform duration-200">
                                <span>Show More</span>
                                <span className="transform transition-transform duration-200">↓</span>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleShowMoreProjects}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-2 transition-colors group"
                        >
                            <div className="flex items-center space-x-2 group-hover:translate-y-[-2px] transition-transform duration-200">
                                <span>Show Less</span>
                                <span className="transform transition-transform duration-200 rotate-180">↓</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProjectsSection;