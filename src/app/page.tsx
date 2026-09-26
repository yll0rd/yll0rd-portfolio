import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectsSection from "@/components/projects-section";
export default function Page() {
  return (
    <div className="site-width">
      <section className="max-w-[940px] pt-[100px] pb-28 max-[700px]:pt-16 max-[700px]:pb-[72px]">
        <p className="eyebrow">Youmbi Leo · AI/ML engineer</p>
        <h1 className="page-title">
          I build software, and write about <em>what stays on my mind.</em>
        </h1>
        <p className="intro-copy">
          I’m Leo, an AI/ML engineer. This is where I share my work, things I’m
          learning, and thoughts from everyday life.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-7">
          <Link
            href="/about"
            className="inline-flex items-center gap-[18px] rounded bg-primary px-[22px] py-[15px] text-primary-foreground hover:opacity-90"
          >
            A little about me <ArrowRight size={18} />
          </Link>
          <Link href="/work" className="text-link">
            Explore my work <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section
        className="mb-24 max-[700px]:mb-16"
        aria-labelledby="selected-work"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 id="selected-work" className="text-2xl font-medium">
            Selected work
          </h2>
          <Link href="/work" className="text-link">
            All projects <ArrowRight size={16} />
          </Link>
        </div>
        <ProjectsSection limit={2} />
      </section>
      <section className="max-w-[690px] border-l-2 border-secondary pt-11 pr-0 pb-3 pl-7 max-[700px]:pl-5 mb-24 max-[700px]:mb-16">
        <p className="eyebrow">Writing</p>
        <h2 className="editorial-title">Room for a longer thought.</h2>
        <p className="mb-[18px] leading-[1.8] text-muted-foreground">
          Notes on building software, things I’m learning, and life beyond the
          screen. No posts published yet.
        </p>
        <Link href="/writing" className="text-link">
          Visit writing <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
