import React from "react";
import { Award, Calendar, GraduationCap, MapPin } from "lucide-react";
import { EducationItem } from "@/lib/portfolio-types";

interface EducationSectionProps {
  education: EducationItem[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-16 sm:py-24 border-t border-border bg-background/80 transition-colors duration-200">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
              <span>Academic Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Education &amp; Qualifications
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Formal engineering foundations spanning electronics, communication engineering, and industrial electrical systems.
          </p>
        </div>

        {/* Minimalist High-Contrast Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="group rounded-2xl border border-border bg-card/60 p-6 sm:p-7 backdrop-blur-sm transition-all duration-200 hover:border-foreground/20 hover:bg-card flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/80 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-colors">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <Calendar className="h-3 w-3 text-[#8B5CF6]" />
                    <span>{edu.period}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug">
                  {edu.degree}
                </h3>

                <p className="text-sm font-semibold text-[#8B5CF6] mt-1.5 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  {edu.institution}
                </p>

                {edu.details && (
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>

              {edu.location && (
                <div className="mt-5 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground/80">
                  <MapPin className="h-3 w-3" />
                  <span>{edu.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
