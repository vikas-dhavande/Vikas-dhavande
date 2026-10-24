"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Theme = "dark" | "light" | "cyberpunk";

export const CYCLE: Theme[] = ["light", "dark", "cyberpunk"];

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
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
}

export function ThemeProvider({
  initialTheme = "light",
  children,
}: {
  initialTheme?: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || "light");

  // On mount, check if user had a saved theme in localStorage that differs from SSR
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored && CYCLE.includes(stored) && stored !== theme) {
        setThemeState(stored);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever theme changes, apply DOM classes and persist (runs after render commit)
  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const changeTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextIndex = (CYCLE.indexOf(current) + 1) % CYCLE.length;
      return CYCLE[nextIndex];
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