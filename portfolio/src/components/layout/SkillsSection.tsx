import React from "react";
import { Cpu, Sparkles } from "lucide-react";
import { SkillCategory } from "@/lib/portfolio-types";

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export function SkillsSection({ categories }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-border bg-background transition-colors duration-200">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span>Technical Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Skills &amp; Capabilities
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Languages, frameworks, and tools applied across production web systems, cloud infrastructure, and AI engineering.
          </p>
        </div>

        {/* Minimalist High-Contrast Categorized List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-200 hover:border-foreground/20 hover:bg-card shadow-xs"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {cat.category}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>

              {/* Skills Item List */}
              <div className="divide-y divide-border/60">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="py-3 flex items-center justify-between group transition-colors hover:bg-muted/40 px-2 -mx-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      {skill.highlight ? (
                        <Sparkles className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-foreground transition-colors shrink-0" />
                      )}
                      <span className={`text-sm tracking-tight transition-colors ${
                        skill.highlight ? "font-semibold text-foreground" : "text-foreground/90 group-hover:text-foreground"
                      }`}>
                        {skill.name}
                      </span>
                    </div>

                    {skill.level && (
                      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
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
