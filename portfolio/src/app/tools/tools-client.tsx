"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Search,
  ExternalLink,
  Cpu,
  Activity,
  Layers,
  Database,
  Terminal,
  Calculator,
  BookOpen,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import {
  ENGINEERING_TOOLS,
  TOOLS_CATEGORIES,
  ToolCategory,
  EngineeringTool,
} from "@/data/tools-data";
import portfolioData from "@/data/portfolio-data.json";

function getIcon(type: EngineeringTool["iconType"]) {
  switch (type) {
    case "cpu":
      return <Cpu className="w-4 h-4 text-emerald-500" />;
    case "activity":
      return <Activity className="w-4 h-4 text-blue-500" />;
    case "circuit":
      return <Layers className="w-4 h-4 text-amber-500" />;
    case "database":
      return <Database className="w-4 h-4 text-purple-500" />;
    case "terminal":
      return <Terminal className="w-4 h-4 text-rose-500" />;
    default:
      return <Wrench className="w-4 h-4 text-primary" />;
  }
}

export function ToolsClient() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // CAN Bus Bitrate Calculator State
  const [clockMhz, setClockMhz] = useState<number>(48);
  const [prescaler, setPrescaler] = useState<number>(6);
  const [tseg1, setTseg1] = useState<number>(13);
  const [tseg2, setTseg2] = useState<number>(2);

  // Smooth scroll support for hash anchors (#resources, #social, #calculator)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    return ENGINEERING_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q)) ||
        tool.roleUsed.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // CAN timing calculation
  // Total Time Quanta = 1 (SYNC_SEG) + TSEG1 + TSEG2
  const totalTq = 1 + Number(tseg1) + Number(tseg2);
  const tqTimeNs = (Number(prescaler) / (Number(clockMhz) * 1e6)) * 1e9;
  const bitTimeNs = totalTq * tqTimeNs;
  const baudRateKbps = bitTimeNs > 0 ? Math.round((1e9 / bitTimeNs) / 1000) : 0;
  const samplePoint = totalTq > 0 ? Math.round(((1 + Number(tseg1)) / totalTq) * 100) : 0;

  return (
    <div className="w-full">
      {/* ── Sub-header Navigation / Quick Jump Bar ── */}
      <div className="border-b border-border/80 bg-muted/20 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">AeroSys Telemetry & Tools</span>
            <span>/</span>
            <span>Field Equipment & Workbench</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#tools-grid"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Wrench className="w-3 h-3 text-primary" />
              Toolbox
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Calculator className="w-3 h-3 text-emerald-500" />
              CAN Timing
            </a>
            <a
              href="#resources"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <BookOpen className="w-3 h-3 text-blue-500" />
              Resources
            </a>
            <a
              href="#social"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Mail className="w-3 h-3 text-rose-500" />
              Connect
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* ── Hero Section ── */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workbench, DAQ & Aerospace Equipment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Engineering Tools &amp; Production Testbeds
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A comprehensive catalog of automated Hardware-in-the-Loop (HIL) testbeds,
            In-Circuit Test (ICT) fixtures, embedded microcontroller environments, and
            Class-3 SMT manufacturing standards utilized in mission-critical avionics.
          </p>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div id="tools-grid" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools, protocols, instruments, or standards…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Showing <span className="font-semibold text-foreground">{filteredTools.length}</span> of{" "}
              {ENGINEERING_TOOLS.length} tools
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {TOOLS_CATEGORIES.map((category) => {
              const count =
                category === "All"
                  ? ENGINEERING_TOOLS.length
                  : ENGINEERING_TOOLS.filter((t) => t.category === category).length;

              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tools Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl border border-border/80 bg-muted/40 flex items-center justify-center">
                      {getIcon(tool.iconType)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  {tool.link && (
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      title={`Visit ${tool.name}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-xs font-medium text-foreground/90 leading-snug">
                  {tool.tagline}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tool.roleUsed}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredTools.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-2">
              <Wrench className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No matching engineering tools found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search query or reset the category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* ── Featured Interactive Utility: CAN Timing Calculator ── */}
        <section
          id="calculator"
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                Featured Engineering Utility
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                CAN / CAN FD Bitrate &amp; Sample Point Calculator
              </h2>
              <p className="text-xs text-muted-foreground">
                Calculate real-time bit timing parameters for STM32 bxCAN/FDCAN and Vector CANoe configurations.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-muted/40 px-4 py-2.5 rounded-xl border border-border/70">
              <div className="text-right">
                <span className="block text-[10px] text-muted-foreground uppercase font-mono">Baud Rate</span>
                <span className="text-lg font-black font-mono text-foreground">
                  {baudRateKbps} <span className="text-xs text-muted-foreground font-normal">kbps</span>
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <span className="block text-[10px] text-muted-foreground uppercase font-mono">Sample Point</span>
                <span className="text-lg font-black font-mono text-emerald-500">
                  {samplePoint}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground">
                APB Bus Clock (MHz)
              </label>
              <input
                type="number"
                min="1"
                max="240"
                value={clockMhz}
                onChange={(e) => setClockMhz(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">e.g. 48 MHz for STM32F4 APB1</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground">
                Baud Prescaler (BRP)
              </label>
              <input
                type="number"
                min="1"
                max="1024"
                value={prescaler}
                onChange={(e) => setPrescaler(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Prescaler value</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground">
                Time Segment 1 (TSEG1)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={tseg1}
                onChange={(e) => setTseg1(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Propagation + Phase 1 (1–31 tq)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground">
                Time Segment 2 (TSEG2)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={tseg2}
                onChange={(e) => setTseg2(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground">Phase 2 segment (1–16 tq)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Recommended sample point for CiA 301 is between <strong>75%</strong> and <strong>87.5%</strong>.</span>
            </div>
            <div className="font-mono text-[11px]">
              Total Time Quanta (Tq): <strong>{totalTq}</strong> • Tq Duration: <strong>{tqTimeNs.toFixed(1)} ns</strong>
            </div>
          </div>
        </section>

        {/* ── Section: Resources (#resources) ── */}
        <section
          id="resources"
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Technical Artifacts &amp; Blueprints
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Curated Engineering Documentation &amp; Blueprints
              </h2>
              <p className="text-xs text-muted-foreground">
                Engineering manuals, IPC workmanship checklists, and HIL testbed architectures.
              </p>
            </div>

            <Link
              href="/#resources"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              View on Portfolio Home
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioData.resources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {res.formatBadge}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground">
                  Tag: <span className="text-foreground">{res.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Section: Social & Contact (#social) ── */}
        <section
          id="social"
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                Connect &amp; Collaborate
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Direct Channels &amp; Professional Network
              </h2>
              <p className="text-xs text-muted-foreground">
                Get in touch for aerospace avionics, embedded electronics, or test engineering inquiries.
              </p>
            </div>

            <Link
              href="/#social"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Direct Dispatch Form
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData.socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target={soc.url.startsWith("http") ? "_blank" : undefined}
                rel={soc.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl border border-border bg-background flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                  {soc.id.includes("email") ? (
                    <Mail className="w-4 h-4" />
                  ) : soc.id.includes("phone") ? (
                    <Phone className="w-4 h-4" />
                  ) : soc.id.includes("linkedin") ? (
                    <LinkedinIcon className="w-4 h-4" />
                  ) : soc.id.includes("github") ? (
                    <GithubIcon className="w-4 h-4" />
                  ) : (
                    <TwitterIcon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {soc.platform}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="block text-xs font-mono text-muted-foreground truncate">
                    {soc.handle}
                  </span>
                  <p className="text-[11px] text-muted-foreground/80 mt-1 line-clamp-2">
                    {soc.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
