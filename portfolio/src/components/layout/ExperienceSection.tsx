import React from "react";
import { ArrowUpRight, Briefcase, Calendar, MapPin } from "lucide-react";
import { ExperienceItem } from "@/lib/portfolio-types";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 sm:py-28 border-t border-[rgba(39,39,42,0.8)] bg-black/40">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
              <span>Career Track</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5]">
              Experience
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Engineering roles, architectural leadership, and scalable systems built across fast-growing teams.
          </p>
        </div>

        {/* Minimalist High-Contrast List */}
        <div className="divide-y divide-[rgba(39,39,42,0.8)] border-y border-[rgba(39,39,42,0.8)]">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group py-10 sm:py-12 transition-all duration-200 hover:bg-[rgba(255,255,255,0.015)] px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Meta Column */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] tracking-wider mb-2">
                      <Calendar className="h-3.5 w-3.5 text-[#E11D48]" />
                      <span>{exp.period}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      {exp.company}
                      {exp.link && (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A1A1AA] hover:text-white"
                          aria-label={`Visit ${exp.company}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#71717A]">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                      {exp.type && (
                        <>
                          <span>•</span>
                          <span className="rounded border border-[rgba(39,39,42,0.8)] px-1.5 py-0.5 text-[11px] text-[#A1A1AA]">
                            {exp.type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#A1A1AA]" />
                    <h4 className="text-lg font-semibold text-[#F4F4F5] tracking-tight">
                      {exp.role}
                    </h4>
                  </div>

                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Highlights Bullet List */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2 mt-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D4D4D8]/90 leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E11D48] shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[rgba(39,39,42,0.4)]">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] px-2.5 py-1 text-xs font-mono text-[#D4D4D8] transition-colors group-hover:border-[rgba(255,255,255,0.2)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
