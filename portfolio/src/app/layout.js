import "./app.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Portfolio",
  description: "Personal portfolio showcasing selected work and experience.",
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

    // Apply classes
    var root = document.documentElement;
    root.classList.remove("dark", "cyberpunk");
    if (theme === "dark")       root.classList.add("dark");
    if (theme === "cyberpunk")  root.classList.add("dark", "cyberpunk");
    // "light" → no classes added
  } catch (e) {
    // If storage is blocked, default to dark
    document.documentElement.classList.add("dark");
  }
})();
`;

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  return (
    <html
      lang="en"
      className={
        theme === "light"
          ? ""
          : theme === "cyberpunk"
          ? "dark cyberpunk"
          : "dark"
      }
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
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20">
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
