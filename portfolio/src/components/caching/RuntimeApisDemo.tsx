import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { getCachedUserProfile } from "@/lib/data-service";
import { CacheStatusBadge } from "./CacheStatusBadge";
import { CodeSnippet } from "./CodeSnippet";

// 1. Uncached parent reads runtime API (cookies)
async function ProfileResolver() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value || "guest-session-42";
  const theme = cookieStore.get("theme")?.value || "light";

  return <CachedUserProfileCard sessionId={sessionId} currentTheme={theme} />;
}

// 2. Cached component receives extracted runtime value as prop
// The sessionId argument automatically becomes part of the cache key!
async function CachedUserProfileCard({
  sessionId,
  currentTheme,
}: {
  sessionId: string;
  currentTheme: string;
}) {
  const profile = await getCachedUserProfile(sessionId);

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-purple-700 dark:text-purple-400">
            Profile for Session:
          </span>
          <span className="font-mono text-xs font-bold text-foreground">{sessionId}</span>
        </div>
        <span className="text-[10px] font-mono rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5">
          {profile.tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-background/60 p-2.5 border border-border/60">
          <div className="text-[10px] text-muted-foreground">Session Tier</div>
          <div className="font-semibold text-foreground mt-0.5">{profile.tier}</div>
        </div>
        <div className="rounded-lg bg-background/60 p-2.5 border border-border/60">
          <div className="text-[10px] text-muted-foreground">Preferred Theme (Cookie)</div>
          <div className="font-semibold text-foreground capitalize mt-0.5">{currentTheme}</div>
        </div>
      </div>

      <div className="rounded-lg bg-background/60 p-2.5 border border-border/60 text-xs">
        <div className="text-[10px] text-muted-foreground mb-1">Assigned Entitlements:</div>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-foreground/90">
          {profile.featuresEnabled.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-muted-foreground">
        🔑 <strong>Cache Key Isolation:</strong> Passing <code>sessionId</code> into a function with{" "}
        <code>&apos;use cache&apos;</code> scopes cache entries strictly per session without leaking data between
        tenants.
      </p>
    </div>
  );
}

export function RuntimeApisDemo() {
  const codeExample = `// 1. Parent component reads runtime cookies inside Suspense
async function ProfileSection() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />
}

// 2. Cached component receives extracted value as a prop
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId automatically becomes part of the cache key!
  const user = await fetchUserData(sessionId)
  return <div>{user.name}</div>
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">5. Runtime APIs &amp; Parameter Passing</h3>
            <CacheStatusBadge type="runtime-api" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Extract runtime values from <code>cookies()</code>, <code>headers()</code>, or <code>params</code>, and pass
            them into cached functions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Profile Output */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Session-Gated Cached Output
          </span>
          <Suspense
            fallback={
              <div className="rounded-xl border border-border/40 bg-muted/20 p-4 animate-pulse h-40">
                <div className="h-4 w-32 bg-muted/60 rounded mb-2" />
                <div className="h-8 w-full bg-muted/70 rounded" />
              </div>
            }
          >
            <ProfileResolver />
          </Suspense>
          <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-2.5 text-[11px] text-purple-800 dark:text-purple-300">
            🧪 <strong>Try it:</strong> Use the Session toggle in the Controller above (switch between Guest and VIP) to
            see the cache key immediately branch into a separate cached entry!
          </div>
        </div>

        {/* Code Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next.js Implementation Pattern
          </span>
          <CodeSnippet
            title="Passing Runtime Values to use cache"
            code={codeExample}
            docLink="https://nextjs.org/docs/app/getting-started/caching#passing-runtime-values-to-cached-functions"
          />
        </div>
      </div>
    </div>
  );
}
