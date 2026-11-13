import "./app.css";
import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InitialWebLoader } from "@/components/ui/InitialWebLoader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vikas-dhavande.vercel.app"),
  title: "Vikas N Dhavande | Senior Avionics & Systems Engineer Portfolio",
  description:
    "Engineering portfolio of Vikas N Dhavande — Aerospace, Defense Avionics, Embedded Systems, RTOS & Industrial Electronics Specialist.",
  keywords: [
    "Vikas N Dhavande",
    "Avionics Engineer",
    "Hardware Systems Engineer",
    "Aerospace Defense Electronics",
    "Embedded Systems",
    "RTOS",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Vikas N Dhavande", url: "https://vikas-dhavande.vercel.app" }],
  creator: "Vikas N Dhavande",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vikas N Dhavande | Senior Avionics & Systems Engineer Portfolio",
    description:
      "Engineering portfolio of Vikas N Dhavande — Aerospace, Defense Avionics, Embedded Systems, RTOS & Industrial Electronics Specialist.",
    url: "https://vikas-dhavande.vercel.app",
    siteName: "Vikas N Dhavande Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikas N Dhavande | Senior Avionics & Systems Engineer Portfolio",
    description:
      "Engineering portfolio of Vikas N Dhavande — Aerospace, Defense Avionics, Embedded Systems, RTOS & Industrial Electronics Specialist.",
    creator: "@vikasdhavande",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
 * Priority order: cookie → localStorage → default "light"
 * Runs in <head> so the correct class is on <html> before any CSS is parsed.
 */
const themeScript = `
(function () {
  try {
    var theme = null;
    var match = document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);
    if (match) theme = match[1];
    if (!theme) theme = localStorage.getItem("theme");
    if (!theme) theme = "light";

    var root = document.documentElement;
    root.classList.remove("dark", "cyberpunk", "light", "looseleaf");
    root.removeAttribute("data-theme");
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else if (theme === "cyberpunk") {
      root.classList.add("dark", "cyberpunk");
      root.setAttribute("data-theme", "cyberpunk");
    } else if (theme === "looseleaf") {
      root.classList.add("light", "looseleaf");
      root.setAttribute("data-theme", "looseleaf");
    } else {
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  } catch (e) {
    document.documentElement.classList.add("light");
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${firaCode.variable} ${caveat.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Blocking anti-flash script — runs synchronously before CSS render */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
        <ThemeProvider initialTheme="light">
          <InitialWebLoader />
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
