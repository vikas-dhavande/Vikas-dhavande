"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ExperienceItem } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  /** Height of your fixed navbar in px (or any CSS length). Auto-detected when omitted. */
  stickyTop?: number | string;
}

const isCurrent = (exp: ExperienceItem) =>
  Boolean(exp.isCurrent) || exp.period.toLowerCase().includes("present");

// Domain label per company/role. Text only, with a colored dot as the accent.
const getDomainInfo = (company: string, role: string) => {
  const text = `${company} ${role}`.toLowerCase();
  if (text.includes("foxconn"))
    return { label: "Aerospace and national defense avionics", dot: "bg-rose-400" };
  if (text.includes("iisc") || text.includes("science"))
    return { label: "Scientific aerospace R&D", dot: "bg-amber-400" };
  if (text.includes("bosch") && text.includes("lead"))
    return { label: "Automotive ECUs and high-voltage power systems", dot: "bg-blue-400" };
  if (text.includes("bosch"))
    return { label: "NPI engineering change and industrial SAP trials", dot: "bg-violet-400" };
  if (text.includes("wistron"))
    return { label: "High-speed SMT and main logic board manufacturing", dot: "bg-emerald-400" };
  return { label: "Electronic systems and product engineering", dot: "bg-zinc-400" };
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
      Currently working here
    </span>
  );
}

function DomainLabel({ company, role }: { company: string; role: string }) {
  const domain = getDomainInfo(company, role);
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", domain.dot)} />
      {domain.label}
    </span>
  );
}

function Highlights({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((highlight, idx) => (
        <li
          key={idx}
          className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed"
        >
          <span className="mt-2 h-px w-3 bg-primary shrink-0" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  );
}

function Technologies({ items }: { items: string[] }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {items.join(", ")}
    </p>
  );
}

// ─── Experience in numbers ────────────────────────────────────────────────

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Turns "Jan 2020 - Present" or "2019 – 2021" into [startMonth, endMonth] (absolute month index)
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

// Total months worked, merging overlaps so parallel roles are not double counted
function totalMonths(experiences: ExperienceItem[]): number {
  const ranges = experiences
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

function ExperienceStats({ experiences }: { experiences: ExperienceItem[] }) {
  const stats = useMemo(() => {
    const months = totalMonths(experiences);
    const companies = new Set(experiences.map((e) => e.company.trim().toLowerCase()));
    const tech = new Set(
      experiences.flatMap((e) => e.technologies || []).map((t) => t.trim().toLowerCase())
    );
    const deliverables = experiences.reduce((n, e) => n + (e.highlights?.length || 0), 0);
    return {
      years: Math.round((months / 12) * 10) / 10,
      companies: companies.size,
      roles: experiences.length,
      tech: tech.size,
      deliverables,
    };
  }, [experiences]);

  return (
    <div
      role="group"
      aria-label="Experience in numbers"
      className="grid grid-flow-col auto-cols-fr gap-2 sm:flex sm:gap-0 sm:divide-x sm:divide-border"
    >
      {stats.years > 0 && <Stat value={stats.years} decimals={1} suffix="+" label="Years" />}
      <Stat value={stats.companies} label="Companies" />
      <Stat value={stats.roles} label="Roles" />
      <Stat value={stats.tech} label="Technologies" />
      {stats.deliverables > 0 && <Stat value={stats.deliverables} label="Deliverables" />}
    </div>
  );
}

/**
 * Scroll-spy layout (no scroll-jacking):
 *  - The page scrolls normally. Every company is a full entry in one long column.
 *  - The company list stays in view (side rail on desktop, swipe strip on phones)
 *    and highlights whichever company you are reading, scrolling down OR up.
 *  - Tapping a company scrolls to it.
 *
 * A fixed/sticky site navbar is detected automatically so the header sits below it.
 * To set it by hand, pass stickyTop (e.g. stickyTop={64}).
 */
export function ExperienceSection({ experiences, stickyTop }: ExperienceSectionProps) {
  const safeExperiences = useMemo(() => experiences || [], [experiences]);
  const count = safeExperiences.length;

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
          "[ExperienceSection] A parent element has overflow set, so the sticky header cannot stick. Remove overflow from:",
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

  // Scroll position -> active company
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

  // Phones: keep the active chip centred in the swipe strip
  useEffect(() => {
    const nav = navRef.current;
    const chip = chipRefs.current[active];
    if (!nav || !chip || nav.scrollWidth <= nav.clientWidth) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nav.scrollTo({
      left: chip.offsetLeft - (nav.clientWidth - chip.clientWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active]);

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
      id="experience"
      ref={sectionRef}
      aria-label="Work experience and career history"
      style={
        {
          "--exp-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,
          "--exp-header-h": `${headerH}px`,
        } as React.CSSProperties
      }
      className="relative w-full border-t border-border bg-background/80 pb-10 sm:pb-14 lg:pb-16 selection:bg-primary/30"
    >
      {/* Title and numbers stay on top until the end of this section */}
      <div
        ref={headerRef}
        className="sticky top-[var(--exp-sticky-top,0px)] z-30 border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8 lg:py-5 2xl:max-w-[96rem]">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-5xl 2xl:text-6xl">
            Experience
          </h2>
          <ExperienceStats experiences={safeExperiences} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8 2xl:max-w-[96rem]">
        <p className="mb-6 max-w-xl text-sm text-muted-foreground leading-relaxed sm:mb-8">
          Engineering roles and avionics systems built across aerospace,
          defense, and automotive industries.
        </p>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Company list: sticky strip on phones, sticky side rail on desktop */}
          <aside
            className={cn(
              "sticky z-20 top-[calc(var(--exp-sticky-top,0px)+var(--exp-header-h,0px))]",
              "-mx-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--exp-sticky-top,0px)+var(--exp-header-h,0px)+1.5rem)] lg:col-span-4 lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
            )}
          >
            {/* Phone: one clear "you are here" bar, no scrollbar, no cut-off names */}
            <div className="py-2.5 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {safeExperiences[active]?.period}
                  </p>
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {safeExperiences[active]?.company}
                  </p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>
                <button
                  type="button"
                  aria-label="Previous company"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next company"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex gap-1">
                {safeExperiences.map((exp, index) => (
                  <button
                    key={exp.id}
                    type="button"
                    aria-label={`Go to ${exp.company}`}
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
              aria-label="Companies"
              className="relative hidden lg:flex lg:max-h-[calc(100svh-var(--exp-sticky-top,0px)-var(--exp-header-h,0px)-7rem)] lg:flex-col lg:overflow-y-auto"
            >
              {safeExperiences.map((exp, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={exp.id}
                    ref={(el) => {
                      chipRefs.current[index] = el;
                    }}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(index)}
                    className={cn(
                      "group w-[10.5rem] shrink-0 border-b-2 py-3 pr-3 text-left transition-colors cursor-pointer sm:w-[14rem]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      "lg:w-full lg:shrink lg:border-b-0 lg:border-l-2 lg:py-3.5 lg:pl-5",
                      isActive
                        ? "border-primary"
                        : "border-transparent lg:border-border lg:hover:border-muted-foreground"
                    )}
                  >
                    <span className="block truncate text-xs text-muted-foreground">
                      {exp.period}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-sm font-semibold tracking-tight transition-colors lg:text-base",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {exp.company}
                    </span>
                    <span
                      className={cn(
                        "hidden truncate text-sm lg:block",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {exp.role}
                    </span>
                  </button>
                );
              })}
            </nav>
            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to move through companies.
            </p>
          </aside>

          {/* Entries: a normal scrolling column */}
          <div className="flex flex-col lg:col-span-8">
            {safeExperiences.map((exp, index) => (
              <article
                key={exp.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "flex flex-col gap-5 border-b border-border py-8 last:border-b-0",
                  "scroll-mt-[calc(var(--exp-sticky-top,0px)+var(--exp-header-h,0px)+6rem)] lg:scroll-mt-[calc(var(--exp-sticky-top,0px)+var(--exp-header-h,0px)+1.5rem)]",
                  "lg:min-h-[70svh] lg:py-10 lg:transition-opacity lg:duration-300 motion-reduce:transition-none",
                  index === active ? "lg:opacity-100" : "lg:opacity-50"
                )}
              >
                <header className="flex flex-col gap-2.5">
                  <DomainLabel company={exp.company} role={exp.role} />
                  <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:text-4xl">
                    {exp.company}
                    {exp.link && (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visit ${exp.company}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </a>
                    )}
                  </h3>
                  <p className="text-base font-medium text-primary sm:text-lg">{exp.role}</p>
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{exp.period}</span>
                    {exp.location && <span>{exp.location}</span>}
                    {exp.type && <span>{exp.type}</span>}
                    {isCurrent(exp) && <CurrentTag />}
                  </p>
                </header>

                <p className="max-w-prose text-sm text-foreground/85 leading-relaxed sm:text-base">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Key deliverables and technical impact
                    </h4>
                    <Highlights items={exp.highlights} />
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-border pt-5">
                  <h4 className="text-sm font-semibold text-foreground">
                    Technologies and systems
                  </h4>
                  <Technologies items={exp.technologies} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;