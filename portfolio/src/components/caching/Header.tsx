import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";

export async function Header() {
  const cookieStore = await cookies();
  const activeSession = cookieStore.get("session")?.value || "guest-session-42";
  const activeTheme = cookieStore.get("theme")?.value || "light";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="flex w-full items-center justify-between px-4 lg:px-8 h-16">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-foreground text-base">Next.js Caching</span>
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Cache Components &amp; Partial Prerendering
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Studio
          </Link>
          <Link
            href="/shop/nextjs-15-pro"
            prefetch={true}
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
          >
            <span>Static Shell</span>
            <span className="rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1 text-[10px] font-mono">
              [slug]
            </span>
          </Link>
          <Link
            href="/search?q=cache"
            prefetch={true}
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
          >
            <span>Instant Search</span>
            <span className="rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 px-1 text-[10px] font-mono">
              ?q=
            </span>
          </Link>
          <Link
            href="/profile"
            prefetch={true}
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Runtime Session
          </Link>
        </nav>

        {/* Runtime Context Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Session:</span>
            <span className="font-mono font-medium text-foreground max-w-[100px] truncate" title={activeSession}>
              {activeSession}
            </span>
            <span className="text-border">|</span>
            <span className="capitalize text-muted-foreground">{activeTheme}</span>
          </div>

          <a
            href="https://nextjs.org/docs/app/getting-started/caching"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer shadow-xs"
          >
            <span>Docs</span>
            <span className="text-muted-foreground">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
