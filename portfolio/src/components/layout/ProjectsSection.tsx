import React from "react";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { ProjectItem } from "@/lib/portfolio-types";

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-border bg-background transition-colors duration-200">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Open-source libraries, web applications, and intelligent systems engineered with focus on design and reliability.
          </p>
        </div>

        {/* Minimalist High-Contrast Projects List */}
        <div className="divide-y divide-border border-y border-border">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group py-10 sm:py-12 transition-all duration-200 hover:bg-muted/30 px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                {/* Meta Column */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span className="text-muted-foreground/80">{project.category}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight group-hover:text-foreground/90">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="inline-block mt-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-500">
                      Featured Build
                    </span>
                  )}
                </div>

                {/* Description & Details Column */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                  <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                    {project.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-secondary/70 px-2.5 py-1 text-xs font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Column */}
                <div className="lg:col-span-3 flex lg:flex-col lg:items-end justify-start gap-3 pt-2 lg:pt-0">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
