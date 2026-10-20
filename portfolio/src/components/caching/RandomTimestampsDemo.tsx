import React, { Suspense } from "react";
import { getCachedTimestamp, getUncachedRequestTimestamp } from "@/lib/data-service";
import { CacheStatusBadge } from "./CacheStatusBadge";
import { CodeSnippet } from "./CodeSnippet";

async function UncachedTimestampWidget() {
  const req = await getUncachedRequestTimestamp();
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
          Request-Time Unique Value
        </span>
        <span className="text-[10px] font-mono rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 px-2 py-0.5">
          connection()
        </span>
      </div>
      <div className="font-mono text-sm font-bold text-foreground">{req.readable}</div>
      <div className="text-[11px] font-mono text-muted-foreground break-all">
        UUID: <span className="text-foreground">{req.id}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Changes on <strong>every single refresh</strong> because <code>await connection()</code> flags it as
        per-request dynamic.
      </p>
    </div>
  );
}

async function CachedTimestampWidget() {
  const cached = await getCachedTimestamp();
  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
          Cached Build/Revalidate Value
        </span>
        <span className="text-[10px] font-mono rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2 py-0.5">
          &apos;use cache&apos;
        </span>
      </div>
      <div className="font-mono text-sm font-bold text-foreground">{cached.readable}</div>
      <div className="text-[11px] font-mono text-muted-foreground break-all">
        UUID: <span className="text-foreground">{cached.id}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Stays <strong>identical across requests</strong> and across users until revalidated or expired.
      </p>
    </div>
  );
}

export function RandomTimestampsDemo() {
  const codeExample = `// Dynamic per-request (changes every hit):
import { connection } from 'next/server'
async function DynamicId() {
  await connection()
  return <p>{crypto.randomUUID()}</p>
}

// Cached value (consistent across hits):
async function CachedId() {
  'use cache'
  return <p>{crypto.randomUUID()}</p>
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">4. Random Values &amp; Timestamps</h3>
            <CacheStatusBadge type="streaming" label="connection() vs 'use cache'" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <code>Math.random()</code>, <code>Date.now()</code>, and <code>crypto.randomUUID()</code> require explicit
            handling in Next.js Cache Components.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Comparison Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Suspense
            fallback={
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 animate-pulse h-36">
                <div className="h-4 w-24 bg-muted/60 rounded mb-2" />
                <div className="h-6 w-32 bg-muted/80 rounded" />
              </div>
            }
          >
            <UncachedTimestampWidget />
          </Suspense>

          <CachedTimestampWidget />
        </div>

        {/* Code Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next.js Implementation Pattern
          </span>
          <CodeSnippet
            title="Random Values Handling"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#random-values-and-timestamps"
          />
        </div>
      </div>
    </div>
  );
}
