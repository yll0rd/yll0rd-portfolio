import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import ExperienceSection from "@/components/experience-section";
import EducationSection from "@/components/education-section";
import CertificatesSection from "@/components/certificates-section";
import ContactSection from "@/components/contact-section";
import SkillsDialog from "@/components/skills-dialog";
export const metadata: Metadata = {
  title: "About | Youmbi Leo",
  description:
    "Meet Youmbi Leo: AI/ML engineer, guitar player, and manga reader.",
  alternates: { canonical: "https://yll0rd.me/about" },
};
export default function AboutPage() {
  return (
    <div className="site-width pb-[100px]">
      <header className="grid grid-cols-[1.4fr_1fr] items-center gap-20 pt-20 pb-24 max-[700px]:grid-cols-1 max-[700px]:gap-10 max-[700px]:pt-14 max-[700px]:pb-16">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="page-title">
            I’m Leo.
            <br />
            <em>Call me yll0rd.</em>
          </h1>
          <p className="intro-copy">
            An AI/ML engineer with a full-stack background. Mostly self-taught,
            always learning.
          </p>
          <p className="my-5 max-w-[560px] leading-[1.8] text-muted-foreground">
            I build software and explore machine learning. Here, I’m making
            space to share both the work and the person behind it.
          </p>
          <a
            href="https://drive.google.com/file/d/1z8IWwn6kJray4w6N3kn0MIUb8myFj_At/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            View my résumé <ArrowUpRight size={17} />
          </a>
        </div>
        <figure className="max-[700px]:w-full max-[700px]:max-w-[380px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-muted">
            <Image
              src="/myself.jpg"
              alt="Youmbi Leo"
              fill
              priority
              sizes="(max-width: 700px) 85vw, 350px"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3.5 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            Youmbi Leo <span>yll0rd / why-lord</span>
          </figcaption>
        </figure>
      </header>
      <section className="grid grid-cols-[1fr_2fr] gap-12 border-t border-border pt-9 max-[700px]:grid-cols-1 max-[700px]:gap-5 mb-24 max-[700px]:mb-16">
        <h2 className="text-2xl font-medium">My path</h2>
        <div>
          <p className="story-copy">
            I started with full-stack development, building web applications and
            working across the frontend and backend. That work led me to
            integrate LLM-powered features into real products.
          </p>
          <p className="story-copy">
            My focus now is on training and deploying machine learning models
            end to end. I’m still learning, building, and figuring out where I
            want to take that work next.
          </p>
          <SkillsDialog />
        </div>
      </section>
      <section className="grid grid-cols-[1fr_2fr] gap-12 border-t border-border pt-9 max-[700px]:grid-cols-1 max-[700px]:gap-5 mb-24 max-[700px]:mb-16">
        <h2 className="text-2xl font-medium">Beyond work</h2>
        <div>
          <p className="story-copy">
            Away from code, I enjoy playing acoustic guitar{" "}
            <Image
              src="/acoustic-guitar.png"
              alt=""
              width={24}
              height={24}
              className="inline-block align-middle"
            />{" "}
            and reading manga 📖. They’re part of my life that I want to make
            room for here, too.
          </p>
          <p className="story-copy">
            My writing will also include personal observations, questions about
            life, and whatever else stays on my mind.
          </p>
        </div>
      </section>
      <div className="pt-4">
        <ExperienceSection />
        <EducationSection />
        <CertificatesSection />
      </div>
      <ContactSection />
    </div>
  );
}
