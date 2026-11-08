"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EducationItem } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface EducationSectionProps {
  education: EducationItem[];
  /** Height of your fixed navbar in px (or any CSS length). Auto-detected when omitted. */
  stickyTop?: number | string;
}

const isCurrent = (edu: EducationItem) =>
  /present|current|ongoing/i.test(edu.period);

// Field label per degree. Text only, with a colored dot as the accent.
const getFieldInfo = (degree: string, institution: string) => {
  const text = `${degree} ${institution}`.toLowerCase();
  if (text.includes("communication"))
    return { label: "Communication engineering", dot: "bg-blue-400" };
  if (text.includes("electrical"))
    return { label: "Industrial electrical systems", dot: "bg-amber-400" };
  if (text.includes("electronic"))
    return { label: "Electronics engineering", dot: "bg-violet-400" };
  return { label: "Engineering foundations", dot: "bg-zinc-400" };
};

function CurrentTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Currently studying here
    </span>
  );
}

function FieldLabel({ degree, institution }: { degree: string; institution: string }) {
  const field = getFieldInfo(degree, institution);
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", field.dot)} />
      {field.label}
    </span>
  );
}

// ─── Education in numbers ─────────────────────────────────────────────────

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Turns "2015 - 2019" or "Aug 2019 – Present" into [startMonth, endMonth] (absolute month index)
function parsePeriod(period: string): [number, number] | null {
  const parts = period.split(/\s*(?:-|–|—|\bto\b)\s*/i).filter(Boolean);
  if (!parts.length) return null;

  const toIndex = (part: string, isEnd: boolean): number | null => {
    const lower = part.toLowerCase();
    if (/present|current|now|ongoing/.test(lower)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const year = lower.match(/(?:19|20)\d{2}/);
    if (!year) return null;
    const m = MONTHS.findIndex((name) => lower.includes(name));
    return Number(year[0]) * 12 + (m >= 0 ? m : isEnd ? 11 : 0);
  };

  const start = toIndex(parts[0], false);
  const end = parts.length > 1 ? toIndex(parts[parts.length - 1], true) : start;
  if (start === null || end === null) return null;
  return end >= start ? [start, end] : [end, start];
}

// Total months studied, merging overlaps so parallel programs are not double counted
function totalMonths(education: EducationItem[]): number {
  const ranges = education
    .map((e) => parsePeriod(e.period))
    .filter((r): r is [number, number] => r !== null)
    .sort((a, b) => a[0] - b[0]);

  let total = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [start, end] of ranges) {
    if (curStart === -1) {
      curStart = start;
      curEnd = end;
    } else if (start <= curEnd + 1) {
      curEnd = Math.max(curEnd, end);
    } else {
      total += curEnd - curStart + 1;
      curStart = start;
      curEnd = end;
    }
  }
  if (curStart !== -1) total += curEnd - curStart + 1;
  return total;
}

function useCountUp(target: number, decimals: number, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value.toFixed(decimals);
}

function Stat({
  value,
  decimals = 0,
  suffix,
  label,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}) {
  const shown = useCountUp(value, decimals);
  return (
    <div className="flex min-w-0 flex-col sm:px-4 sm:first:pl-0 sm:last:pr-0">
      <span className="text-xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">
        {shown}
        {suffix && <span className="text-primary">{suffix}</span>}
      </span>
      <span className="mt-0.5 truncate text-[10px] text-muted-foreground sm:text-xs">{label}</span>
    </div>
  );
}

function EducationStats({ education }: { education: EducationItem[] }) {
  const stats = useMemo(() => {
    const months = totalMonths(education);
    const institutions = new Set(education.map((e) => e.institution.trim().toLowerCase()));
    const locations = new Set(
      education
        .map((e) => e.location?.trim().toLowerCase())
        .filter((l): l is string => Boolean(l))
    );
    return {
      years: Math.round((months / 12) * 10) / 10,
      institutions: institutions.size,
      qualifications: education.length,
      locations: locations.size,
    };
  }, [education]);

  return (
    <div
      role="group"
      aria-label="Education in numbers"
      className="grid grid-flow-col auto-cols-fr gap-2 sm:flex sm:gap-0 sm:divide-x sm:divide-border"
    >
      {stats.years > 0 && <Stat value={stats.years} decimals={1} suffix="+" label="Years of study" />}
      <Stat value={stats.qualifications} label="Qualifications" />
      <Stat value={stats.institutions} label="Institutions" />
      {stats.locations > 0 && <Stat value={stats.locations} label="Locations" />}
    </div>
  );
}

/**
 * Scroll-spy layout (no scroll-jacking), same as ExperienceSection:
 *  - The page scrolls normally. Every institution is a full entry in one long column.
 *  - The institution list stays in view (side rail on desktop, "you are here" bar on phones)
 *    and highlights whichever entry you are reading, scrolling down OR up.
 *  - Tapping an institution scrolls to it.
 *
 * A fixed/sticky site navbar is detected automatically so the header sits below it.
 * To set it by hand, pass stickyTop (e.g. stickyTop={64}).
 */
export function EducationSection({ education, stickyTop }: EducationSectionProps) {
  const safeEducation = useMemo(() => education || [], [education]);
  const count = safeEducation.length;

  const [active, setActive] = useState(0);
  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const [navOffset, setNavOffset] = useState(0);

  // Find a fixed/sticky site navbar at the top so our sticky header sits BELOW it
  useEffect(() => {
    if (stickyTop !== undefined) return;
    let frame = 0;

    const detect = () => {
      frame = 0;
      let offset = 0;
      document
        .querySelectorAll<HTMLElement>("header, nav, [role='banner']")
        .forEach((el) => {
          if (sectionRef.current?.contains(el)) return;
          const position = getComputedStyle(el).position;
          if (position !== "fixed" && position !== "sticky") return;
          const r = el.getBoundingClientRect();
          if (r.width < window.innerWidth * 0.5 || r.height <= 0) return;
          if (r.top > 8 || r.bottom <= 0) return;
          offset = Math.max(offset, Math.round(r.bottom));
        });
      setNavOffset(offset);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(detect);
    };

    detect();
    const late = window.setTimeout(detect, 600);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.clearTimeout(late);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stickyTop]);

  // Dev-only: a parent with overflow set silently breaks position: sticky
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let node = sectionRef.current?.parentElement;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (/(auto|hidden|scroll|clip)/.test(`${cs.overflowX} ${cs.overflowY}`)) {
        console.warn(
          "[EducationSection] A parent element has overflow set, so the sticky header cannot stick. Remove overflow from:",
          node
        );
        break;
      }
      node = node.parentElement;
    }
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  // Scroll position -> active entry
  useEffect(() => {
    if (!count) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = 0;
      for (let i = 0; i < count; i++) {
        const el = entryRefs.current[i];
        if (el && el.getBoundingClientRect().top <= line) current = i;
      }
      const last = entryRefs.current[count - 1];
      if (last && last.getBoundingClientRect().bottom <= window.innerHeight + 2) {
        current = count - 1;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  if (!count) return null;

  const goTo = (index: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    entryRefs.current[index]?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="education"
      ref={sectionRef}
      aria-label="Education and qualifications"
      style={
        {
          "--edu-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,
          "--edu-header-h": `${headerH}px`,
        } as React.CSSProperties
      }
      className="relative w-full border-t border-border bg-background/80 pb-10 sm:pb-14 lg:pb-16 selection:bg-primary/30"
    >
      {/* Title and numbers stay on top until the end of this section */}
      <div
        ref={headerRef}
        className="sticky top-[var(--edu-sticky-top,0px)] z-30 border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8 lg:py-5 2xl:max-w-[96rem]">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-5xl 2xl:text-6xl">
            Education
          </h2>
          <EducationStats education={safeEducation} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8 2xl:max-w-[96rem]">
        <p className="mb-6 max-w-xl text-sm text-muted-foreground leading-relaxed sm:mb-8">
          Formal engineering foundations spanning electronics, communication
          engineering, and industrial electrical systems.
        </p>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Institution list: sticky bar on phones, sticky side rail on desktop */}
          <aside
            className={cn(
              "sticky z-20 top-[calc(var(--edu-sticky-top,0px)+var(--edu-header-h,0px))]",
              "-mx-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--edu-sticky-top,0px)+var(--edu-header-h,0px)+1.5rem)] lg:col-span-4 lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
            )}
          >
            {/* Phone: one clear "you are here" bar */}
            <div className="py-2.5 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {safeEducation[active]?.period}
                  </p>
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {safeEducation[active]?.institution}
                  </p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>
                <button
                  type="button"
                  aria-label="Previous institution"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next institution"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex gap-1">
                {safeEducation.map((edu, index) => (
                  <button
                    key={edu.id}
                    type="button"
                    aria-label={`Go to ${edu.institution}`}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => goTo(index)}
                    className="group flex-1 py-2"
                  >
                    <span
                      className={cn(
                        "block h-1 rounded-full transition-colors",
                        index === active ? "bg-primary" : "bg-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <nav
              ref={navRef}
              aria-label="Institutions"
              className="relative hidden lg:flex lg:max-h-[calc(100svh-var(--edu-sticky-top,0px)-var(--edu-header-h,0px)-7rem)] lg:flex-col lg:overflow-y-auto"
            >
              {safeEducation.map((edu, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={edu.id}
                    ref={(el) => {
                      chipRefs.current[index] = el;
                    }}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(index)}
                    className={cn(
                      "group w-full shrink border-l-2 py-3.5 pl-5 pr-3 text-left transition-colors cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <span className="block truncate text-xs text-muted-foreground">
                      {edu.period}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-base font-semibold tracking-tight transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {edu.institution}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-sm",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {edu.degree}
                    </span>
                  </button>
                );
              })}
            </nav>
            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to move through qualifications.
            </p>
          </aside>

          {/* Entries: a normal scrolling column */}
          <div className="flex flex-col lg:col-span-8">
            {safeEducation.map((edu, index) => (
              <article
                key={edu.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "flex flex-col gap-5 border-b border-border py-8 last:border-b-0",
                  "scroll-mt-[calc(var(--edu-sticky-top,0px)+var(--edu-header-h,0px)+6rem)] lg:scroll-mt-[calc(var(--edu-sticky-top,0px)+var(--edu-header-h,0px)+1.5rem)]",
                  "lg:min-h-[50svh] lg:py-10 lg:transition-opacity lg:duration-300 motion-reduce:transition-none",
                  index === active ? "lg:opacity-100" : "lg:opacity-50"
                )}
              >
                <header className="flex flex-col gap-2.5">
                  <FieldLabel degree={edu.degree} institution={edu.institution} />
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:text-4xl">
                    {edu.institution}
                  </h3>
                  <p className="text-base font-medium text-primary sm:text-lg">{edu.degree}</p>
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{edu.period}</span>
                    {edu.location && <span>{edu.location}</span>}
                    {isCurrent(edu) && <CurrentTag />}
                  </p>
                </header>

                {edu.details && (
                  <div className="flex flex-col gap-2 border-t border-border pt-5">
                    <h4 className="text-sm font-semibold text-foreground">
                      Focus and coursework
                    </h4>
                    <p className="max-w-prose text-sm text-foreground/85 leading-relaxed sm:text-base">
                      {edu.details}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EducationSection;