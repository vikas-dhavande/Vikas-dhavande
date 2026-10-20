"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { revalidateTagAction, revalidatePathAction, setCookiePreferenceAction } from "@/app/actions";

export function RevalidationControls({
  currentTheme = "light",
  currentSession = "guest-session-42",
}: {
  currentTheme?: string;
  currentSession?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [actionHistory, setActionHistory] = useState<
    Array<{ id: string; time: string; text: string; success: boolean }>
  >([]);

  const addLog = (text: string, success: boolean) => {
    const time = new Date().toLocaleTimeString();
    setActionHistory((prev) => [{ id: Math.random().toString(), time, text, success }, ...prev.slice(0, 7)]);
  };

  const handleRevalidateTag = (tag: string) => {
    startTransition(async () => {
      setLastAction(`Revalidating tag "${tag}"...`);
      const res = await revalidateTagAction(tag);
      if (res.success) {
        addLog(`revalidateTag("${tag}") executed`, true);
        setLastAction(`✓ Revalidated tag "${tag}"`);
        router.refresh();
      } else {
        addLog(`Failed to revalidate tag: ${res.message}`, false);
        setLastAction(`✗ Error: ${res.message}`);
      }
    });
  };

  const handleRevalidatePath = (path: string) => {
    startTransition(async () => {
      setLastAction(`Revalidating path "${path}"...`);
      const res = await revalidatePathAction(path);
      if (res.success) {
        addLog(`revalidatePath("${path}") executed`, true);
        setLastAction(`✓ Revalidated path "${path}"`);
        router.refresh();
      } else {
        addLog(`Failed to revalidate path: ${res.message}`, false);
      }
    });
  };

  const handleSetSession = (sessionId: string) => {
    startTransition(async () => {
      setLastAction(`Setting session cookie to "${sessionId}"...`);
      await setCookiePreferenceAction("session", sessionId);
      addLog(`Cookie "session" set to "${sessionId}"`, true);
      setLastAction(`✓ Active session switched to: ${sessionId}`);
      router.refresh();
    });
  };

  const handleSetTheme = (theme: string) => {
    startTransition(async () => {
      setLastAction(`Setting theme cookie to "${theme}"...`);
      await setCookiePreferenceAction("theme", theme);
      addLog(`Cookie "theme" set to "${theme}"`, true);
      setLastAction(`✓ Theme updated to: ${theme}`);
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-base font-semibold text-foreground">Interactive Cache Controller</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Trigger Next.js Server Actions to bust cache tags, purge paths, or change runtime cookies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.refresh()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
          >
            <svg
              className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isPending ? "Updating..." : "Soft Refresh RSC"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Revalidate Tags */}
        <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-3.5 border border-border/40">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            On-Demand Tag Invalidation
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRevalidateTag("users")}
              disabled={isPending}
              className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              Tag: users
            </button>
            <button
              onClick={() => handleRevalidateTag("posts")}
              disabled={isPending}
              className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              Tag: posts
            </button>
            <button
              onClick={() => handleRevalidateTag("products")}
              disabled={isPending}
              className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              Tag: products
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Busts cached data tagged with <code>cacheTag()</code> without affecting other slots.
          </p>
        </div>

        {/* Path Revalidation */}
        <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-3.5 border border-border/40">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Path-Based Revalidation
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRevalidatePath("/")}
              disabled={isPending}
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              revalidatePath("/")
            </button>
            <button
              onClick={() => handleRevalidatePath("/shop/nextjs-15-pro")}
              disabled={isPending}
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              revalidatePath("/shop/...")
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Purges the prerendered HTML shell and RSC payload for specific route segments.
          </p>
        </div>

        {/* Runtime Cookie Simulation */}
        <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-3.5 border border-border/40">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Runtime Cookie Tester
          </span>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Session:</span>
              <button
                onClick={() => handleSetSession("guest-session-42")}
                disabled={isPending}
                className={`rounded px-2 py-0.5 text-xs font-medium border transition-all cursor-pointer ${
                  currentSession === "guest-session-42"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                Guest
              </button>
              <button
                onClick={() => handleSetSession("vip-user-999")}
                disabled={isPending}
                className={`rounded px-2 py-0.5 text-xs font-medium border transition-all cursor-pointer ${
                  currentSession === "vip-user-999"
                    ? "bg-amber-500 text-black border-amber-500 font-semibold"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                VIP ✨
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Theme:</span>
              {["light", "dark", "cyberpunk"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSetTheme(t)}
                  disabled={isPending}
                  className={`capitalize rounded px-2 py-0.5 text-xs font-medium border transition-all cursor-pointer ${
                    currentTheme === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Strip */}
      {lastAction && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary animate-in fade-in">
          <span>{lastAction}</span>
          <span className="text-[10px] text-muted-foreground">Updated in server</span>
        </div>
      )}

      {/* Log History */}
      {actionHistory.length > 0 && (
        <div className="mt-3 border-t border-border/40 pt-2">
          <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-2 mb-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Server Action Execution Log:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {actionHistory.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-foreground border border-border/40"
              >
                <span className="text-muted-foreground">[{item.time}]</span>
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
