import React, { Suspense } from "react";
import Link from "next/link";
import { searchProducts } from "@/lib/data-service";
import { Header } from "@/components/caching/Header";
import { CacheStatusBadge } from "@/components/caching/CacheStatusBadge";
import { CodeSnippet } from "@/components/caching/CodeSnippet";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ searchParamsPromise }: { searchParamsPromise: Promise<{ q?: string }> }) {
  const { q } = await searchParamsPromise;
  const query = q || "";
  const { results, count, cachedAt } = await searchProducts(query);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
        <div>
          Showing <strong>{count}</strong> result{count === 1 ? "" : "s"} for query:{" "}
          <span className="font-mono text-foreground font-semibold">&quot;{query || "(all)"}&quot;</span>
        </div>
        <div className="font-mono text-[11px]">
          Cached At: <span className="text-primary">{new Date(cachedAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">${item.price}</span>
              <Link
                href={`/shop/${item.slug}`}
                prefetch={true}
                className="text-xs font-medium text-primary hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border/40 bg-muted/20 p-4 h-36">
          <div className="h-3 w-16 bg-muted/60 rounded mb-2" />
          <div className="h-5 w-3/4 bg-muted/80 rounded mb-3" />
          <div className="h-3 w-full bg-muted/40 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  const codeExample = `// app/search/page.tsx
export default function SearchPage(props: PageProps<'/search'>) {
  return (
    <Suspense fallback={<p>Loading results...</p>}>
      <Results searchParams={props.searchParams} />
    </Suspense>
  )
}

async function Results({ searchParams }) {
  const { q } = await searchParams
  const results = await search(q)
  return <Items data={results} />
}

async function search(query) {
  'use cache'
  return db.search(query)
}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="w-full px-4 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Instant Navigation &amp; Prefetching
              </h1>
              <CacheStatusBadge type="data-cache" label="Cached by searchParams" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              With Partial Prefetching, hovering over <code>&lt;Link prefetch=&#123;true&#125;&gt;</code> resolves
              destination <code>searchParams</code> and pre-caches the result in the browser before the click!
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 w-fit"
          >
            ← Back to Studio Overview
          </Link>
        </div>

        {/* Quick Search Preset Tags */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Test Instant Navigation (Hover any link to prefetch):
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All Items", query: "" },
              { label: "Next.js", query: "next" },
              { label: "Cache", query: "cache" },
              { label: "Turbopack", query: "turbo" },
              { label: "Tools", query: "tools" },
            ].map((p) => (
              <Link
                key={p.label}
                href={p.query ? `/search?q=${p.query}` : "/search"}
                prefetch={true}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:bg-muted transition-all active:scale-95 shadow-2xs"
              >
                <span>{p.label}</span>
                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                  {p.query ? `?q=${p.query}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Search Results */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults searchParamsPromise={searchParams} />
        </Suspense>

        {/* Deep Dive Explainer */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">How Next.js handles URL searchParams caching</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            On direct visits, <code>&lt;Results&gt;</code> streams in behind its Suspense fallback. However, when navigating
            via <code>&lt;Link prefetch=&#123;true&#125;&gt;</code>, Next.js resolves <code>searchParams</code> ahead of
            time, pre-renders the cached output, and stores the serialized payload in the browser memory so the transition
            feels 100% instantaneous without any loading spinner.
          </p>
          <CodeSnippet
            title="Search Prefetching Pattern"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#prefetching"
          />
        </div>
      </main>
    </div>
  );
}
