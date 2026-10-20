import React, { Suspense } from "react";
import { getUncachedLiveStockTicker } from "@/lib/data-service";
import { CacheStatusBadge } from "./CacheStatusBadge";
import { CodeSnippet } from "./CodeSnippet";

// Async component that fetches live, uncached data
async function LiveTickerList() {
  const tickers = await getUncachedLiveStockTicker();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {tickers.map((t) => (
        <div
          key={t.symbol}
          className="rounded-xl border border-border/60 bg-muted/30 p-3 flex flex-col justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-foreground">{t.symbol}</span>
            <span
              className={`text-[11px] font-semibold ${
                t.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {t.change >= 0 ? `+${t.change}%` : `${t.change}%`}
            </span>
          </div>
          <div className="mt-2">
            <div className="text-base font-semibold text-foreground">${t.price}</div>
            <div className="text-[10px] text-muted-foreground truncate">{t.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TickerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border/40 bg-muted/20 p-3 h-20">
          <div className="flex justify-between">
            <div className="h-3 w-12 bg-muted/60 rounded" />
            <div className="h-3 w-8 bg-muted/60 rounded" />
          </div>
          <div className="mt-3 h-5 w-16 bg-muted/80 rounded" />
        </div>
      ))}
    </div>
  );
}

export function StreamingUncachedDemo() {
  const codeExample = `// app/components/LiveTicker.tsx
import { Suspense } from 'react'

async function LiveStockTicker() {
  // Fresh on every request (no 'use cache')
  const tickers = await fetchLivePrices()
  return <TickerGrid items={tickers} />
}

export function Page() {
  return (
    <Suspense fallback={<TickerSkeleton />}>
      <LiveStockTicker />
    </Suspense>
  )
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">3. Streaming Uncached Data</h3>
            <CacheStatusBadge type="streaming" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Data that must be fresh on every request should NOT use <code>&apos;use cache&apos;</code>. Wrap in{" "}
            <code>&lt;Suspense&gt;</code> to stream dynamic slots.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Streams at Request Time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Streamed Result */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Streamed Prices (Simulated Latency)
          </span>
          <Suspense fallback={<TickerSkeleton />}>
            <LiveTickerList />
          </Suspense>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
            ⚡ <strong>Static Shell Benefit:</strong> The page header and surrounding layout ship immediately. The
            browser displays the fallback skeleton and streams in live numbers as soon as they resolve on the server.
          </div>
        </div>

        {/* Code Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next.js Implementation Pattern
          </span>
          <CodeSnippet
            title="components/StreamingUncached.tsx"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#streaming-uncached-data"
          />
        </div>
      </div>
    </div>
  );
}
