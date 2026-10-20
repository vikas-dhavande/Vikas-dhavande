"use client";

import React, { useState } from "react";

interface Props {
  title?: string;
  code: string;
  language?: string;
  highlightLines?: number[];
  docLink?: string;
}

export function CodeSnippet({
  title,
  code,
  language = "tsx",
  docLink,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-xs backdrop-blur-md">
      {(title || docLink) && (
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2 font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary/40" />
            <span>{title || "Example Code"}</span>
          </div>
          <div className="flex items-center gap-2">
            {docLink && (
              <a
                href={docLink}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-primary hover:underline"
              >
                Docs ↗
              </a>
            )}
            <button
              onClick={handleCopy}
              className="rounded-md border border-border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-3.5 font-mono text-[12px] leading-relaxed text-foreground/90">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
