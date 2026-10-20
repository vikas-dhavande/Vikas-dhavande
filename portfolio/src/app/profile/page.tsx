import React, { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getCachedUserProfile } from "@/lib/data-service";
import { Header } from "@/components/caching/Header";
import { CacheStatusBadge } from "@/components/caching/CacheStatusBadge";
import { RevalidationControls } from "@/components/caching/RevalidationControls";
import { CodeSnippet } from "@/components/caching/CodeSnippet";

async function ProfileDetails() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value || "guest-session-42";
  const currentTheme = cookieStore.get("theme")?.value || "light";

  // sessionId is passed to cached function and becomes part of the cache key!
  const profile = await getCachedUserProfile(sessionId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Session Metadata Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Client Cookie Identity
            </span>
            <CacheStatusBadge type="runtime-api" label="Extracted from cookies()" />
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex flex-col gap-2">
            <div className="text-xs text-muted-foreground">Active Session ID:</div>
            <div className="font-mono text-sm font-bold text-foreground break-all">{sessionId}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Active Theme: <span className="capitalize font-semibold text-foreground">{currentTheme}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
          🍪 <code>cookies()</code> is evaluated on the server at request time without deopting the layout.
        </div>
      </div>

      {/* Cached Profile Output */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Cached Profile Result
            </span>
            <span className="text-[10px] font-mono rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5">
              &apos;use cache&apos;
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">{profile.tier}</span>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                {profile.quotaRemaining.toLocaleString()} API ops remaining
              </span>
            </div>

            <div className="rounded-xl bg-background/80 p-3.5 border border-purple-500/20 text-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Enabled Entitlements</span>
              <ul className="mt-2 space-y-1 text-foreground">
                {profile.featuresEnabled.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-xs">
                    <span className="text-purple-500">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-500/20 text-[11px] text-muted-foreground">
          🕒 <strong>Last Evaluated At:</strong> {new Date(profile.lastEvaluatedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const session = cookieStore.get("session")?.value || "guest-session-42";

  const codeExample = `// 1. Parent reads request-time cookies
async function ProfilePage() {
  const session = (await cookies()).get('session')?.value
  return <CachedUserProfile sessionId={session} />
}

// 2. Child is cached; sessionId becomes the cache key
async function CachedUserProfile({ sessionId }: { sessionId: string }) {
  'use cache'
  cacheLife('minutes')
  return await fetchProfile(sessionId)
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
                Runtime Session &amp; Cookie Isolation
              </h1>
              <CacheStatusBadge type="runtime-api" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Extract user-specific session cookies and pass them as arguments to <code>&apos;use cache&apos;</code>{" "}
              functions to enable isolated, safe multi-tenant caching.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 w-fit"
          >
            ← Back to Studio Overview
          </Link>
        </div>

        {/* Live Controller */}
        <RevalidationControls currentTheme={theme} currentSession={session} />

        {/* Live Details */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
              <div className="h-48 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            </div>
          }
        >
          <ProfileDetails />
        </Suspense>

        {/* Explainer */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Cache Key Isolation Details</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Because arguments to functions using <code>&apos;use cache&apos;</code> automatically become part of the
            internal cache key, calls with different session IDs generate isolated RSC payloads. This allows private or
            tenant-specific data to be cached safely and included in client prefetches.
          </p>
          <CodeSnippet
            title="Passing Runtime Values Pattern"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#passing-runtime-values-to-cached-functions"
          />
        </div>
      </main>
    </div>
  );
}
