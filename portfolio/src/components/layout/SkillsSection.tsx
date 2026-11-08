
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Sparkles,
} from "lucide-react";

import { SkillCategory } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  categories: SkillCategory[];
  stickyTop?: number | string;
}

export function SkillsSection({
  categories,
  stickyTop,
}: SkillsSectionProps) {
  const safeCategories = useMemo(
    () => categories || [],
    [categories]
  );

  const count = safeCategories.length;

  const [active, setActive] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [navOffset, setNavOffset] = useState(0);

  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Statistics
  const stats = useMemo(() => {
    const skills = safeCategories.flatMap(
      (category) => category.skills || []
    );

    return {
      total: skills.length,
      categories: safeCategories.length,
      core: skills.filter((skill) => skill.highlight).length,
      areas: safeCategories.filter(
        (category) => category.skills?.length > 0
      ).length,
    };
  }, [safeCategories]);

  // Detect fixed navbar height
  useEffect(() => {
    if (stickyTop !== undefined) return;

    let frame = 0;

    const detect = () => {
      frame = 0;
      let offset = 0;

      document
        .querySelectorAll<HTMLElement>(
          "header, nav, [role='banner']"
        )
        .forEach((el) => {
          if (sectionRef.current?.contains(el)) return;

          const position = getComputedStyle(el).position;

          if (
            position !== "fixed" &&
            position !== "sticky"
          ) {
            return;
          }

          const rect = el.getBoundingClientRect();

          if (
            rect.width < window.innerWidth * 0.5 ||
            rect.height <= 0 ||
            rect.top > 8 ||
            rect.bottom <= 0
          ) {
            return;
          }

          offset = Math.max(
            offset,
            Math.round(rect.bottom)
          );
        });

      setNavOffset(offset);
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(detect);
      }
    };

    detect();

    const late = window.setTimeout(detect, 600);

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, {
      passive: true,
    });

    return () => {
      window.clearTimeout(late);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);

      if (frame) cancelAnimationFrame(frame);
    };
  }, [stickyTop]);

  // Measure sticky header
  useEffect(() => {
    const el = headerRef.current;

    if (!el) return;

    const measure = () => {
      setHeaderH(el.offsetHeight);
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(el);

    return () => observer.disconnect();
  }, [count]);

  // Scroll spy
  useEffect(() => {
    if (!count) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const line = window.innerHeight * 0.4;
      let current = 0;

      for (let i = 0; i < count; i++) {
        const element = entryRefs.current[i];

        if (
          element &&
          element.getBoundingClientRect().top <= line
        ) {
          current = i;
        }
      }

      const last = entryRefs.current[count - 1];

      if (
        last &&
        last.getBoundingClientRect().bottom <=
        window.innerHeight + 2
      ) {
        current = count - 1;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  // Scroll to category
  const goTo = (index: number) => {
    if (index < 0 || index >= count) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    entryRefs.current[index]?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });

    setActive(index);
  };

  if (!count) return null;

  const currentCategory = safeCategories[active];

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-label="Technical skills and competencies"
      style={
        {
          "--skill-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,

          "--skill-header-h": `${headerH}px`,
        } as React.CSSProperties
      }
      className={cn(
        "relative w-full min-h-screen",
        "border-t border-border",
        "bg-background/80",
        "pb-[clamp(1.5rem,4vh,4rem)]"
      )}
    >
      {/* ========================================
          STICKY HEADER
      ======================================== */}

      <div
        ref={headerRef}
        className={cn(
          "sticky top-[var(--skill-sticky-top,0px)]",
          "z-30 border-b border-border",
          "bg-background/95 backdrop-blur-xl"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1600px]",
            "flex-col gap-4",
            "px-[clamp(1rem,3vw,3rem)]",
            "py-[clamp(0.75rem,2vh,1.5rem)]",
            "xl:flex-row xl:items-center",
            "xl:justify-between"
          )}
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />

              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                TECHNICAL COMPETENCIES
              </span>
            </div>

            <h2
              className={cn(
                "font-bold tracking-tight text-foreground",
                "text-[clamp(1.5rem,3vw,3rem)]"
              )}
            >
              Skills & Capabilities
            </h2>
          </div>

          {/* Statistics */}
          <div
            className={cn(
              "grid grid-cols-4 gap-2",
              "sm:flex sm:gap-0 sm:divide-x",
              "sm:divide-border"
            )}
          >
            {[
              {
                value: stats.total,
                label: "Skills",
              },
              {
                value: stats.categories,
                label: "Categories",
              },
              {
                value: stats.core,
                label: "Core skills",
              },
              {
                value: stats.areas,
                label: "Active areas",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col sm:px-4 sm:first:pl-0"
              >
                <span className="text-xl font-bold tabular-nums text-foreground sm:text-2xl lg:text-3xl">
                  {stat.value}
                </span>

                <span className="truncate text-[10px] text-muted-foreground sm:text-xs">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div
        className={cn(
          "mx-auto w-full max-w-[1600px]",
          "px-[clamp(1rem,3vw,3rem)]",
          "pt-[clamp(1.25rem,3vh,2.5rem)]"
        )}
      >
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mb-8">
          Technical expertise across electronics product
          development, NPI, BOM engineering, manufacturing
          systems, software, and emerging technologies.
        </p>

        <div
          className={cn(
            "flex flex-col gap-4",
            "lg:grid lg:grid-cols-12",
            "lg:gap-[clamp(2rem,4vw,4rem)]"
          )}
        >
          {/* ========================================
              CATEGORY NAVIGATION
          ======================================== */}

          <aside
            className={cn(
              "sticky z-20",
              "top-[calc(var(--skill-sticky-top,0px)+var(--skill-header-h,0px))]",
              "-mx-4 border-b border-border",
              "bg-background/95 px-4 backdrop-blur-xl",
              "sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--skill-sticky-top,0px)+var(--skill-header-h,0px)+1.5rem)]",
              "lg:col-span-4 lg:mx-0 lg:self-start",
              "lg:border-b-0 lg:bg-transparent",
              "lg:px-0 lg:backdrop-blur-none"
            )}
          >
            {/* Mobile and tablet navigation */}

            <div className="py-2.5 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    Technical category
                  </p>

                  <p className="truncate text-sm font-semibold text-foreground">
                    {currentCategory?.category}
                  </p>
                </div>

                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>

                <button
                  type="button"
                  aria-label="Previous category"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next category"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Progress indicator */}

              <div className="mt-1 flex gap-1">
                {safeCategories.map((cat, index) => (
                  <button
                    key={cat.id}
                    type="button"
                    aria-label={`Go to ${cat.category}`}
                    aria-current={
                      index === active ? "true" : undefined
                    }
                    onClick={() => goTo(index)}
                    className="group flex-1 py-2"
                  >
                    <span
                      className={cn(
                        "block h-1 rounded-full transition-colors duration-300",
                        index === active
                          ? "bg-primary"
                          : "bg-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop sidebar navigation */}

            <nav
              aria-label="Skill categories"
              className={cn(
                "hidden lg:flex lg:flex-col",
                "lg:overflow-y-auto",
                "lg:max-h-[calc(100svh-var(--skill-sticky-top,0px)-var(--skill-header-h,0px)-4rem)]",
                "lg:overscroll-contain"
              )}
            >
              {safeCategories.map((cat, index) => {
                const isActive = index === active;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-current={
                      isActive ? "true" : undefined
                    }
                    onClick={() => goTo(index)}
                    className={cn(
                      "group w-full shrink-0",
                      "border-l-2 py-[clamp(0.65rem,1.5vh,1.1rem)]",
                      "pl-5 pr-3 text-left",
                      "transition-colors duration-200",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <span className="block text-xs text-muted-foreground">
                      CATEGORY {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "mt-1 block text-sm font-semibold tracking-tight xl:text-base",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {cat.category}
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 block text-xs",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {cat.skills.length} skills
                    </span>
                  </button>
                );
              })}
            </nav>

            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to explore.
            </p>
          </aside>

          {/* ========================================
              SKILL CONTENT
          ======================================== */}

          <div className="flex min-w-0 flex-col lg:col-span-8">
            {safeCategories.map((cat, index) => (
              <article
                key={cat.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "flex min-w-0 flex-col",
                  "gap-[clamp(1.25rem,3vh,2rem)]",
                  "border-b border-border py-[clamp(1.5rem,4vh,3.5rem)]",
                  "last:border-b-0",
                  "scroll-mt-[calc(var(--skill-sticky-top,0px)+var(--skill-header-h,0px)+5rem)]",
                  "lg:scroll-mt-[calc(var(--skill-sticky-top,0px)+var(--skill-header-h,0px)+1.5rem)]",
                  "lg:transition-opacity lg:duration-300",
                  "motion-reduce:transition-none",
                  index === active
                    ? "lg:opacity-100"
                    : "lg:opacity-50"
                )}
              >
                {/* Category heading */}

                <header className="flex flex-col gap-3">
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                    Technical competency
                  </span>

                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={cn(
                        "min-w-0 font-bold tracking-tight",
                        "text-foreground",
                        "text-[clamp(1.5rem,2.5vw,2.75rem)]"
                      )}
                    >
                      {cat.category}
                    </h3>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>

                  {cat.description && (
                    <p className="max-w-2xl text-[clamp(0.8rem,1vw,1rem)] leading-relaxed text-muted-foreground">
                      {cat.description}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {cat.skills.length} skills and technologies
                  </p>
                </header>

                {/* Skills list */}

                <div className="flex flex-col border-t border-border pt-2">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={cn(
                        "group flex items-center justify-between",
                        "gap-4 rounded-lg px-2",
                        "py-[clamp(0.7rem,1.5vh,1rem)]",
                        "border-b border-border/60",
                        "transition-colors duration-200",
                        "hover:bg-muted/40 last:border-b-0"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {skill.highlight ? (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#E11D48]" />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50 transition-colors group-hover:bg-foreground" />
                        )}

                        <span
                          className={cn(
                            "text-sm tracking-tight transition-colors sm:text-base",
                            skill.highlight
                              ? "font-semibold text-foreground"
                              : "text-foreground/90 group-hover:text-foreground"
                          )}
                        >
                          {skill.name}
                        </span>
                      </div>

                      {skill.level && (
                        <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground sm:text-xs">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
