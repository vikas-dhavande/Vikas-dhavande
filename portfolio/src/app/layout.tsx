import "./app.css";
import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { InitialWebLoader } from "@/components/ui/InitialWebLoader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Vikas | Portfolio",
  description: "Personal portfolio showcasing selected work and experience.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

/**
 * Inline script that runs synchronously BEFORE first paint.
 * Priority order: cookie → localStorage → default "dark"
 * Runs in <head> so the correct class is on <html> before any CSS is parsed.
 */
const themeScript = `
(function () {
  try {
    var theme = null;

    // 1. Try to read theme from cookie (available on client too)
    var match = document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);
    if (match) theme = match[1];

    // 2. Fall back to localStorage
    if (!theme) theme = localStorage.getItem("theme");

    // 3. Final fallback
    if (!theme) theme = "dark";

    // Apply classes and data-theme attribute
    var root = document.documentElement;
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
  } catch (e) {
    // If storage is blocked, default to dark
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("theme")?.value;
  const theme = rawTheme === "light" || rawTheme === "cyberpunk" || rawTheme === "dark" ? rawTheme : "dark";

  return (
    <html
      lang="en"
      className={
        theme === "light"
          ? "light"
          : theme === "cyberpunk"
          ? "dark cyberpunk"
          : "dark"
      }
      data-theme={theme}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking anti-flash script — must be first in <head> */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:opsz,wght@14..32,300;400;500;600;700;800&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20">
        <ThemeProvider initialTheme={theme}>
          <InitialWebLoader />
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
