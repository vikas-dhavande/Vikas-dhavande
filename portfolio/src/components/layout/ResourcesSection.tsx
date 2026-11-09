
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  ArrowUpRight,
  BookOpen,
  Download,
  FileCode,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ResourceItem } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface ResourcesSectionProps {
  resources: ResourceItem[];
  stickyTop?: number | string;
}

export function ResourcesSection({
  resources,
  stickyTop,
}: ResourcesSectionProps) {
  const safeResources = useMemo(
    () => resources || [],
    [resources]
  );

  const count = safeResources.length;

  const [active, setActive] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [navOffset, setNavOffset] = useState(0);

  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Resource icon
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "template":
        return (
          <FileCode className="h-5 w-5 text-[#3B82F6]" />
        );

      case "cheatsheet":
        return (
          <Download className="h-5 w-5 text-[#10B981]" />
        );

      case "architecture":
        return (
          <BookOpen className="h-5 w-5 text-[#F59E0B]" />
        );

      default:
        return (
          <FileText className="h-5 w-5 text-[#E11D48]" />
        );
    }
  };

  // Resource statistics
  const stats = useMemo(() => {
    const types = new Set(
      safeResources.map((res) => res.type.toLowerCase())
    );

    return {
      total: safeResources.length,
      types: types.size,
      templates: safeResources.filter(
        (res) => res.type.toLowerCase() === "template"
      ).length,
      accessible: safeResources.filter(
        (res) => Boolean(res.url)
      ).length,
    };
  }, [safeResources]);

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

  // Navigate to resource
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

  const currentResource = safeResources[active];

  return (
    <section
      id="resources"
      ref={sectionRef}
      aria-label="Developer resources and documentation"
      style={
        {
          "--resource-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,

          "--resource-header-h": `${headerH}px`,
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
          "sticky top-[var(--resource-sticky-top,0px)]",
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
            <h2
              className={cn(
                "font-bold tracking-tight text-foreground",
                "text-[clamp(1.5rem,3vw,3rem)]"
              )}
            >
              Curated Resources
            </h2>
          </div>

          {/* Resource Statistics */}

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
                label: "Resources",
              },
              {
                value: stats.types,
                label: "Types",
              },
              {
                value: stats.templates,
                label: "Templates",
              },
              {
                value: stats.accessible,
                label: "Accessible",
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
          Starters, architectural blueprints, cheatsheets,
          technical documentation, and engineering
          resources shared for developers and teams.
        </p>

        <div
          className={cn(
            "flex flex-col gap-4",
            "lg:grid lg:grid-cols-12",
            "lg:gap-[clamp(2rem,4vw,4rem)]"
          )}
        >
          {/* ========================================
              RESOURCE NAVIGATION
          ======================================== */}

          <aside
            className={cn(
              "sticky z-20",
              "top-[calc(var(--resource-sticky-top,0px)+var(--resource-header-h,0px))]",
              "-mx-4 border-b border-border",
              "bg-background/95 px-4 backdrop-blur-xl",
              "sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--resource-sticky-top,0px)+var(--resource-header-h,0px)+1.5rem)]",
              "lg:col-span-4 lg:mx-0 lg:self-start",
              "lg:border-b-0 lg:bg-transparent",
              "lg:px-0 lg:backdrop-blur-none"
            )}
          >
            {/* Mobile Navigation */}

            <div className="py-2.5 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    Selected resource
                  </p>

                  <p className="truncate text-sm font-semibold text-foreground">
                    {currentResource?.title}
                  </p>
                </div>

                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>

                <button
                  type="button"
                  aria-label="Previous resource"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next resource"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Indicator */}

              <div className="mt-1 flex gap-1">
                {safeResources.map((res, index) => (
                  <button
                    key={res.id}
                    type="button"
                    aria-label={`Go to ${res.title}`}
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

            {/* Desktop Navigation */}

            <nav
              aria-label="Resource navigation"
              className={cn(
                "hidden lg:flex lg:flex-col",
                "lg:overflow-y-auto",
                "lg:max-h-[calc(100svh-var(--resource-sticky-top,0px)-var(--resource-header-h,0px)-4rem)]",
                "lg:overscroll-contain"
              )}
            >
              {safeResources.map((res, index) => {
                const isActive = index === active;

                return (
                  <button
                    key={res.id}
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
                      RESOURCE {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "mt-1 block text-sm font-semibold tracking-tight xl:text-base",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {res.title}
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 block text-xs capitalize",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {res.type}
                    </span>

                    {res.tag && (
                      <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                        {res.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to explore resources.
            </p>
          </aside>

          {/* ========================================
              RESOURCE ENTRIES
          ======================================== */}

          <div className="flex min-w-0 flex-col lg:col-span-8">
            {safeResources.map((res, index) => (
              <article
                key={res.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "group flex min-w-0 flex-col",
                  "gap-[clamp(1.25rem,3vh,2rem)]",
                  "border-b border-border",
                  "py-[clamp(1.5rem,4vh,3.5rem)]",
                  "last:border-b-0",
                  "scroll-mt-[calc(var(--resource-sticky-top,0px)+var(--resource-header-h,0px)+5rem)]",
                  "lg:scroll-mt-[calc(var(--resource-sticky-top,0px)+var(--resource-header-h,0px)+1.5rem)]",
                  "lg:transition-opacity lg:duration-300",
                  "motion-reduce:transition-none",
                  index === active
                    ? "lg:opacity-100"
                    : "lg:opacity-50"
                )}
              >
                {/* Resource Header */}

                <header className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                      Developer resource
                    </span>

                    <span className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-mono capitalize text-muted-foreground">
                      {res.type}
                    </span>

                    {res.tag && (
                      <span className="text-xs text-muted-foreground">
                        {res.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
                      {getResourceIcon(res.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "font-bold tracking-tight",
                          "text-foreground",
                          "text-[clamp(1.4rem,2.5vw,2.5rem)]"
                        )}
                      >
                        {res.title}
                      </h3>

                      {res.formatBadge && (
                        <span className="mt-2 inline-flex rounded-md border border-border bg-secondary/60 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                          {res.formatBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="max-w-3xl text-[clamp(0.8rem,1vw,1rem)] leading-relaxed text-muted-foreground">
                    {res.description}
                  </p>
                </header>

                {/* Resource Action */}

                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2",
                        "rounded-full border border-border",
                        "bg-primary px-4 py-2",
                        "text-xs font-semibold text-primary-foreground",
                        "shadow-sm transition-all",
                        "hover:opacity-90"
                      )}
                    >
                      <span>Access Resource</span>

                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Resource link currently unavailable.
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResourcesSection;
