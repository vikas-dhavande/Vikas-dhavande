import React from "react";

export type CacheBadgeType =
  | "static-shell"
  | "data-cache"
  | "ui-cache"
  | "streaming"
  | "runtime-api"
  | "predictable";

interface Props {
  type: CacheBadgeType;
  label?: string;
  className?: string;
}

export function CacheStatusBadge({ type, label, className = "" }: Props) {
  const configs: Record<
    CacheBadgeType,
    { title: string; desc: string; bg: string; text: string; border: string; dot: string }
  > = {
    "static-shell": {
      title: label || "Static Shell (CDN Prerender)",
      desc: "Prerendered at build time, instant first byte",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-500/30",
      dot: "bg-emerald-500",
    },
    "data-cache": {
      title: label || "Data-Level Cache ('use cache')",
      desc: "Cached async query with cacheLife & cacheTag",
      bg: "bg-sky-500/10 dark:bg-sky-500/20",
      text: "text-sky-700 dark:text-sky-400",
      border: "border-sky-500/30",
      dot: "bg-sky-500",
    },
    "ui-cache": {
      title: label || "UI-Level Cache ('use cache')",
      desc: "Entire component subtree cached to RSC payload",
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-500/30",
      dot: "bg-indigo-500",
    },
    streaming: {
      title: label || "Streaming Uncached (<Suspense>)",
      desc: "Evaluates on request, streams into fallback shell",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/30",
      dot: "bg-amber-500 animate-pulse",
    },
    "runtime-api": {
      title: label || "Runtime API Gated (cookies / params)",
      desc: "Reads request-time cookies or URL params",
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-500/30",
      dot: "bg-purple-500",
    },
    predictable: {
      title: label || "Predictable Values (Module Scope)",
      desc: "Computed once at module evaluation or build time",
      bg: "bg-slate-500/10 dark:bg-slate-500/20",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-500/30",
      dot: "bg-slate-400",
    },
  };

  const c = configs[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm transition-all ${c.bg} ${c.text} ${c.border} ${className}`}
      title={c.desc}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      <span>{c.title}</span>
    </span>
  );
}
