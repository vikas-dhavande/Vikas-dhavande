"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { setCookiePreferenceAction } from "@/app/actions";

export type Theme = "dark" | "light" | "cyberpunk";

export const CYCLE: Theme[] = ["dark", "light", "cyberpunk"];

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  cycleTheme: () => {},
  setTheme: () => {},
});

/** Apply the correct classes and attributes to <html> immediately on the client. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  
  // Clean all existing theme markers
  root.classList.remove("dark", "cyberpunk", "light");
  root.removeAttribute("data-theme");

  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else if (theme === "cyberpunk") {
    root.classList.add("dark", "cyberpunk");
    root.setAttribute("data-theme", "cyberpunk");
  } else {
    // "light"
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
  }
}

/** Synchronously persist to cookie and localStorage. */
function persistTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  // 1. Immediate client cookie for instant SSR recognition on reloads
  try {
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}

  // 2. localStorage for anti-flash script fallback
  try {
    localStorage.setItem("theme", theme);
  } catch {}

  // 3. Background server cookie sync
  try {
    setCookiePreferenceAction("theme", theme).catch(() => {});
  } catch {}
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || "dark");

  // On mount, sync with localStorage if user previously selected a theme
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored && CYCLE.includes(stored)) {
        if (stored !== theme) {
          setThemeState(stored);
        }
        applyTheme(stored);
      } else {
        applyTheme(theme);
      }
    } catch {
      applyTheme(theme);
    }
  }, []);

  const changeTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    persistTheme(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextIndex = (CYCLE.indexOf(current) + 1) % CYCLE.length;
      const next = CYCLE[nextIndex];
      applyTheme(next);
      persistTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}