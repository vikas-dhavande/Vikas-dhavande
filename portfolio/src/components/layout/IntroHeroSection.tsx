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

const FIRST_NAME = "Vikas";
const LAST_NAME = "Dhavande";
const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`;
const ROLE_LINES = ["Product Engineer", "Building Products End to End"];
const LOCATION = "Bengaluru, India";

// Sizes the first name to fill ~92% of the viewport width.
const fontSizeVw = 92 / (FIRST_NAME.length * 0.6);

export function IntroHeroSection() {
  const { theme } = useTheme();

  const waveColors = {
    dark: { base: "#09090b", high: "#ffffffff" },
    cyberpunk: { base: "#0c081f", high: "#00ffcc" },
    light: { base: "#f4f4f5", high: "#2563eb" },
  }[theme] || { base: "#f4f4f5", high: "#2563eb" };

  return (
    <section
      id="explore"
      aria-label="Intro"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b border-border bg-background transition-colors duration-300"
    >
      {/* 1. Wave background (unchanged) */}
      <WaveGridBackground
        className="absolute inset-0 z-0"
        colorBase={waveColors.base}
        colorHigh={waveColors.high}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-background/25 backdrop-blur-[1px]"
      />

      {/* 2. Giant name: first name large, surname small on the next line */}
      <h1 className="pointer-events-none relative z-[2] w-full select-none px-[2vw] text-center text-foreground transition-colors duration-300">
        <span
          className="block whitespace-nowrap font-medium leading-none tracking-tighter"
          style={{ fontSize: `min(${fontSizeVw}vw, 55svh)` }}
        >
          {FIRST_NAME}
        </span>
        <span className="mt-[1.5vw] block text-[clamp(1rem,3vw,2.5rem)] font-light uppercase leading-none tracking-[0.3em]">
          {LAST_NAME}
        </span>
      </h1>

      {/* 4. Bottom corners */}
      <p className="absolute bottom-6 left-6 z-[5] text-[11px] font-medium uppercase tracking-[0.18em] text-foreground md:left-8">
        {LOCATION}
      </p>
      <p className="absolute bottom-6 right-6 z-[5] text-right text-2xl font-light leading-[1.1] tracking-tight text-foreground md:right-8 md:text-5xl">
        {ROLE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </section>
  );
}

export default IntroHeroSection;