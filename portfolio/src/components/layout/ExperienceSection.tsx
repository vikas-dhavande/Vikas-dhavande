"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Building2,
  Layers,
  ShieldCheck,
  Cpu,
  Gauge,
  Workflow,
  Factory,
} from "lucide-react";
import { ExperienceItem } from "@/lib/portfolio-types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"spotlight" | "list">("spotlight");

  const safeExperiences = useMemo(() => experiences || [], [experiences]);
  const activeExp = safeExperiences[selectedIndex] || safeExperiences[0];

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? safeExperiences.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === safeExperiences.length - 1 ? 0 : prev + 1
    );
  };

  // Helper to assign specialized engineering domain tags & icons based on role/company
  const getDomainInfo = (company: string, role: string) => {
    const text = `${company} ${role}`.toLowerCase();
    if (text.includes("foxconn")) {
      return {
        label: "Aerospace & National Defense Avionics",
        icon: <ShieldCheck className="h-3.5 w-3.5 text-[#E11D48]" />,
        badgeClass: "border-[#E11D48]/40 bg-[#E11D48]/10 text-[#FB7185]",
      };
    }
    if (text.includes("iisc") || text.includes("science")) {
      return {
        label: "Premier Scientific Aerospace R&D",
        icon: <Cpu className="h-3.5 w-3.5 text-amber-400" />,
        badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      };
    }
    if (text.includes("bosch") && text.includes("lead")) {
      return {
        label: "Automotive ECUs & High-Voltage Power Systems",
        icon: <Gauge className="h-3.5 w-3.5 text-blue-400" />,
        badgeClass: "border-blue-500/40 bg-blue-500/10 text-blue-300",
      };
    }
    if (text.includes("bosch")) {
      return {
        label: "NPI Engineering Change & Industrial SAP Trials",
        icon: <Workflow className="h-3.5 w-3.5 text-violet-400" />,
        badgeClass: "border-violet-500/40 bg-violet-500/10 text-violet-300",
      };
    }
    if (text.includes("wistron")) {
      return {
        label: "High-Speed SMT & Main Logic Board Manufacturing",
        icon: <Factory className="h-3.5 w-3.5 text-emerald-400" />,
        badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
      };
    }
    return {
      label: "Electronic Systems & Product Engineering",
      icon: <Briefcase className="h-3.5 w-3.5 text-zinc-400" />,
      badgeClass: "border-zinc-700 bg-zinc-800 text-zinc-300",
    };
  };

  if (!safeExperiences.length) {
    return null;
  }

  const activeDomain = activeExp
    ? getDomainInfo(activeExp.company, activeExp.role)
    : null;

  return (
    <section
      id="experience"
      aria-label="Work Experience and Career History"
      className="relative min-h-screen w-full flex flex-col justify-center py-10 sm:py-14 lg:py-16 border-t border-[rgba(39,39,42,0.8)] bg-black/60 overflow-hidden selection:bg-[#E11D48]/30"
    >
      {/* Ambient background accents for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[#E11D48]/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#3B82F6]/10 blur-[150px]"
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center flex-1">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 lg:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-3 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48] animate-pulse" />
              <span>Career Track</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-mono text-[11px]">
                {safeExperiences.length} Milestones
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5] flex items-center gap-3">
              <span>Experience</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-md text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Engineering roles, architectural leadership, and scalable avionics systems built across aerospace, defense, and automotive industry leaders.
            </p>

            {/* View Mode Switcher */}
            <div className="inline-flex items-center self-start sm:self-auto rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode("spotlight")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
                  viewMode === "spotlight"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-[#A1A1AA] hover:text-white"
                )}
                title="Interactive Spotlight View"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Spotlight</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
                  viewMode === "list"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-[#A1A1AA] hover:text-white"
                )}
                title="All Companies Stream View"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>All Companies</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── VIEW 1: SPOTLIGHT FULL-SCREEN DUAL PANE ──────────────────────── */}
        {viewMode === "spotlight" && activeExp && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: "Icons Side" / Company Rail */}
            <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(39,39,42,0.6)]">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
                  Companies Worked &amp; Working
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Select to inspect
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-2.5 overflow-y-auto max-h-[580px] pr-1 scrollbar-thin">
                {safeExperiences.map((exp, index) => {
                  const isSelected = index === selectedIndex;
                  const isCurrentlyWorking =
                    exp.isCurrent ||
                    exp.period.toLowerCase().includes("present");

                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={cn(
                        "group relative w-full text-left rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer",
                        "hover:bg-[rgba(255,255,255,0.03)]",
                        isSelected
                          ? "border-white/30 bg-[rgba(24,24,27,0.85)] shadow-lg shadow-black/40"
                          : "border-[rgba(39,39,42,0.8)] bg-[rgba(18,18,20,0.5)] hover:border-[rgba(255,255,255,0.2)]"
                      )}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Company Logo Icon on the side */}
                        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <CompanyLogo
                            company={exp.company}
                            size="md"
                            isCurrent={isCurrentlyWorking}
                            className={cn(
                              "transition-all duration-200",
                              isSelected
                                ? "border-white/40 ring-2 ring-white/10"
                                : "group-hover:border-white/30"
                            )}
                          />
                        </div>

                        {/* Company Info with Text Hover Effects */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-[#E11D48]" />
                              <span>{exp.period}</span>
                            </span>

                            {isCurrentlyWorking ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Working Here
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-[#71717A] rounded border border-zinc-800 px-1.5 py-0.5">
                                {exp.type || "Worked"}
                              </span>
                            )}
                          </div>

                          {/* Company Name with Text Hover Slide/Color Effect */}
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-bold tracking-tight truncate transition-all duration-200",
                              isSelected
                                ? "text-white translate-x-1"
                                : "text-[#D4D4D8] group-hover:text-white group-hover:translate-x-1"
                            )}
                          >
                            {exp.company}
                          </h3>

                          {/* Role with Hover Effect */}
                          <p
                            className={cn(
                              "text-xs truncate mt-0.5 transition-colors duration-200",
                              isSelected
                                ? "text-[#E11D48] font-medium"
                                : "text-[#A1A1AA] group-hover:text-zinc-300"
                            )}
                          >
                            {exp.role}
                          </p>
                        </div>

                        {/* Chevron Indicator */}
                        <div
                          className={cn(
                            "self-center shrink-0 transition-all duration-200 text-[#71717A]",
                            isSelected
                              ? "text-white translate-x-0.5"
                              : "opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:translate-x-0.5"
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Experience Stage Details */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[rgba(39,39,42,0.8)] bg-gradient-to-br from-[rgba(24,24,27,0.85)] via-[rgba(18,18,20,0.92)] to-[rgba(10,10,12,0.96)] p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Subtle top accent gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E11D48]/60 to-transparent"
              />

              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Header Banner: Company Logo + Names + External Link */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 sm:pb-6 border-b border-[rgba(39,39,42,0.6)]">
                  <div className="flex items-start gap-4">
                    <CompanyLogo
                      company={activeExp.company}
                      size="lg"
                      isCurrent={
                        activeExp.isCurrent ||
                        activeExp.period.toLowerCase().includes("present")
                      }
                      className="border-white/20 shadow-lg"
                    />
                    <div>
                      {/* Domain Badge */}
                      {activeDomain && (
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-mono font-medium mb-2",
                            activeDomain.badgeClass
                          )}
                        >
                          {activeDomain.icon}
                          <span>{activeDomain.label}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
                          <Calendar className="h-3.5 w-3.5 text-[#E11D48]" />
                          <span>{activeExp.period}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-xs text-[#71717A]">
                          <MapPin className="h-3 w-3" />
                          {activeExp.location}
                        </span>
                        {activeExp.type && (
                          <>
                            <span>•</span>
                            <span className="rounded border border-[rgba(39,39,42,0.8)] bg-black/40 px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
                              {activeExp.type}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <span>{activeExp.company}</span>
                        {activeExp.link && (
                          <a
                            href={activeExp.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors duration-150 p-1 hover:bg-white/5 rounded-md"
                            aria-label={`Visit ${activeExp.company}`}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Status Tag */}
                  {(activeExp.isCurrent ||
                    activeExp.period.toLowerCase().includes("present")) && (
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Currently Working
                    </span>
                  )}
                </div>

                {/* Role Title with Text Hover Feedback */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(39,39,42,0.8)] bg-black/60 text-[#E11D48]">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-[#F4F4F5] tracking-tight">
                    {activeExp.role}
                  </h4>
                </div>

                {/* Narrative Summary */}
                <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
                  {activeExp.description}
                </p>

                {/* Highlights List with Glowing Markers */}
                {activeExp.highlights && activeExp.highlights.length > 0 && (
                  <div className="flex flex-col gap-2.5 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
                      Key Deliverables &amp; Technical Impact
                    </span>
                    <ul className="space-y-2.5">
                      {activeExp.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="group/item flex items-start gap-3 text-xs sm:text-sm text-[#D4D4D8]/90 leading-relaxed transition-colors hover:text-white"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E11D48] shrink-0 transition-transform duration-200 group-hover/item:scale-150" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Pills with Rich Hover Effect */}
                <div className="flex flex-col gap-2 pt-3 border-t border-[rgba(39,39,42,0.6)]">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
                    Technologies &amp; Systems Applied
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeExp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.8)] px-3 py-1.5 text-xs font-mono text-[#D4D4D8] transition-all duration-200 hover:border-white/40 hover:bg-zinc-800 hover:text-white hover:scale-[1.02] cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Pagination & Interactive Controls */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[rgba(39,39,42,0.6)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#A1A1AA]">
                    <span className="text-white font-bold">
                      {String(selectedIndex + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(safeExperiences.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous company experience"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] text-[#A1A1AA] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next company experience"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] text-[#A1A1AA] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {activeExp.link && (
                    <a
                      href={activeExp.link}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white text-black px-4 py-1.5 text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Visit Company</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 2: STREAM LIST WITH COMPANY ICONS ON THE SIDE ───────────── */}
        {viewMode === "list" && (
          <div className="divide-y divide-[rgba(39,39,42,0.8)] border-y border-[rgba(39,39,42,0.8)]">
            {safeExperiences.map((exp) => {
              const isCurrentlyWorking =
                exp.isCurrent || exp.period.toLowerCase().includes("present");
              const domain = getDomainInfo(exp.company, exp.role);

              return (
                <div
                  key={exp.id}
                  className="group py-10 sm:py-12 transition-all duration-200 hover:bg-[rgba(255,255,255,0.02)] px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-2xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    {/* Meta Column with Company Icon on the side */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="flex items-start gap-4">
                        {/* Company Logo Icon on the side */}
                        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <CompanyLogo
                            company={exp.company}
                            size="lg"
                            isCurrent={isCurrentlyWorking}
                            className="group-hover:border-white/30"
                          />
                        </div>

                        {/* Company Details */}
                        <div className="flex-1 min-w-0">
                          {domain && (
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium mb-1.5",
                                domain.badgeClass
                              )}
                            >
                              {domain.icon}
                              <span>{domain.label}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] tracking-wider mb-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#E11D48]" />
                            <span>{exp.period}</span>
                          </div>

                          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1">
                            <span>{exp.company}</span>
                            {exp.link && (
                              <a
                                href={exp.link}
                                target="_blank"
                                rel="noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-[#A1A1AA] hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
                            {isCurrentlyWorking && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Currently Working
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#A1A1AA]" />
                        <h4 className="text-lg font-semibold text-[#F4F4F5] tracking-tight group-hover:text-white transition-colors">
                          {exp.role}
                        </h4>
                      </div>

                      <p className="text-sm text-[#A1A1AA] leading-relaxed group-hover:text-[#D4D4D8] transition-colors">
                        {exp.description}
                      </p>

                      {/* Highlights Bullet List with Text Hover Effects */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-2 mt-1">
                          {exp.highlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="group/item flex items-start gap-2.5 text-xs sm:text-sm text-[#D4D4D8]/90 leading-relaxed transition-colors hover:text-white"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E11D48] shrink-0 transition-transform duration-200 group-hover/item:scale-150" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Tech Stack Pills with Enhanced Hover State */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[rgba(39,39,42,0.4)]">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] px-2.5 py-1 text-xs font-mono text-[#D4D4D8] transition-all duration-200 group-hover:border-[rgba(255,255,255,0.25)] hover:border-white/50 hover:bg-zinc-800 hover:text-white"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExperienceSection;
