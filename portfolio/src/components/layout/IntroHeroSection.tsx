"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/layout/ThemeProvider";

// Dynamic import with SSR disabled isolates Three.js into an asynchronous chunk,
// preventing main-thread blocking during critical Largest Contentful Paint (LCP)
const WaveGridBackground = dynamic(
  () => import("@/components/ui/wave-grid-background").then((mod) => mod.WaveGridBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 bg-background/50" />,
  }
);

const NAME = "VIKAS";

// Roughly fills ~92% of the viewport width regardless of name length.
const fontSizeVw = 92 / (NAME.length * 0.65);

export function IntroHeroSection() {
  const { theme } = useTheme();

  const waveColors = {
    dark: { base: "#09090b", high: "#e11d48" },
    cyberpunk: { base: "#0c081f", high: "#00ffcc" },
    light: { base: "#f4f4f5", high: "#2563eb" },
  }[theme] || { base: "#f4f4f5", high: "#2563eb" };

  return (
    <section
      id="explore"
      aria-label="Animated intro background"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b border-border bg-background transition-colors duration-300"
    >
      <WaveGridBackground
        className="absolute inset-0 z-0"
        colorBase={waveColors.base}
        colorHigh={waveColors.high}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-background/25 backdrop-blur-[1px]"
      />

      <h1
        className="pointer-events-none relative z-[2] w-full select-none whitespace-nowrap px-[4vw] text-center font-extrabold uppercase leading-none tracking-tighter text-foreground drop-shadow-sm transition-colors duration-300"
        style={{ fontSize: `${fontSizeVw}vw` }}
      >
        {NAME}
      </h1>
    </section>
  );
}

export default IntroHeroSection;