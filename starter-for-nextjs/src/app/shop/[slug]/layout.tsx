import React, { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/caching/Header";
import { CacheStatusBadge } from "@/components/caching/CacheStatusBadge";

// Maximizing the static shell:
// Note: This Layout is NOT async! It never awaits params at the root.
// Therefore, the Sidebar, navigation, and surrounding shell are completely prerendered!
export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="w-full px-4 lg:px-8 py-8 flex-1">
        {/* Banner */}
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <CacheStatusBadge type="static-shell" label="Maximized Static Shell" />
            <span className="text-xs text-muted-foreground">
              This layout does not <code>await params</code>. The entire frame is prerendered in the static shell.
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            ← Back to Studio Overview
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Static Sidebar (Part of CDN Static Shell) */}
          <aside className="md:col-span-1 rounded-2xl border border-border bg-card p-5 h-fit shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catalog Navigation
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Static" />
            </div>

            <nav className="flex flex-col gap-1.5 text-xs">
              {[
                { slug: "nextjs-15-pro", name: "Next.js 15 Pro Suite" },
                { slug: "edge-cache-cdn", name: "Edge Cache CDN" },
                { slug: "turbopack-optimizer", name: "Turbopack Optimizer" },
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`/shop/${item.slug}`}
                  prefetch={true}
                  className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">→</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground border border-border/40">
              ⚡ <strong>Instant Transitions:</strong> Clicking catalog links switches URLs instantly with zero
              re-rendering of this sidebar.
            </div>
          </aside>

          {/* Dynamic Content Area */}
          <div className="md:col-span-3">
            {/* Dynamic slug heading deferred into a Suspense boundary */}
            <div className="mb-4">
              <Suspense
                fallback={
                  <div className="h-9 w-64 bg-muted/60 animate-pulse rounded-lg" />
                }
              >
                {params.then(({ slug }) => (
                  <SlugHeading slug={slug} />
                ))}
              </Suspense>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SlugHeading({ slug }: { slug: string }) {
  return (
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-bold tracking-tight text-foreground capitalize">
        Product: {slug.replace(/-/g, " ")}
      </h1>
      <span className="font-mono text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground border border-border">
        [slug]: {slug}
      </span>
    </div>
  );
}
