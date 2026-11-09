"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  ShieldCheck,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react";
import { CertificateItem } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

interface CertificatesSectionProps {
  certificates?: CertificateItem[];
  /** Height of your fixed navbar in px (or any CSS length). Auto-detected when omitted. */
  stickyTop?: number | string;
}

const isCurrent = (cert: CertificateItem) =>
  cert.isCurrent ?? /present|active|ongoing|current/i.test(cert.period);

// Domain badge color and label per category
const getDomainBadge = (category?: string, type?: string) => {
  const cat = (category || "").toLowerCase();

  if (cat.includes("aerospace") || cat.includes("avionics")) {
    return { label: category || "Avionics & Aerospace", dot: "bg-rose-400" };
  }
  if (cat.includes("industrial") || cat.includes("ipc")) {
    return { label: category || "Industrial Standards", dot: "bg-blue-400" };
  }
  if (cat.includes("embedded") || cat.includes("labview")) {
    return { label: category || "Embedded Systems", dot: "bg-emerald-400" };
  }
  if (cat.includes("automotive") || cat.includes("quality")) {
    return { label: category || "Automotive & Quality", dot: "bg-violet-400" };
  }
  if (cat.includes("electrical") || cat.includes("safety") || type === "License") {
    return { label: category || "Electrical & Safety", dot: "bg-amber-400" };
  }

  return { label: category || "Technical Credential", dot: "bg-zinc-400" };
};

function ActiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Active & Verified
    </span>
  );
}

function DomainLabel({ category, type }: { category?: string; type?: string }) {
  const badge = getDomainBadge(category, type);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
      {badge.label}
    </span>
  );
}

// ─── Animated statistics ───────────────────────────────────────────────────

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

      <span className="mt-0.5 truncate text-[10px] text-muted-foreground sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function CertificatesStats({ certificates }: { certificates: CertificateItem[] }) {
  const stats = useMemo(() => {
    const issuers = new Set(
      certificates.map((c) => c.issuer.trim().toLowerCase())
    );
    const domains = new Set(
      certificates
        .map((c) => c.category?.trim().toLowerCase())
        .filter((d): d is string => Boolean(d))
    );
    const licenses = certificates.filter(
      (c) => c.type === "License"
    ).length;

    return {
      total: certificates.length,
      issuers: issuers.size,
      domains: domains.size,
      licenses,
    };
  }, [certificates]);

  return (
    <div
      role="group"
      aria-label="Certifications and licenses statistics"
      className="grid grid-flow-col auto-cols-fr gap-2 sm:flex sm:gap-0 sm:divide-x sm:divide-border"
    >
      <Stat value={stats.total} label="Credentials" />
      <Stat value={stats.issuers} label="Issuing Bodies" />
      <Stat value={stats.domains} label="Domains" />
      {stats.licenses > 0 && (
        <Stat value={stats.licenses} label="Statutory Licenses" />
      )}
    </div>
  );
}

/**
 * Copyable Credential ID Pill
 */
function CredentialIdPill({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy Credential ID"
      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 font-mono text-xs text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
    >
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">
        ID:
      </span>
      <span>{id}</span>
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

export function CertificatesSection({
  certificates = [],
  stickyTop,
}: CertificatesSectionProps) {
  const safeCertificates = useMemo(
    () => certificates || [],
    [certificates]
  );
  const count = safeCertificates.length;

  const [active, setActive] = useState(0);

  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [headerH, setHeaderH] = useState(0);
  const [navOffset, setNavOffset] = useState(0);

  // Auto-detect sticky navbar offset so our sticky header sits below it
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

  // Measure header height for accurate scroll offsets
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => setHeaderH(el.offsetHeight);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [count]);

  // Scroll spy: link scroll position to active certificate
  useEffect(() => {
    if (!count) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = 0;

      for (let i = 0; i < count; i++) {
        const el = entryRefs.current[i];
        if (el && el.getBoundingClientRect().top <= line) {
          current = i;
        }
      }

      const last = entryRefs.current[count - 1];
      if (
        last &&
        last.getBoundingClientRect().bottom <= window.innerHeight + 2
      ) {
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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    entryRefs.current[index]?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="certificates"
      ref={sectionRef}
      aria-label="Professional certifications and licenses"
      style={
        {
          "--cert-sticky-top":
            stickyTop !== undefined
              ? typeof stickyTop === "number"
                ? `${stickyTop}px`
                : stickyTop
              : `${navOffset}px`,
          "--cert-header-h": `${headerH}px`,
        } as React.CSSProperties
      }
      className="relative w-full border-t border-border bg-background/80 pb-10 sm:pb-14 lg:pb-16 selection:bg-primary/30"
    >
      {/* ========================================
          STICKY HEADER
      ======================================== */}
      <div
        ref={headerRef}
        className="sticky top-[var(--cert-sticky-top,0px)] z-30 border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8 lg:py-5 2xl:max-w-[96rem]">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-5xl 2xl:text-6xl">
            Certificates & Licenses
          </h2>

          <CertificatesStats certificates={safeCertificates} />
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8 2xl:max-w-[96rem]">
        <p className="mb-6 max-w-xl text-sm text-muted-foreground leading-relaxed sm:mb-8">
          Industry-standard accreditations, aerospace & automotive standards, and
          government statutory licenses validating mission-critical engineering
          competencies.
        </p>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* ========================================
              SIDEBAR NAVIGATION (STICKY RAIL)
          ======================================== */}
          <aside
            className={cn(
              "sticky z-20 top-[calc(var(--cert-sticky-top,0px)+var(--cert-header-h,0px))]",
              "-mx-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:-mx-6 sm:px-6",
              "lg:top-[calc(var(--cert-sticky-top,0px)+var(--cert-header-h,0px)+1.5rem)] lg:col-span-4 lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
            )}
          >
            {/* Mobile / Tablet "You Are Here" bar */}
            <div className="py-2.5 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {safeCertificates[active]?.period}
                  </p>

                  <p className="text-sm font-semibold leading-snug text-foreground truncate">
                    {safeCertificates[active]?.title}
                  </p>
                </div>

                <span className="text-xs tabular-nums text-muted-foreground">
                  {active + 1}/{count}
                </span>

                <button
                  type="button"
                  aria-label="Previous credential"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next credential"
                  disabled={active === count - 1}
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-opacity disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-1 flex gap-1">
                {safeCertificates.map((cert, index) => (
                  <button
                    key={cert.id}
                    type="button"
                    aria-label={`Go to ${cert.title}`}
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

            {/* Desktop Side Rail Navigation */}
            <nav
              ref={navRef}
              aria-label="Credentials list"
              className="relative hidden lg:flex lg:max-h-[calc(100svh-var(--cert-sticky-top,0px)-var(--cert-header-h,0px)-7rem)] lg:flex-col lg:overflow-y-auto"
            >
              {safeCertificates.map((cert, index) => {
                const isActive = index === active;

                return (
                  <button
                    key={cert.id}
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
                      {cert.period}
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 block truncate text-base font-semibold tracking-tight transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {cert.title}
                    </span>

                    <span
                      className={cn(
                        "block truncate text-sm",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {cert.issuer}
                    </span>
                  </button>
                );
              })}
            </nav>

            <p className="mt-4 hidden text-xs text-muted-foreground lg:block">
              {active + 1} of {count}. Scroll to explore credentials.
            </p>
          </aside>

          {/* ========================================
              CREDENTIAL ENTRIES
          ======================================== */}
          <div className="flex flex-col lg:col-span-8">
            {safeCertificates.map((cert, index) => (
              <article
                key={cert.id}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                className={cn(
                  "flex flex-col gap-5 border-b border-border py-8 last:border-b-0",
                  "scroll-mt-[calc(var(--cert-sticky-top,0px)+var(--cert-header-h,0px)+6rem)] lg:scroll-mt-[calc(var(--cert-sticky-top,0px)+var(--cert-header-h,0px)+1.5rem)]",
                  "lg:min-h-[50svh] lg:py-10 lg:transition-opacity lg:duration-300 motion-reduce:transition-none",
                  index === active ? "lg:opacity-100" : "lg:opacity-50"
                )}
              >
                <header className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <DomainLabel
                      category={cert.category}
                      type={cert.type}
                    />

                    {cert.type && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
                        <Award className="h-3 w-3 text-primary" />
                        {cert.type}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:text-4xl">
                    {cert.title}
                  </h3>

                  <p className="text-base font-medium text-primary sm:text-lg">
                    {cert.issuer}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
                    <span>{cert.period}</span>

                    {cert.credentialId && (
                      <CredentialIdPill id={cert.credentialId} />
                    )}

                    {isCurrent(cert) && <ActiveBadge />}
                  </div>
                </header>

                {/* Details & Competencies */}
                {cert.details && (
                  <div className="flex flex-col gap-2 border-t border-border pt-5">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Scope &amp; verified competencies
                    </h4>

                    <p className="max-w-prose text-sm text-foreground/85 leading-relaxed sm:text-base">
                      {cert.details}
                    </p>
                  </div>
                )}

                {/* Associated Technologies & Skills */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-mono text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Verification link */}
                {cert.verificationUrl && (
                  <div className="pt-2">
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors"
                    >
                      <span>Verify credential on official portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
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

export default CertificatesSection;

