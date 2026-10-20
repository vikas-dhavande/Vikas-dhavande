import React from "react";
import { getCachedUsers } from "@/lib/data-service";
import { CacheStatusBadge } from "./CacheStatusBadge";
import { CodeSnippet } from "./CodeSnippet";

export async function DataLevelCacheDemo() {
  const data = await getCachedUsers();

  const codeExample = `// app/lib/data-service.ts
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

export async function getCachedUsers() {
  'use cache'
  cacheLife('hours')
  cacheTag('users')

  return await db.query('SELECT * FROM users')
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">1. Data-Level Caching</h3>
            <CacheStatusBadge type="data-cache" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Apply <code>&apos;use cache&apos;</code> inside an async function to cache raw data queries independent of UI.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-muted/50 rounded-lg px-3 py-1.5 border border-border/60">
          <span className="text-muted-foreground">Cached At:</span>
          <span className="text-primary font-medium">{data.formattedTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rendered Users Output */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rendered Data Result (Tag: &quot;users&quot;)
          </span>
          <div className="flex flex-col gap-2.5">
            {data.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-foreground">{user.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      user.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <span className="text-[11px] text-muted-foreground capitalize">{user.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-2.5 text-[11px] text-sky-800 dark:text-sky-300">
            💡 <strong>Notice:</strong> Reloading the page returns this exact payload instantly without querying the
            data source again. Trigger <code>revalidateTag(&quot;users&quot;)</code> above to refresh.
          </div>
        </div>

        {/* Code Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next.js Implementation Pattern
          </span>
          <CodeSnippet
            title="lib/data-service.ts"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#data-level-caching"
          />
        </div>
      </div>
    </div>
  );
}
