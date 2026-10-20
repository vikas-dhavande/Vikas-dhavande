import React from "react";
import { Award, Calendar, GraduationCap, MapPin } from "lucide-react";
import { EducationItem } from "@/lib/portfolio-types";

interface EducationSectionProps {
  education: EducationItem[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-16 sm:py-24 border-t border-[rgba(39,39,42,0.8)] bg-black/80">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
              <span>Academic Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5]">
              Education &amp; Qualifications
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Formal engineering foundations spanning electronics, communication engineering, and industrial electrical systems.
          </p>
        </div>

        {/* Minimalist High-Contrast Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="group rounded-2xl border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.4)] p-6 sm:p-7 backdrop-blur-sm transition-all duration-200 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(24,24,27,0.7)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(39,39,42,0.8)] bg-black/60 text-[#A1A1AA] group-hover:text-white group-hover:border-white/20 transition-colors">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
                    <Calendar className="h-3 w-3 text-[#8B5CF6]" />
                    <span>{edu.period}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {edu.degree}
                </h3>

                <p className="text-sm font-semibold text-[#8B5CF6] mt-1.5 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  {edu.institution}
                </p>

                {edu.details && (
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>

              {edu.location && (
                <div className="mt-5 pt-3 border-t border-[rgba(39,39,42,0.5)] flex items-center gap-1.5 text-xs text-[#71717A]">
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
