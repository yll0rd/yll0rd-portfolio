import type { Metadata } from "next";
import ProjectsSection from "@/components/projects-section";
export const metadata: Metadata = {
  title: "Work | Youmbi Leo",
  description: "A selection of web and mobile projects by Youmbi Leo.",
  alternates: { canonical: "https://yll0rd.me/work" },
};
export default function WorkPage() {
  return (
    <div className="site-width pb-[100px]">
      <header className="pt-20 pb-16 max-[700px]:pt-14 max-[700px]:pb-11">
        <p className="eyebrow">Work</p>
        <h1 className="page-title">Ideas made useful.</h1>
        <p className="intro-copy">
          A selection of projects I’ve worked on, from healthcare and language
          learning to education and cultural archives.
        </p>
      </header>
      <ProjectsSection />
    </div>
  );
}
