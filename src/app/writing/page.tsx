import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata: Metadata = {
  title: "Writing | Youmbi Leo",
  description:
    "Technical notes, personal reflections, and everyday observations by Youmbi Leo.",
  alternates: { canonical: "https://yll0rd.me/writing" },
};
export default function WritingPage() {
  return (
    <div className="site-width pb-[100px]">
      <header className="pt-20 pb-16 max-[700px]:pt-14 max-[700px]:pb-11">
        <p className="eyebrow">Writing</p>
        <h1 className="page-title">Things on my mind.</h1>
        <p className="intro-copy">
          Software, things I’m learning, and the questions that follow me
          through everyday life. A place for technical notes and personal
          reflections.
        </p>
      </header>
      <section className="max-w-[760px] border-t border-border pt-11 pb-20">
        <span className="text-xs font-medium uppercase tracking-[.12em] text-muted-foreground">
          The first page
        </span>
        <h2 className="editorial-title mt-5">No posts just yet.</h2>
        <p className="mb-[18px] leading-[1.8] text-muted-foreground">
          When I have something to share, it will find a home here.
        </p>
        <Link href="/about" className="text-link">
          Get to know me <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
