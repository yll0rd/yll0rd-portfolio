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
import ContactSection from "@/components/contact-section";
import AnimatedSection from "@/components/ui/animated-section";

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
        <AnimatedSection>
          <SkillsSection className="max-w-5xl mx-auto" />
        </AnimatedSection>

        {/* Projects Section */}
        <AnimatedSection>
          <ProjectsSection className="max-w-5xl mx-auto" />
        </AnimatedSection>

        {/* Experience Section */}
        <AnimatedSection>
          <ExperienceSection className="max-w-5xl mx-auto" />
        </AnimatedSection>

        {/* Education Section */}
        <AnimatedSection>
          <EducationSection className="max-w-5xl mx-auto" />
        </AnimatedSection>

        {/* License & Certifications Section */}
        <AnimatedSection>
          <CertificatesSection className="max-w-5xl mx-auto" />
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection>
          <ContactSection className="max-w-5xl mx-auto" />
        </AnimatedSection>
      </div>
    </div>
  )
} 