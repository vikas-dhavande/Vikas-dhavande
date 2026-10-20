"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { setCookiePreferenceAction } from "@/app/actions";

type Theme = "dark" | "light" | "cyberpunk";

const CYCLE: Theme[] = ["dark", "light", "cyberpunk"];

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  cycleTheme: () => {},
});

/** Apply the correct classes to <html> immediately on the client. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "cyberpunk");
  if (theme === "dark") root.classList.add("dark");
  if (theme === "cyberpunk") root.classList.add("dark", "cyberpunk");
  // "light" -> no classes
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const cycleTheme = useCallback(() => {
    // Compute next theme value outside of setTheme updater
    setTheme((current) => {
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];

      // 1. Apply to DOM immediately — no flash, no reload
      applyTheme(next);

      // 2. Persist to localStorage for the blocking script fallback
      try {
        localStorage.setItem("theme", next);
      } catch {}

      // 3. Persist cookie via server action — called via setTimeout so it
      //    fires AFTER React has finished this render cycle, avoiding the
      //    "setState during render" error caused by revalidatePath() inside
      //    the server action triggering a router update mid-render.
      setTimeout(() => {
        setCookiePreferenceAction("theme", next).catch(() => {});
      }, 0);

      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}