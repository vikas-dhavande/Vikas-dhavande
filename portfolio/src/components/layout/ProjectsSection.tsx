
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  ArrowUpRight,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers3,
} from "lucide-react";

import { ProjectItem } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  stickyTop?: number | string;
}

export function ProjectsSection({
  projects,
  stickyTop,
}: ProjectsSectionProps) {
  const safeProjects = useMemo(
    () => projects || [],
    [projects]
  );

  const count = safeProjects.length;

  const [active, setActive] = useState(0);
  const [headerH, setHeaderH] = useState(0);
  const [navOffset, setNavOffset] = useState(0);

  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Project statistics
  const stats = useMemo(() => {
    const categories = new Set(
      safeProjects
        .map((project) => project.category)
        .filter(Boolean)
    );

    return {
      total: safeProjects.length,
      featured: safeProjects.filter(
        (project) => project.featured
      ).length,
      categories: categories.size,
      live: safeProjects.filter(
        (project) => project.liveUrl
      ).length,
    };
  }, [safeProjects]);

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

  // Navigate to project
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

  const currentProject = safeProjects[active];

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Featured projects and selected work"
      style={
        {
          "--project-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,

          "--project-header-h": `${headerH}px`,
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
          "sticky top-[var(--project-sticky-top,0px)]",
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
              Featured Projects
            </h2>
          </div>

          {/* Project Statistics */}

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
                label: "Projects",
              },
              {
                value: stats.featured,
                label: "Featured",
              },
              {
                value: stats.categories,
                label: "Categories",
              },
              {
                value: stats.live,
                label: "Live demos",
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
          Open-source libraries, web applications, and
          intelligent systems engineered with a focus on
          design, performance, and reliability.
        </p>

        <div
          className={cn(
            "flex flex-col gap-4",
            "lg:grid lg:grid-cols-12",
            "lg:gap-[clamp(2rem,4vw,4rem)]"
          )}
        >
          {/* ========================================
              PROJECT NAVIGATION
          ======================================== */}

          <aside
            className={cn(
              "sticky z-20",
              "top-[calc(var(--project-sticky-top,0px)+var(--project-header-h,0px))]",
              "-mx-4 border-b border-border",
              "bg-background/95 px-4 backdrop-blur-xl",
              "sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--project-sticky-top,0px)+var(--project-header-h,0px)+1.5rem)]",
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
                    Selected project
                  </p>

                  <p className="truncate text-sm font-semibold text-foreground">
                    {currentProject?.title}
                  </p>
                </div>

                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>

                <button
                  type="button"
                  aria-label="Previous project"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next project"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Progress indicator */}

              <div className="mt-1 flex gap-1">
                {safeProjects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    aria-label={`Go to ${project.title}`}
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
              aria-label="Project navigation"
              className={cn(
                "hidden lg:flex lg:flex-col",
                "lg:overflow-y-auto",
                "lg:max-h-[calc(100svh-var(--project-sticky-top,0px)-var(--project-header-h,0px)-4rem)]",
                "lg:overscroll-contain"
              )}
            >
              {safeProjects.map((project, index) => {
                const isActive = index === active;

                return (
                  <button
                    key={project.id}
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
                      {project.year} · PROJECT {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "mt-1 block text-sm font-semibold tracking-tight xl:text-base",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {project.title}
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 block text-xs",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {project.category}
                    </span>

                    {project.featured && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to explore projects.
            </p>
          </aside>

          {/* ========================================
              PROJECT ENTRIES
          ======================================== */}

          <div className="flex min-w-0 flex-col lg:col-span-8">
            {safeProjects.map((project, index) => (
              <article
                key={project.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "group flex min-w-0 flex-col",
                  "gap-[clamp(1.25rem,3vh,2rem)]",
                  "border-b border-border",
                  "py-[clamp(1.5rem,4vh,3.5rem)]",
                  "last:border-b-0",
                  "scroll-mt-[calc(var(--project-sticky-top,0px)+var(--project-header-h,0px)+5rem)]",
                  "lg:scroll-mt-[calc(var(--project-sticky-top,0px)+var(--project-header-h,0px)+1.5rem)]",
                  "lg:transition-opacity lg:duration-300",
                  "motion-reduce:transition-none",
                  index === active
                    ? "lg:opacity-100"
                    : "lg:opacity-50"
                )}
              >
                {/* Project Header */}

                <header className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono text-muted-foreground">
                    <span>{project.year}</span>

                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />

                    <span>{project.category}</span>

                    {project.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                        <Sparkles className="h-3 w-3" />
                        Featured Build
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={cn(
                        "min-w-0 font-bold tracking-tight",
                        "text-foreground",
                        "text-[clamp(1.5rem,2.5vw,2.75rem)]"
                      )}
                    >
                      {project.title}
                    </h3>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
                      <Layers3 className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="max-w-2xl text-base font-medium leading-relaxed text-foreground/90">
                    {project.tagline}
                  </p>

                  <p className="max-w-3xl text-[clamp(0.8rem,1vw,1rem)] leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </header>

                {/* Technology Tags */}

                {project.tags?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground">
                      TECHNOLOGIES & TOOLS
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "rounded-md border border-border",
                            "bg-secondary/70 px-2.5 py-1",
                            "font-mono text-xs text-muted-foreground",
                            "transition-colors hover:border-foreground/20",
                            "hover:text-foreground"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Actions */}

                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
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
                      <span>Live Demo</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2",
                        "rounded-full border border-border",
                        "bg-secondary/80 px-4 py-2",
                        "text-xs font-medium text-muted-foreground",
                        "transition-all",
                        "hover:border-foreground/30",
                        "hover:text-foreground"
                      )}
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      <span>Code Repository</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}

                  {!project.liveUrl && !project.githubUrl && (
                    <span className="text-xs text-muted-foreground">
                      Project details available on request.
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

export default ProjectsSection;
