import Image from "next/image";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { projects } from "@/lib/projects";
export default function ProjectsSection({
  limit,
  className = "",
}: {
  limit?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-9 gap-y-16 max-[700px]:grid-cols-1 max-[700px]:gap-12 ${className}`}
    >
      {projects.slice(0, limit).map((project) => (
        <article key={project.title}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-muted">
            {project.type !== "mobile" ? (
              <Image
                src={project.previewImage}
                alt={`${project.title} interface`}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-primary">
                <Smartphone size={40} strokeWidth={1} />
                <span>Recipe Finder · Mobile app</span>
              </div>
            )}
          </div>
          <div className="mt-[23px] flex items-baseline justify-between gap-3">
            <h2 className="text-2xl font-medium tracking-[-.02em]">
              {project.title}
            </h2>
            <span className="text-xs text-muted-foreground">
              {project.type}
            </span>
          </div>
          <p className="mt-2.5 leading-[1.7] text-muted-foreground">
            {project.description}
          </p>
          <ul
            className="mt-[17px] flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground"
            aria-label="Technologies"
          >
            {project.technologies.map((tech) => (
              <li key={tech.name}>{tech.name}</li>
            ))}
          </ul>
          <div className="mt-3.5 flex flex-wrap items-center gap-6 text-sm">
            {project.liveLink && (
              <a
                className="text-link"
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit project <ArrowUpRight size={16} />
              </a>
            )}
            {!project.isPrivate && "githubLink" in project && (
              <a
                className="text-link"
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code <ArrowUpRight size={16} />
              </a>
            )}
            {project.isPrivate && (
              <span className="text-sm text-muted-foreground">
                Private source
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
