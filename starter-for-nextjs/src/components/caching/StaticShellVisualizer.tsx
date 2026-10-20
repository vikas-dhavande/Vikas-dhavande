"use client";

import React, { useState } from "react";

export function StaticShellVisualizer() {
  const [activeTab, setActiveTab] = useState<"shell" | "cached" | "streaming">("shell");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Partial Prerendering (PPR) &amp; Static Shell Anatomy
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Visualizing how Next.js unifies Static Shell, Cached RSC Payloads, and Streaming Slices.
          </p>
        </div>
        <div className="flex rounded-lg border border-border p-1 bg-muted/40 gap-1 text-xs">
          <button
            onClick={() => setActiveTab("shell")}
            className={`rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              activeTab === "shell" ? "bg-emerald-500 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            1. Static Shell
          </button>
          <button
            onClick={() => setActiveTab("cached")}
            className={`rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              activeTab === "cached" ? "bg-sky-500 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2. &apos;use cache&apos;
          </button>
          <button
            onClick={() => setActiveTab("streaming")}
            className={`rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              activeTab === "streaming" ? "bg-amber-500 text-black shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            3. &lt;Suspense&gt;
          </button>
        </div>
      </div>

      {/* Layer Diagram */}
      <div className="relative rounded-xl border border-border/70 bg-muted/20 p-5 overflow-hidden">
        {/* Layer 1: App Shell Frame */}
        <div
          className={`rounded-xl border-2 p-4 transition-all duration-300 ${
            activeTab === "shell"
              ? "border-emerald-500 bg-emerald-500/10 shadow-md"
              : "border-emerald-500/30 bg-background/50"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Layer 1: Static App Shell (Served instantly from Edge CDN)</span>
            </span>
            <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
              TTFB: ~15ms
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Contains headers, navigation bars, footers, CSS links, and predictable module constants. Next.js produces
            this HTML shell at build time.
          </p>

          {/* Nested Slot 2: Cached Data / UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div
              className={`rounded-lg border-2 p-3 transition-all duration-300 ${
                activeTab === "cached"
                  ? "border-sky-500 bg-sky-500/15 shadow-sm"
                  : "border-sky-500/30 bg-background/60"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
                <span>Layer 2: Cached Slot (&apos;use cache&apos;)</span>
                <span className="font-mono text-[10px] bg-sky-500/20 px-1.5 py-0.5 rounded">cacheLife</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Articles, catalogs, user lists, and cached layouts. Revalidated on-demand (tags) or periodically.
              </p>
            </div>

            {/* Nested Slot 3: Streaming Dynamic */}
            <div
              className={`rounded-lg border-2 p-3 transition-all duration-300 ${
                activeTab === "streaming"
                  ? "border-amber-500 bg-amber-500/15 shadow-sm"
                  : "border-amber-500/30 bg-background/60"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                <span>Layer 3: Streaming Slot (&lt;Suspense&gt;)</span>
                <span className="font-mono text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">connection()</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Live prices, carts, real-time counters, user cookies. Fallback rendered into Shell, actual data streams
                in over HTTP chunked transfer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
          <div className="font-semibold text-foreground mb-1">1. Maximizing the Static Shell</div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Push async reads (like <code>cookies()</code> or dynamic <code>params</code>) down into leaf components so the
            parent layout remains completely static.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
          <div className="font-semibold text-foreground mb-1">2. Partial Prefetching</div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Hovering over a <code>&lt;Link prefetch=&#123;true&#125;&gt;</code> immediately fetches the App Shell into the
            client browser cache before the user clicks.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
          <div className="font-semibold text-foreground mb-1">3. Zero Route Deopt</div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Reading cookies or headers no longer turns the entire route into a slow SSR block. Only the specific
            Suspense subtree streams dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
