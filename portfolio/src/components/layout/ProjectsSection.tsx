import React from "react";
import { ArrowUpRight, Code2, FolderGit2 } from "lucide-react";
import { ProjectItem } from "@/lib/portfolio-types";

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-[rgba(39,39,42,0.8)] bg-black/40">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5]">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Open-source libraries, web applications, and intelligent systems engineered with focus on design and reliability.
          </p>
        </div>

        {/* Minimalist High-Contrast Projects List */}
        <div className="divide-y divide-[rgba(39,39,42,0.8)] border-y border-[rgba(39,39,42,0.8)]">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group py-10 sm:py-12 transition-all duration-200 hover:bg-[rgba(255,255,255,0.015)] px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                {/* Meta Column */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] mb-2">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span className="text-[#71717A]">{project.category}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-white/95">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="inline-block mt-2.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-mono font-medium text-[#34D399]">
                      Featured Build
                    </span>
                  )}
                </div>

                {/* Description & Details Column */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                  <p className="text-sm font-medium text-[#F4F4F5] leading-relaxed">
                    {project.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] px-2.5 py-1 text-xs font-mono text-[#D4D4D8]"
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white text-black px-4 py-2 text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-sm"
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
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-xs font-medium text-[#D4D4D8] hover:text-white hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
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
