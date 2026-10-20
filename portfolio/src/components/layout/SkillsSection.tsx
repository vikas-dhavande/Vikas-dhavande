import React from "react";
import { Cpu, Sparkles } from "lucide-react";
import { SkillCategory } from "@/lib/portfolio-types";

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export function SkillsSection({ categories }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-[rgba(39,39,42,0.8)] bg-black">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span>Technical Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5]">
              Skills &amp; Capabilities
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Languages, frameworks, and tools applied across production web systems, cloud infrastructure, and AI engineering.
          </p>
        </div>

        {/* Minimalist High-Contrast Categorized List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.4)] p-6 sm:p-8 backdrop-blur-sm transition-all duration-200 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(24,24,27,0.7)]"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[rgba(39,39,42,0.6)] mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {cat.category}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-[#71717A] mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(39,39,42,0.8)] bg-black/50 text-[#A1A1AA]">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>

              {/* Skills Item List */}
              <div className="divide-y divide-[rgba(39,39,42,0.4)]">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="py-3 flex items-center justify-between group transition-colors hover:bg-[rgba(255,255,255,0.02)] px-2 -mx-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      {skill.highlight ? (
                        <Sparkles className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#71717A] group-hover:bg-white transition-colors shrink-0" />
                      )}
                      <span className={`text-sm tracking-tight transition-colors ${
                        skill.highlight ? "font-semibold text-white" : "text-[#D4D4D8] group-hover:text-white"
                      }`}>
                        {skill.name}
                      </span>
                    </div>

                    {skill.level && (
                      <span className="font-mono text-[11px] text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
