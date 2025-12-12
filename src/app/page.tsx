"use client"

import { ThemeSparkles } from "@/components/ui/ThemeSparkles"
import HeroSection from "@/components/hero"
import SkillsSection from "@/components/skills-section";
import { GravityStarsBackground } from "@/components/ui/gravity-stars-background"
import Navbar from "@/components/navbar"
import ExperienceSection from "@/components/experience-section";
import EducationSection from "@/components/education-section";
import CertificatesSection from "@/components/certificates-section";
import ProjectsSection from "@/components/projects-section";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-transparent">
      <ThemeSparkles className="sparkles-background" />
      {/* <GravityStarsBackground
        className="absolute inset-0 z-10"
        starsCount={800}
      /> */}

      <Navbar />
      <div className="px-4 py-12 lg:py-16 z-0">
        {/* Hero Section */}
        <HeroSection className="max-w-7xl mx-auto" />

        {/* Skills Section */}
        <SkillsSection className="max-w-4xl mx-auto" />

        {/* Projects Section */}
        <ProjectsSection className="max-w-4xl mx-auto" />

        {/* Experience Section */}
        <ExperienceSection className="max-w-4xl mx-auto" />

        {/* Education Section */}
        <EducationSection className="max-w-4xl mx-auto" />

        {/* License & Certifications Section */}
        <CertificatesSection className="max-w-4xl mx-auto" />
      </div>
    </div>
  )
} 