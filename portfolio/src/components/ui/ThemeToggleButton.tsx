"use client";

import React from "react";
import { Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";

const THEME_META = {
  light:     { icon: Sun,  label: "Light",     next: "Dark" },
  dark:      { icon: Moon, label: "Dark",      next: "Cyberpunk" },
  cyberpunk: { icon: Zap,  label: "Cyberpunk", next: "Light" },
} as const;

export function ThemeToggleButton() {
  const { theme, cycleTheme } = useTheme();
  const currentMeta = THEME_META[theme] || THEME_META.light;
  const { icon: Icon, label, next } = currentMeta;

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={`Switch to ${next} theme`}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted transition-all duration-150 cursor-pointer shadow-xs"
      >
        <Icon
          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
          strokeWidth={1.75}
        />
      </button>

      {/* Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        <div className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground whitespace-nowrap shadow-xl">
          <span className="text-foreground">{label}</span>
          <span className="text-muted-foreground/60"> → {next}</span>
        </div>
        {/* Arrow */}
        <div className="mx-auto w-2 h-1 overflow-hidden -mt-px flex justify-center">
          <div className="w-2 h-2 rotate-45 border-t border-l border-border bg-card -translate-y-1" />
        </div>
      </div>
    </div>
  );
}
