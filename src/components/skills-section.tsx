import React from 'react'

import Image from "next/image"
import { ALL_SKILLS_ICONS } from '@/lib/constants';

const SkillsSection = ({ className="" }: { className?: string }) => {
  return (
    <section id="skills" className={`mb-24 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Skills && Technologies</h2>
      <div className="card-spotify rounded-lg p-4">
        <div className="max-lg:grid grid-cols-3 sm:grid-cols-4 lg:flex lg:justify-between gap-4 md:gap-8 group">
          {/* Column 0 - AI & Machine Learning */}
          <div className="animate-slide-in">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "PyTorch", icon: ALL_SKILLS_ICONS.pytorch },
                { name: "TensorFlow", icon: ALL_SKILLS_ICONS.tensorflow },
                { name: "scikit-learn", icon: ALL_SKILLS_ICONS.scikitlearn },
                { name: "Pandas", icon: ALL_SKILLS_ICONS.pandas },
                { name: "NumPy", icon: ALL_SKILLS_ICONS.numpy },
                { name: "Hugging Face", icon: ALL_SKILLS_ICONS.huggingface },
                { name: "Ollama", icon: ALL_SKILLS_ICONS.ollama }
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 1 - Programming Languages */}
          <div className="animate-slide-in delay-100">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "JavaScript", icon: "/icons/javascript-svgrepo-com.svg" },
                { name: "TypeScript", icon: "/icons/typescript-svgrepo-com.svg" },
                { name: "Python", icon: "/icons/python-svgrepo-com.svg" },
                { name: "Java", icon: "/icons/java-svgrepo-com.svg" },
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Frontend Frameworks */}
          <div className="animate-slide-in delay-200">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "React", icon: "/icons/react-svgrepo-com.svg" },
                { name: "Next.js", icon: "/icons/nextjs_icon_dark.svg" },
                { name: "Angular", icon: "/icons/angular.svg" },
                { name: "Tailwind", icon: "/icons/tailwind-svgrepo-com.svg" },
                { name: "NPM", icon: "/icons/npm-svgrepo-com.svg" },
                // { name: "Hugo", icon: "/icons/hugo-svgrepo-com.svg" },
                // { name: "WordPress", icon: "/icons/wordpress-color-svgrepo-com.svg" },
                // { name: "Deno", icon: "/icons/Deno_Logo_2024.svg" },
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 - Backend & Databases */}
          <div className="animate-slide-in delay-300">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "Node.js", icon: "/icons/node-svgrepo-com.svg" },
                { name: "Express", icon: ALL_SKILLS_ICONS.express },
                { name: "Django", icon: "/icons/django.svg" },
                { name: "Springboot", icon: "/icons/spring.svg" },
                { name: "NestJs", icon: "/icons/nestjs.svg" },
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - DevOps & Cloud */}
          <div className="animate-slide-in delay-400">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "Docker", icon: "/icons/docker-svgrepo-com(1).svg" },
                { name: "AWS", icon: "/icons/aws-svgrepo-com.svg" },
                { name: "Azure", icon: "/icons/azure-svgrepo-com.svg" },
                { name: "Vercel", icon: ALL_SKILLS_ICONS.vercel }
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 5 - Development Tools */}
          <div className="animate-slide-in delay-600">
            <div className="space-y-2 md:space-y-4">
              {[
                { name: "VS Code", icon: "/icons/vscode-svgrepo-com.svg" },
                { name: "Terminal", icon: "/icons/terminal-svgrepo-com.svg" },
                { name: "Bash", icon: "/icons/bash-icon-svgrepo-com.svg" },
                { name: "Notion", icon: "/icons/notion-logo-svgrepo-com.svg" }
              ].map((tech: { name: string; icon: string }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={20}
                    height={20}
                    className="size-5 lg:grayscale lg:group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <figure className="mt-10 max-w-2xl mx-auto text-center">
        <blockquote className="text-base md:text-lg italic text-muted-foreground leading-relaxed">
          &ldquo;I&apos;m not bound by this list. Whatever tool the market or the job calls for, I&apos;ll pick it up.
          At the end of the day, it&apos;s just a tool; the result is what matters.&rdquo;
        </blockquote>
        <figcaption className="mt-3 text-sm font-medium text-foreground">&mdash; yll0rd</figcaption>
      </figure>
    </section>
  )
}

export default SkillsSection;