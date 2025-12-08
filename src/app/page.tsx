"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight as ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import { ThemeSparkles } from "@/components/ui/ThemeSparkles"
import { ALL_LOGOS, ALL_SKILLS_ICONS } from "@/lib/constants"
import HeroSection from "@/components/hero"
import SkillsSection from "@/components/skills-section";
import { GravityStarsBackground } from "@/components/ui/gravity-stars-background"
import Navbar from "@/components/navbar"

export default function Page() {
  const [showMoreCerts, setShowMoreCerts] = useState(false)
  const [visibleProjectCount, setVisibleProjectCount] = useState(6)
  const [visibleCertCount, setVisibleCertCount] = useState(4)

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
    content: string;
    link?: string;
    status?: string;
    technologies: { name: string; icon: string }[];
  }[];

  const handleShowMoreProjects = () => {
    if (visibleProjectCount >= projects.length) {
      setVisibleProjectCount(6) // Reset to initial count of 6
    } else {
      setVisibleProjectCount(prev => Math.min(prev + 3, projects.length))
    }
  }

  const showingAllProjects = visibleProjectCount >= projects.length

  const handleShowMoreCerts = () => {
    if (visibleCertCount >= 12) { // Total number of certificates
      setVisibleCertCount(4) // Reset to initial count
    } else {
      setVisibleCertCount(prev => Math.min(prev + 4, 12))
    }
  }

  const showingAllCerts = visibleCertCount >= 12

  return (
    <div className="relative min-h-screen">
      <ThemeSparkles className="sparkles-background" />
      {/* <GravityStarsBackground
        className="absolute inset-0 z-10"
        starsCount={800}
      /> */}
      <div className="relative min-h-screen bg-transparent">

        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Skills Section */}
          <SkillsSection />

          {/* Projects Section */}
          <section id="projects" className="mb-24 animate-fade-in">
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

          {/* Experience Section */}
          <section id="experience" className="mb-24 animate-fade-in">
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

          {/* Education Section */}
          <section id="education" className="mb-24 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Knowledge Acquisition</h2>
            <div className="space-y-6">

              <Card className="hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                      <a
                        href="https://www.linkedin.com/school/104648904"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <Image
                          src={ALL_LOGOS.africanLeadershipExperience}
                          alt="African Leadership Experience Logo"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1"
                        />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://www.linkedin.com/school/vtasrilanka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <CardTitle>Software Engineering Program</CardTitle>
                      </a>
                      <CardDescription>
                        <span className="block text-muted-foreground">African Leadership Experience</span>
                        <span className="block text-sm text-muted-foreground/60">Feb 2023 - Jun 2024</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Master's Degree */}
              {/* <Card className="hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                      <a 
                        href="https://www.uclan.ac.uk/postgraduate/courses/mba-master-of-business-administration" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <Image 
                          src="/uclan-logo.jpg" 
                          alt="University of Central Lancashire Logo" 
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1" 
                        />
                      </a>
                    </div>
                    <div>
                      <a 
                        href="https://www.uclan.ac.uk/postgraduate/courses/mba-master-of-business-administration" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <CardTitle>Master's degree: Business Administration and Management</CardTitle>
                      </a>
                      <CardDescription>
                        <span className="block text-muted-foreground">University of Central Lancashire</span>
                        <span className="block text-sm text-muted-foreground/60">Jan 2023 - Jan 2024</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card> */}

              {/* Bachelor's degree Course */}
              <Card className="hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                      <a
                        href="https://nahpi.cm/departments/computer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <Image
                          src={ALL_LOGOS.nahpi}
                          alt="University of Bamenda Logo"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1"
                        />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://nahpi.cm/departments/computer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <CardTitle>Bachelor's degree: Computer Engineering</CardTitle>
                      </a>
                      <CardDescription>
                        <span className="block text-muted-foreground">University of Bamenda</span>
                        <span className="block text-sm text-muted-foreground/60">In Progress</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-success/10 text-success">
                          Currently Studying
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>


            </div>
          </section>

          {/* License & Certifications Section */}
          <section id="certifications" className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">License && Certifications</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First 4 certificates are always visible */}
                {/* Additional certificates are shown based on visibleCertCount */}
                {[
                  {
                    title: "Python & Django REST API Bootcamp - Build A Python Web API",
                    type: "Professional Certificate",
                    issuer: "Udemy",
                    date: "2024",
                    link: "https://www.udemy.com/certificate/UC-fb43df2f-3568-4e64-a709-d1b598824bc0/",
                    providers: [
                      { name: "Udemy", url: "https://udemy.com", icon: "https://media.licdn.com/dms/image/v2/D560BAQEf_NHzN2yVQg/company-logo_100_100/company-logo_100_100/0/1723593046388/udemy_logo?e=1766620800&v=beta&t=MDQ91-Gf8dlhTSsAgM0g5Dl4-busATcAugZqMixev3A" },
                    ]
                  },
                  {
                    title: "Building Production-Ready React Apps: Setup to Deployment with Firebase",
                    type: "Professional Certificate",
                    issuer: "LinkedIn and Microsoft",
                    date: "2024",
                    link: "https://www.linkedin.com/learning/certificates/36b70fde07fa7c8facc8d9798f5f4500d02c0d9f5162931ba78fa4759f0bfa3b?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BRgRxaei%2FRs6jCWUMvlcNFw%3D%3D",
                    providers: [
                      { name: "Microsoft", url: "https://microsoft.com", icon: "/microsoft-logo.png" },
                      { name: "LinkedIn", url: "https://linkedin.com", icon: "/linkedin-logo.png" }
                    ]
                  },
                  {
                    title: "Intermediate Next.js",
                    type: "Professional Certificate",
                    issuer: "Frontend Masters",
                    date: "2025",
                    link: "https://static.frontendmasters.com/ud/c/2d3b1b4a2c/CyZKLbetbW/intermediate-next-js.pdf",
                    providers: [
                      { name: "Frontend Masters", url: "https://frontendmasters.com/", icon: "/frontendmasters-logo.jpeg" }
                    ]
                  },
                  {
                    title: "React - Complete Developer Course with Hands-On Projects",
                    type: "Professional Certificate",
                    issuer: "Udemy",
                    date: "Dec 2023",
                    link: "https://www.udemy.com/certificate/UC-6f551155-00ef-48d0-8115-018ae2604df8/",
                    providers: [
                      { name: "Udemy", url: "https://udemy.com", icon: "https://media.licdn.com/dms/image/v2/D560BAQEf_NHzN2yVQg/company-logo_100_100/company-logo_100_100/0/1723593046388/udemy_logo?e=1766620800&v=beta&t=MDQ91-Gf8dlhTSsAgM0g5Dl4-busATcAugZqMixev3A" },
                    ]
                  },
                  {
                    title: "JavaScript Algorithms and Data Structures",
                    type: "Professional Certificate",
                    issuer: "freeCodeCamp",
                    date: "Sep 2023",
                    link: "https://www.freecodecamp.org/certification/Leo-Youmbi/javascript-algorithms-and-data-structures",
                    providers: [
                      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", icon: "/free_code_camp_logo.jpeg" }
                    ]
                  }
                ].slice(0, visibleCertCount).map((cert, index) => (
                  <div key={index} className={`card-spotify p-4 rounded-lg hover-lift animate-scale-in delay-${(index % 4 + 1) * 100} flex flex-col`}>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{cert.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-muted-foreground text-[0.6em]">{cert.type}</p>
                        <span className="text-muted-foreground text-[0.6em]">•</span>
                        <p className="text-muted-foreground text-[0.6em]">{cert.issuer}</p>
                        <span className="text-muted-foreground text-[0.6em]">•</span>
                        <p className="text-muted-foreground text-[0.6em]">{cert.date}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-1 transition-colors group text-[0.75em]"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">View Certificate</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </a>
                      <div className="flex gap-2">
                        {cert.providers.map((provider, i) => (
                          <a
                            key={i}
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Image
                              src={provider.icon}
                              alt={`${provider.name} logo`}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                              quality={100}
                              unoptimized
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Certificates Button */}
              {visibleCertCount < 12 && (
                <div className="flex justify-center">
                  <button
                    onClick={handleShowMoreCerts}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-2 transition-colors group"
                  >
                    <div className="flex items-center space-x-2 group-hover:translate-y-[-2px] transition-transform duration-200">
                      <span>Show More</span>
                      <span className="transform transition-transform duration-200">↓</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Show Less Button - only visible when all certificates are shown */}
              {showingAllCerts && (
                <div className="flex justify-center">
                  <button
                    onClick={handleShowMoreCerts}
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
        </div>
      </div>
    </div>
  )
} 