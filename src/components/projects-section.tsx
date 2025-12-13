import React, { useState } from 'react';
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, Smartphone, Laptop } from "lucide-react";
import { GitHubLogoIcon as Github, LockClosedIcon as Lock } from "@radix-ui/react-icons"
import { ALL_SKILLS_ICONS } from '@/lib/constants';

type Project = {
    title: string;
    description: string;
    type: "web" | "mobile" | "desktop";
    liveLink?: string;
    technologies: { name: string; icon: string }[];
} & (
        { isPrivate: true } |
        { isPrivate?: false; githubLink: string }
    )
    & (
        { type: "web" | "desktop"; previewImage: string } |
        { type: "mobile" }
    )


const projects = ([
    {
        title: "Wise App",
        description: "A digital healthcare platform built to connect hospitals, healthcare providers, and communities in Cameroon through remote consultations, appointment management",
        type: "web",
        isPrivate: true,
        previewImage: "/screenshots/wiseapp-cover.png",
        liveLink: "https://app.wisecool.org/",
        technologies: [
            { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
            { name: "expressjs", icon: ALL_SKILLS_ICONS.express },
            { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
        ]
    },
    {
        title: "Kinya",
        description: "A web application built to help tourists, internationals, and anyone interested in learning the Kinyarwanda language",
        type: "web",
        liveLink: "https://kinya.vercel.app",
        githubLink: "https://github.com/yll0rd/kinya",
        previewImage: "/screenshots/kinya-screenshot.jpg",
        technologies: [
            { name: "Angular", icon: ALL_SKILLS_ICONS.angular },
            { name: "Springboot", icon: ALL_SKILLS_ICONS.spring },
            { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
            { name: "Docker", icon: ALL_SKILLS_ICONS.docker },
            { name: "AWS", icon: ALL_SKILLS_ICONS.aws },
        ]
    },
    {
        title: "TiC Portal",
        description: "A learning platform that inspire and empower young techies participating in the national hackathon through a very robust curriculum powered by AI",
        type: "web",
        isPrivate: true,
        previewImage: "/screenshots/ticportal-screenshot.png",
        liveLink: "https://portal.ticsummit.org/",
        technologies: [
            { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
            { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
        ]
    },
    {
        title: "Dewise Energy",
        description: "The world is tilting towards renewable energy, take courses on energy transition to stay updated.",
        type: "web",
        isPrivate: true,
        previewImage: "/screenshots/dewise-screenshot.png",
        liveLink: "https://dewise-energy.org/",
        technologies: [
            { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
            { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
        ]
    },
    {
        title: "The Amea Archives",
        description: "A digital archive dedicated to preserving the history and culture of the Amea region.",
        type: "web",
        githubLink: "https://github.com/TheAmeaArchives/Amea",
        previewImage: "/screenshots/ameaarchives-screenshot.jpeg",
        liveLink: "https://theameaarchives.com/",
        technologies: [
            { name: "TypeScript", icon: ALL_SKILLS_ICONS.typescript },
            { name: "nextjs", icon: ALL_SKILLS_ICONS.nextjs },
            { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel },
        ]
    },
    {
        title: "Recipe Finder Mobile App",
        description: "Do you want to learn how to cook any recipe? Worry no more !! :) ",
        type: "mobile",
        githubLink: "https://github.com/yll0rd/recipe-finder-mobile-app",
        technologies: [
            { name: "TypeScript", icon: ALL_SKILLS_ICONS.typescript },
            { name: "React Native", icon: ALL_SKILLS_ICONS.react_native },
            { name: "Expo", icon: ALL_SKILLS_ICONS.expo },
        ]
    },
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
] satisfies Project[])

const ProjectsSection = ({ className = "" }: { className?: string }) => {
    const [visibleProjectCount, setVisibleProjectCount] = useState(6);

    const handleShowMoreProjects = () => {
        if (visibleProjectCount >= projects.length) {
            setVisibleProjectCount(6) // Reset to initial count of 6
        } else {
            setVisibleProjectCount(prev => Math.min(prev + 3, projects.length))
        }
    }

    const getProjectTypeIcon = (type: Project['type']) => {
        switch (type) {
            case 'web':
                return <Monitor className="h-4 w-4" />;
            case 'mobile':
                return <Smartphone className="h-4 w-4" />;
            case 'desktop':
                return <Laptop className="h-4 w-4" />;
        }
    }

    const showingAllProjects = visibleProjectCount >= projects.length;

    return (
        <section id="projects" className={`animate-fade-in mb-24 ${className}`}>

            {/* Header */}
            <div className="text-center mb-12 space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
                <p className="text-lg max-w-xl text-muted-foreground mx-auto">
                    A collection of projects I&apos;ve worked on <span className="text-sm text-muted-foreground">(list not completed yet)</span>.
                </p>
            </div>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {projects.slice(0, visibleProjectCount).map((project, index) => (
                    <Card
                        key={index}
                        className="group flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift bg-card"
                    >
                        {/* Project Image */}
                        {project.type !== 'mobile' && (
                            <div className="relative h-48 w-full overflow-hidden bg-muted">
                                <Image
                                    src={project.previewImage}
                                    alt={`${project.title} preview`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                                />
                                {/* Type Badge */}
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                                    {getProjectTypeIcon(project.type)}
                                    <span className="text-xs font-medium capitalize">{project.type}</span>
                                </div>
                                {/* Private Badge */}
                                {project.isPrivate && (
                                    <div className="absolute top-4 right-4 flex items-center justify-center gap-1.5 bg-amber-500/90 backdrop-blur-sm size-6 text-white">
                                        <Lock className="size-4" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Project Alternative */}
                        {project.type === 'mobile' && (
                            <div className="relative h-48 w-full overflow-hidden bg-accent/50 flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20">
                                        <Smartphone className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
                                        <span className="text-sm font-medium">Mobile App</span>
                                    </div>
                                </div>
                                {project.isPrivate && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                        <Lock className="h-3 w-3" />
                                        <span className="text-xs font-medium">Private</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                {project.title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed line-clamp-2">
                                {project.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4 flex-grow">
                            {/* Technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Tech Stack
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, techIndex) => (
                                            <div
                                                key={techIndex}
                                                className="relative group/tech"
                                            >
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-border hover:border-primary/50 transition-colors">
                                                    <Image
                                                        src={tech.icon}
                                                        alt={`${tech.name} icon`}
                                                        width={16}
                                                        height={16}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-xs font-medium">{tech.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="pt-4 border-t border-border flex gap-2">
                            {/* Live Link */}
                            {project.liveLink && (
                                <Button
                                    asChild
                                    variant="default"
                                    size="sm"
                                    className="flex-1 group/btn"
                                >
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        Live Demo
                                    </a>
                                </Button>
                            )}

                            {/* GitHub Link */}
                            {!project.isPrivate && 'githubLink' in project && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={project.liveLink ? "px-3" : "flex-1"}
                                >
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="View on GitHub"
                                    >
                                        <Github className="h-4 w-4" />
                                        {!project.liveLink && <span className="ml-2">Source Code</span>}
                                    </a>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Show More/Less Button */}
            {projects.length > 6 && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleShowMoreProjects}
                        variant="outline"
                        size="lg"
                        className="group px-8"
                    >
                        {showingAllProjects ? (
                            <>
                                Show Less
                                <span className="ml-2 transform rotate-180 group-hover:-translate-y-0.5 transition-transform">
                                    ↓
                                </span>
                            </>
                        ) : (
                            <>
                                Show More Projects
                                <span className="ml-2 group-hover:translate-y-0.5 transition-transform">
                                    ↓
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            )}
        </section>
    )
}

export default ProjectsSection;