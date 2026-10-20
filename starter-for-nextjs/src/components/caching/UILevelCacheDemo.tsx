import React from "react";
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { CacheStatusBadge } from "./CacheStatusBadge";
import { CodeSnippet } from "./CodeSnippet";

// This Server Component itself is cached at the UI Level!
export async function UILevelCacheDemo() {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  const renderTimestamp = new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    dateStyle: "medium",
  }).format(new Date());

  const featuredArticles = [
    {
      id: "art-1",
      title: "Zero-Latency Edge Navigation with Next.js App Shell",
      badge: "Core Concept",
      readTime: "4 min read",
      author: "Next.js Core Architecture",
    },
    {
      id: "art-2",
      title: "Granular Time-Based Revalidation with cacheLife Profiles",
      badge: "Performance",
      readTime: "6 min read",
      author: "Vercel Engineering",
    },
    {
      id: "art-3",
      title: "Handling Runtime Cookies without Deopting the Route",
      badge: "Patterns",
      readTime: "5 min read",
      author: "React Server Components Group",
    },
  ];

  const codeExample = `// app/components/CachedShowcase.tsx
import { cacheLife, cacheTag } from 'next/cache'

export async function CachedShowcase() {
  'use cache'
  cacheLife('minutes')
  cacheTag('posts')

  const posts = await fetchPosts()

  return (
    <div>
      {posts.map(p => <ArticleCard key={p.id} {...p} />)}
    </div>
  )
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">2. UI-Level Caching</h3>
            <CacheStatusBadge type="ui-cache" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placing <code>&apos;use cache&apos;</code> at the top of a component caches its entire rendered RSC UI subtree.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-muted/50 rounded-lg px-3 py-1.5 border border-border/60">
          <span className="text-muted-foreground">UI Rendered At:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{renderTimestamp}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rendered Articles Output */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cached Component Subtree (Tag: &quot;posts&quot;)
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="group rounded-xl border border-border/60 bg-muted/20 p-3.5 hover:border-indigo-500/40 hover:bg-muted/40 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span className="rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 font-medium">
                    {article.badge}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">By {article.author}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-[11px] text-indigo-800 dark:text-indigo-300">
            💡 <strong>Notice:</strong> The UI tree is serialized into the RSC payload at build or first render. No
            re-execution happens until the <code>cacheLife(&quot;minutes&quot;)</code> window elapses or tag &quot;posts&quot; is
            revalidated.
          </div>
        </div>

        {/* Code Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next.js Implementation Pattern
          </span>
          <CodeSnippet
            title="components/CachedShowcase.tsx"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#ui-level-caching"
          />
        </div>
      </div>
    </div>
  );
}
